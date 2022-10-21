import { User, Message } from "@prisma/client";
const bcrypt = require("bcryptjs");
import helpers from "../../helpers";
import type {
    LoginInput,
    ContextResolver,
    CreateMessageInput,
    QueryMessagesInput,
} from "../../types";

const users = (
    parent: unknown,
    args: unknown,
    context: ContextResolver
): Promise<User[]> => {
    return context.orm.user.findMany();
};

const login = async (
    parent: unknown,
    args: LoginInput,
    context: ContextResolver
): Promise<{ user: User; jwt: string }> => {
    const { username, password } = args;
    const user = await context.orm.user.findUnique({
        where: {
            username,
        },
    });
    if (!user) {
        throw new Error("Username incorrect");
    }
    const correctPass = bcrypt.compareSync(password, user.password);
    if (!correctPass) {
        throw new Error("Password incorrect");
    }
    const jwt = await helpers.jwtGenerator(user);
    return {
        user,
        jwt,
    };
};

const newMessage = async (
    parent: unknown,
    args: CreateMessageInput,
    context: ContextResolver
): Promise<Message> => {
    const { message, emitter, listener } = args;
    const [existEmitter, existListener] = await Promise.all([
        context.orm.user.findUnique({ where: { id: emitter } }),
        context.orm.user.findUnique({ where: { id: listener } }),
    ]);
    if (!(existEmitter && existListener)) {
        throw new Error("Emitter or listener incorrect");
    }
    if (existEmitter.username !== context.username) {
        throw new Error("Unauthenticated");
    }
    return context.orm.message.create({
        data: {
            message,
            emitter_id: emitter,
            listener_id: listener,
        },
    });
};

const chats = async (
    parent: unknown,
    args: unknown,
    context: ContextResolver
): Promise<(User | undefined)[]> => {
    const { username } = context;
    if (!username) {
        throw new Error("Unauthenticated");
    }
    const user = await context.orm.user.findUnique({ where: { username } });
    if (!user) {
        throw new Error("Unexpected error with authentication");
    }
    const messages = await context.orm.message.findMany({
        where: {
            OR: [
                {
                    emitter_id: user.id,
                },
                {
                    listener_id: user.id,
                },
            ],
        },
        include: { emitter: true, listener: true },
    });
    const chats = messages.map((m) => {
        if (m.emitter_id === user.id) {
            return m.listener;
        }
        if (m.listener_id === user.id) {
            return m.emitter;
        }
    });
    const notRepeatedChats = helpers.cleanArray(chats);
    return notRepeatedChats;
};

const messages = async (
    parent: unknown,
    args: QueryMessagesInput,
    context: ContextResolver
): Promise<Message[]> => {
    const { username } = context;
    if (!username) {
        throw new Error("Unauthenticated");
    }
    return context.orm.message.findMany({
        where: {
            OR: [
                {
                    emitter_id: args.person1,
                    listener_id: args.person2,
                },
                {
                    emitter_id: args.person2,
                    listener_id: args.person1,
                },
            ],
        },
    });
};

const deleteMessage = async (
    parent: unknown,
    args: { id: number },
    context: ContextResolver
): Promise<Message> => {
    const { username } = context;
    if (!username) {
        throw new Error("Unauthenticated");
    }
    return context.orm.message.delete({
        where: {
            id: args.id,
        },
    });
};

export default {
    Query: {
        users,
        login,
        chats,
        messages,
    },
    Mutation: {
        newMessage,
        deleteMessage,
    },
};
