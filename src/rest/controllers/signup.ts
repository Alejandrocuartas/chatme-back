import { Request, Response } from "express";

import helpers from "../../helpers";
import useCases from "../use-cases";

const signUp = async (req: Request, res: Response) => {
    try {
        let imgPath;
        // @ts-ignore
        const doNotExistFile = req.files === null;
        if (!doNotExistFile) {
            // @ts-ignore
            const { tempFilePath } = req.files.profile;
            imgPath = tempFilePath;
        }
        const newUser = await useCases.createUser({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
            last_name: req.body.last_name,
            photo: imgPath,
        });
        if (newUser) {
            const jwt = await helpers.jwtGenerator(newUser);
            return res.status(200).json({
                user: newUser,
                jwt,
            });
        }
        throw new Error("Unexpected error when creating new user.");
    } catch (error: any) {
        return res.status(401).json({
            error: error.message,
        });
    }
};

export default signUp;
