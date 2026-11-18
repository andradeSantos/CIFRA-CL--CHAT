import { FastifyInstance } from 'fastify';
import prisma from '../utils/prisma';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async () => {
    // Verificar conexão com banco
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', database: 'connected', timestamp: new Date().toISOString() };
    } catch {
      return { status: 'degraded', database: 'disconnected', timestamp: new Date().toISOString() };
    }
  });
}