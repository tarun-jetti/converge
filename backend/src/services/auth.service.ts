import { prisma } from '../lib/prisma.js';
import { hashPassword, comparePassword, signToken } from '../lib/auth';
import { RegisterInput, LoginInput } from '../schemas/auth';

export class AuthService {
  // 1. Business logic for registration
  async register(input: RegisterInput) {
    const { name, email, password } = input;

    // Check duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('USER_ALREADY_EXISTS');
    }

    // Hash password & save to Neon
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    return { user, token };
  }

  // 2. Business logic for login
  async login(input: LoginInput) {
    const { email, password } = input;

    // Find user in Neon
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Verify password hash
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Generate token
    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
      token,
    };
  }
}

// Export a singleton instance
export const authService = new AuthService();