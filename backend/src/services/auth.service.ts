import { prisma } from '../lib/prisma.js';
import { hashPassword, comparePassword, signToken } from '../lib/auth.js';
import { RegisterInput, LoginInput } from '../schemas/auth.js';
import { AppError } from '../lib/errors.js';
import { eventBus } from '../events/event-bus.js';

export class AuthService {
  // 1. Register a new user
  async register(input: RegisterInput) {
    const { name, email, password } = input;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('A user with this email already exists', 409, 'USER_ALREADY_EXISTS');
    }

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

    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    // Fire side effect event
    eventBus.emit('user.registered', {
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return { user, token };
  }

  // 2. Login an existing user
  async login(input: LoginInput) {
    const { email, password } = input;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

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

  // 3. Get profile of currently authenticated user
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('User profile not found', 404, 'USER_NOT_FOUND');
    }

    return user;
  }
}

export const authService = new AuthService();
