import { PrismaClient } from "@prisma/client";
import { CreateUserInput } from "../../../types";
import helpers from "../../../helpers";

const orm = new PrismaClient();

import encryptPass from "../../../helpers/encrypter";
const createUser = async (data: CreateUserInput) => {
    try {
        const hash = encryptPass(data.password);
        let photo;
        if (data.photo) {
            photo = await helpers.uploadPhoto(data.photo);
        }
        return orm.user.create({
            data: {
                ...data,
                password: hash,
                photo,
            },
        });
    } catch (error) {}
};

export default createUser;
