import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export interface AuthTokenPayload{
    userId : string;
    email :string;
}
const JWT_SECRET = process.env.JWT_SECRET || 'converge_dev_secret_key_2026';
const SALT_ROUNDS = 10;
export async function hashPassword(password : string) : Promise<string>{
    return await bcrypt.hash(password,SALT_ROUNDS);
}
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
export function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
}
export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    return decoded;
  } catch (error) {
    // If the token expired or the signature was tampered with, return null
    return null;
  }
}