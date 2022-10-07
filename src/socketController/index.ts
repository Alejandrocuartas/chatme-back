import { Socket } from "socket.io";
import { PrismaClient } from "@prisma/client";

const orm = new PrismaClient();

const socketController = (socket: Socket) => {
    socket.on("join-room", (room) => {
        socket.join(room);
    });
    socket.on("leave-room", (room) => {
        socket.leave(room);
    });
    socket.on("send-message", (data: { room: string; message: string }) => {
        socket.to(data.room).emit("receive-message", data.message);
    });
    socket.on("users-search", async (username) => {
        const users = await orm.user.findMany({
            where: {
                username: {
                    startsWith: username,
                },
            },
        });
        socket.emit("partial-search", users);
    });
};

export default socketController;
