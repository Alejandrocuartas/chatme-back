import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import http from "http";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

import socketController from "./socketController";
import resolvers from "./graphql/resolvers";
import app from "./server";

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
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

!(async function () {
    // Same ApolloServer initialization as before, plus the drain plugin.
    const server = new ApolloServer({
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

    // More required logic for integrating with Express
    await server.start();
    server.applyMiddleware({
        app,

        // By default, apollo-server hosts its GraphQL endpoint at the
        // server root. However, *other* Apollo Server packages host it at
        // /graphql. Optionally provide this to match apollo-server.
        path: "/graphql",
    });

    io.on("connection", socketController);

    // Modified server startup
    await new Promise<void>((resolve) =>
        httpServer.listen({ port: process.env.PORT }, resolve)
    );
    console.log(`Server ready at ${process.env.PORT}`);
})();
