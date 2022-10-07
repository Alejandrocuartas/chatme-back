import { User } from "@prisma/client";

const jwt = require("jsonwebtoken");

const jwtGenerator = (payload: User): Promise<string> =>
    new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.JWT_KEY,
            {
                expiresIn: "12h",
            },
            (err: any, token: string) => {
                if (err) {
                    reject(new Error("could not generate jwt"));
                } else {
                    resolve(token);
                }
            }
        );
    });

export default jwtGenerator;
