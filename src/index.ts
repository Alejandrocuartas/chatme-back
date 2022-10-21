import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import http from "http";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

import resolvers from "./graphql/resolvers";
import app from "./server";

const httpServer = http.createServer(app);
export const io = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io", "http://localhost:8080"],
        credentials: true,
    },
});
instrument(io, {
    auth: false,
});
const typeDefs = readFileSync(
    path.join(__dirname, "graphql/schema.graphql"),
    "utf8"
);
const orm = new PrismaClient();

export const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        return {
            orm,
            // @ts-ignore
            username: req.username,
        };
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

async function runServer() {
    // More required logic for integrating with Express
    await server.start();
    server.applyMiddleware({
        app,

        // By default, apollo-server hosts its GraphQL endpoint at the
        // server root. However, *other* Apollo Server packages host it at
        // /graphql. Optionally provide this to match apollo-server.
        path: "/graphql",
    });

    io.on("connection", (socket) => {
        // @ts-ignore
        socket.roomCode = "";

        socket.on("join-room", (room: string) => {
            socket.join(room);
            // @ts-ignore
            socket.roomCode = room;
        });
        socket.on("leave-room", (room: string) => {
            socket.leave(room);
            // @ts-ignore
            socket.roomCode = undefined;
        });
        socket.on(
            "send-message",
            async (data: { room: string; emitter: number }) => {
                const messages = await orm.message.findMany({
                    where: {
                        OR: [
                            {
                                emitter_id: data.emitter,
                                listener_id: +data.room,
                            },
                            {
                                emitter_id: +data.room,
                                listener_id: data.emitter,
                            },
                        ],
                    },
                });
                const room = `${data.emitter}+${data.room}`;
                io.to(room).emit("receive-message", messages);
            }
        );
        socket.on("users-search", async (username) => {
            const users = await orm.user.findMany({
                where: {
                    username: {
                        startsWith: username,
                    },
                },
                take: 10,
            });
            socket.emit("partial-search", users);
        });
    });

    // Modified server startup
    await new Promise<void>((resolve) =>
        httpServer.listen({ port: process.env.PORT || 3000 }, resolve)
    );
    console.log(`Server ready at ${process.env.PORT || 3000}`);
}

runServer();
