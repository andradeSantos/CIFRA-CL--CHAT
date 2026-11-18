import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { JWTPayload } from '../types/api';

/**
 * Middleware de autenticação - valida JWT do cookie
 */
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<JWTPayload> {
  const token = request.cookies?.token;

  if (!token) {
    throw reply.code(401).send({ error: 'Não autenticado', code: 'UNAUTHORIZED' });
  }

  try {
    const payload = request.server.jwt.verify<JWTPayload>(token);
    request.user = payload;
    return payload;
  } catch {
    throw reply.code(401).send({ error: 'Token inválido ou expirado', code: 'INVALID_TOKEN' });
  }
}

/**
 * Decorator para adicionar user ao request
 */
declare module 'fastify' {
  interface FastifyRequest {
    user?: JWTPayload;
  }
}