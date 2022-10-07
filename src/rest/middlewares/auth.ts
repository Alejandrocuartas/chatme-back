const jwt = require("jsonwebtoken");

import { Request, RequestHandler } from "express";

const verifyToken = async (req: Request) => {
    const { authorization } = req.headers;
    const token = (authorization || "").replace("Bearer ", "");
    try {
        const { username } = await jwt.verify(token, process.env.JWT_KEY);
        return username;
    } catch (e) {
        throw new Error("Invalid token");
    }
};

const authMiddleware: RequestHandler = async (req, res, next) => {
    try {
        const username = await verifyToken(req);
        // @ts-ignore
        req.username = username;
        // @ts-ignore
    } catch (e) {
        // ignore
    } finally {
        next();
    }
};

export default authMiddleware;
