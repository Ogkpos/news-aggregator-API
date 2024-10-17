import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buffer = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buffer.toString("hex")}.${salt}`;
  }
  static async compare(existingPassword: string, newPassword: string) {
    const [hashedPassword, salt] = existingPassword.split(".");
    const buffer = (await scryptAsync(newPassword, salt, 64)) as Buffer;
    return buffer.toString("hex") === hashedPassword;
  }
}
