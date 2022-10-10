jest.mock("@prisma/client", () => {
    return {
        PrismaClient: class {
            user: any;
            constructor() {
                this.user = {
                    create: (args: any): object => {
                        return args.data;
                    },
                    findUnique: (args: any): object => {
                        return {
                            username: args.where.username,
                            password: args.where.password,
                        };
                    },
                };
            }
        },
    };
});
