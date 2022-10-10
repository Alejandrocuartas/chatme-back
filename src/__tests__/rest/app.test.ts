import request from "supertest";
import app from "../../server";
import { CreateUserInput } from "../../types";

const newUser: CreateUserInput = {
    name: "Alejo",
    last_name: "Cuartas",
    username: "ale31jo",
    password: "password",
    photo: "My Photo",
};

describe("sign up", () => {
    test("signing up", async () => {
        const res = await request(app).post("/api/signup").send(newUser);
        expect(res.body.user.name).toBe(newUser.name);
        expect(typeof res.body.jwt).toBe("string");
    });
});
