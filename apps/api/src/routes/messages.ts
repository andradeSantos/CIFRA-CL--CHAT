import { FastifyInstance } from 'fastify';
import { MessageService } from '../services/message.service';
import { MessageQuerySchema, SendMessageSchema, MessageResponseSchema } from '../types/api';
import { authenticate } from '../middleware/auth';

export async function messageRoutes(fastify: FastifyInstance) {
  /**
   * GET /messages
   * Histórico de mensagens cifradas (paginado)
   */
  fastify.get(
    '/',
    {
      preHandler: authenticate,
    },
    async (request, reply) => {
      const messages = await MessageService.getHistory(request.query as any);
      return messages;
    }
  );

  /**
   * POST /messages
   * Envia mensagem (já cifrada pelo cliente)
   * Nota: O broadcast real acontece via WebSocket
   * Este endpoint serve para persistência e fallback
   */
  fastify.post(
    '/',
    {
      preHandler: authenticate,
      schema: SendMessageSchema,
    },
    async (request, reply) => {
      const message = await MessageService.create(request.user!.id, request.body.ciphertext);
      return reply.code(201).send(message);
    }
  );
}