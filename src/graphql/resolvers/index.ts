import { User } from "@prisma/client";
import type { CreateUserInput, ContextResolver } from "../../types";

const getUsers = (
    parent: unknown,
    args: CreateUserInput,
    context: ContextResolver
): Promise<User[]> => {
    return context.orm.user.findMany();
};

export default {
    Query: {
        users: getUsers,
    },
};
