import { User } from "@prisma/client";
const bcrypt = require("bcryptjs");
import helpers from "../../helpers";
import type { LoginInput, ContextResolver } from "../../types";

const getUsers = (
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

export default {
    Query: {
        users: getUsers,
        login,
    },
};
