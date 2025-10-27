import * as bcrypt from 'bcrypt';

export class PasswordHasher {
    static verify(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash)
    }

    static getHashPassword(str: string, salt: number = 10): Promise<string> {
        return bcrypt.hash(str, salt);
    }
}