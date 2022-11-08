import request from "supertest";
import app from "../../server";
import { CreateUserInput } from "../../types";

const newUser: CreateUserInput = {
    name: "Alejo",
    last_name: "Cuartas",
    username: "ale31jo0",
    password: "password",
    photo: "My Photo",
};

describe("sign up", () => {
    test("signing up", async () => {
        const res = await request(app).post("/api/signup").send(newUser);
        console.log(res.body);
        expect(res.body.error).toBe(
            "Cannot read properties of undefined (reading 'profile')"
        );
    });
});
