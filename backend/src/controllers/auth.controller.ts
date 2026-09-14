import { Request, Response } from 'express';
import { registerSchema, loginSchema } from '../schemas/auth.js';
import { authService } from '../services/auth.service.js';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    // 1. Validate HTTP request body
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: validation.error.flatten().fieldErrors,
      });
      return;
    }

    // 2. Call the Service Layer
    const result = await authService.register(validation.data);

    // 3. Send HTTP 201 response
    res.status(201).json({
      message: 'User registered successfully',
      ...result,
    });
  } catch (error: any) {
    if (error.message === 'USER_ALREADY_EXISTS') {
      res.status(409).json({ error: 'A user with this email already exists' });
      return;
    }

    console.error('[Register Controller Error]:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    // 1. Validate HTTP request body
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: validation.error.flatten().fieldErrors,
      });
      return;
    }

    // 2. Call the Service Layer
    const result = await authService.login(validation.data);

    // 3. Send HTTP 200 response
    res.status(200).json({
      message: 'Login successful',
      ...result,
    });
  } catch (error: any) {
    if (error.message === 'INVALID_CREDENTIALS') {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    console.error('[Login Controller Error]:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}