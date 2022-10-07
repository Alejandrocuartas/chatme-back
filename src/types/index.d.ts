import type { PrismaClient } from "@prisma/client";

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

export type ContextResolver = {
    orm: PrismaClient;
};
