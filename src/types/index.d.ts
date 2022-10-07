import type { PrismaClient, User } from "@prisma/client";

export type CreateUserInput = {
    name: string;
    last_name: string;
    username: string;
    password: string;
    photo?: string;
};

export type LoginInput = {
    username: string;
    password: string;
};

export type CreateMessageInput = {
    message: string;
    emitter: User.id;
    listener: User.id;
};

export type ContextResolver = {
    orm: PrismaClient;
    username: string;
};

export type QueryMessagesInput = {
    person1: User.id;
    person2: User.id;
};
