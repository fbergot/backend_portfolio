import * as bcrypt from "bcrypt";

export default class Bcrypt {
    static async bcryptHash(plainTextPassword: string | Buffer, saltRounds: number) {
        return await bcrypt.hash(plainTextPassword, saltRounds);
    }

    static async bcryptCompare(plainTextPassword: string | Buffer, hashedPassword: string) {
        return await bcrypt.compare(plainTextPassword, hashedPassword);
    }
}
