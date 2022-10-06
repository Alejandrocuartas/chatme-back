import { hashSync } from "bcryptjs";

const encryptPass = (password: string): string => {
    return hashSync(password, 10);
};

export default encryptPass;
