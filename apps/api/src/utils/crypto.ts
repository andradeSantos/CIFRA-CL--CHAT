import bcrypt from 'bcryptjs';
import { FastifyInstance } from 'fastify';
import { JWTPayload } from '../types/api';

const BCRYPT_COST = 12;

/**
 * Hash de senha usando bcrypt com cost 12
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST);
}

/**
 * Verifica senha contra hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Gera token JWT assinado
 */
export function generateToken(fastify: FastifyInstance, payload: JWTPayload): string {
  return fastify.jwt.sign(payload, { expiresIn: '7d' });
}

/**
 * Verifica e decodifica token JWT
 */
export function verifyToken(fastify: FastifyInstance, token: string): JWTPayload | null {
  try {
    return fastify.jwt.verify<JWTPayload>(token);
  } catch {
    return null;
  }
}