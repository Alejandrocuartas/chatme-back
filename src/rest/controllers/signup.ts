import { Request, Response } from "express";

import helpers from "../../helpers";
import useCases from "../use-cases";

const signUp = async (req: Request, res: Response) => {
    try {
        const newUser = await useCases.createUser(req.body);
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
