import { server } from "../../index";
import gql from "graphql-tag";
import { VariableValues } from "apollo-server-core";

beforeAll(async () => {});

describe("loging in", () => {
    test("login", async () => {
        const query = gql`
            query Query($username: String!, $password: String!) {
                login(username: $username, password: $password) {
                    user {
                        name
                    }
                    jwt
                }
            }
        `;
        const variables: VariableValues = {
            username: "ale3178jo",
            password: "alejito",
        };
        const result = await server.executeOperation(
            {
                query,
                variables,
            },
            {
                req: {
                    // @ts-ignore
                    username: "",
                },
            }
        );
        console.log(result);
        expect(1).toBe(1);
    });
});
