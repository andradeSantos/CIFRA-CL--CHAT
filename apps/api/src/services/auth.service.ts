import prisma from '../utils/prisma';
import { hashPassword, verifyPassword, generateToken } from '../utils/crypto';
import { FastifyInstance } from 'fastify';
import { RegisterInput, LoginInput, UserResponse, JWTPayload } from '../types/api';
import { z } from 'zod';

export class AuthService {
  /**
   * Registra novo usuário
   */
  static async register(data: RegisterInput, fastify: FastifyInstance): Promise<{ user: UserResponse; token: string }> {
    // Verificar se username já existe
    const existing = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existing) {
      throw new Error('USERNAME_EXISTS');
    }

    // Hash da senha
    const passwordHash = await hashPassword(data.password);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        username: data.username,
        passwordHash,
      },
      select: { id: true, username: true, rank: true },
    });

    // Gerar JWT
    const token = generateToken(fastify, { id: user.id, username: user.username });

    return { user, token };
  }

  /**
   * Login do usuário
   */
  static async login(data: LoginInput, fastify: FastifyInstance): Promise<{ user: UserResponse; token: string }> {
    const user = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const valid = await verifyPassword(data.password, user.passwordHash);
    if (!valid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const token = generateToken(fastify, { id: user.id, username: user.username });

    const userResponse: UserResponse = {
      id: user.id,
      username: user.username,
      rank: user.rank,
    };

    return { user: userResponse, token };
  }

  /**
   * Obtém usuário atual pelo ID (do JWT)
   */
  static async me(userId: string): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, rank: true },
    });

    return user;
  }
}