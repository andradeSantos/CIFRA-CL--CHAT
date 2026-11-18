import prisma from '../utils/prisma';
import { MessageResponse, SendMessageInput, MessageQueryInput } from '../types/api';
import { JWTPayload } from '../types/api';

export class MessageService {
  /**
   * Cria nova mensagem (já cifrada pelo cliente)
   */
  static async create(senderId: string, ciphertext: string): Promise<MessageResponse> {
    const message = await prisma.message.create({
      data: {
        senderId,
        ciphertext,
        cipherVersion: 'CCG-v1',
      },
      include: {
        sender: {
          select: { username: true },
        },
      },
    });

    return this.toResponse(message);
  }

  /**
   * Busca histórico de mensagens (paginado)
   */
  static async getHistory(query: MessageQueryInput): Promise<MessageResponse[]> {
    const where = query.before
      ? { createdAt: { lt: new Date(query.before) } }
      : {};

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: query.limit,
      include: {
        sender: {
          select: { username: true },
        },
      },
    });

    // Retornar em ordem cronológica (mais antiga primeiro)
    return messages.reverse().map(this.toResponse);
  }

  /**
   * Converte modelo Prisma para resposta da API
   */
  private static toResponse(message: {
    id: string;
    senderId: string;
    ciphertext: string;
    cipherVersion: string;
    createdAt: Date;
    sender: { username: string };
  }): MessageResponse {
    return {
      id: message.id,
      senderId: message.senderId,
      senderUsername: message.sender.username,
      ciphertext: message.ciphertext,
      cipherVersion: message.cipherVersion,
      createdAt: message.createdAt.toISOString(),
    };
  }
}