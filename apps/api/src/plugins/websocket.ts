import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import fastifyWebsocket from '@fastify/websocket';
import { MessageService } from '../services/message.service';
import { JWTPayload } from '../types/api';

interface WSMessage {
  type: 'send' | 'history' | 'message' | 'presence' | 'error';
  payload: any;
}

interface ConnectedClient {
  socket: any;
  user: JWTPayload;
}

declare module 'fastify' {
  interface FastifyInstance {
    rooms: Map<string, Set<ConnectedClient>>;
  }
}

async function websocketPlugin(fastify: FastifyInstance) {
  await fastify.register(fastifyWebsocket);
  fastify.rooms = new Map();

  fastify.get(
    '/ws',
    { websocket: true },
    async (conn, request) => {
      const socket = (conn as any).socket ?? conn;

      // Autenticar via cookie
      const token = request.cookies?.token;
      if (!token) {
        socket.close(4001, 'Unauthorized: No token');
        return;
      }

      let user: JWTPayload;
      try {
        user = fastify.jwt.verify<JWTPayload>(token);
      } catch {
        socket.close(4001, 'Unauthorized: Invalid token');
        return;
      }

      const roomName = 'cla';
      const client: ConnectedClient = { socket, user };

      // Adicionar à sala
      const room = fastify.rooms.get(roomName) || new Set();
      room.add(client);
      fastify.rooms.set(roomName, room);

      // Registrar listeners ANTES de qualquer await para evitar race condition
      socket.on('message', async (data: Buffer) => {
        try {
          const msg: WSMessage = JSON.parse(data.toString());

          if (msg.type === 'send') {
            const saved = await MessageService.create(user.id, msg.payload.ciphertext);

            // Broadcast para todos na sala (incluindo remetente)
            const broadcastMsg: WSMessage = {
              type: 'message',
              payload: { ...saved, senderUsername: user.username },
            };
            broadcast(fastify, roomName, broadcastMsg);
          }
        } catch (error) {
          console.error('WS message error:', error);
          socket.send(JSON.stringify({ type: 'error', payload: { code: 'INVALID_MESSAGE', message: 'Mensagem inválida' } }));
        }
      });

      socket.on('close', () => {
        const room = fastify.rooms.get(roomName);
        if (room) {
          room.delete(client);
          if (room.size === 0) {
            fastify.rooms.delete(roomName);
          }
        }
        broadcastPresence(fastify, roomName, { userId: user.id, username: user.username, status: 'offline' });
      });

      socket.on('error', (error: Error) => {
        console.error('WS error:', error);
      });

      // Enviar histórico
      try {
        const history = await MessageService.getHistory({ limit: 50 });
        socket.send(JSON.stringify({ type: 'history', payload: history }));
      } catch (error) {
        console.error('Error sending history:', error);
      }

      // Notificar presença
      broadcastPresence(fastify, roomName, { userId: user.id, username: user.username, status: 'online' }, socket);
    }
  );
}

function broadcast(fastify: FastifyInstance, roomName: string, message: WSMessage, exclude?: any) {
  const room = fastify.rooms.get(roomName);
  if (!room) return;

  const data = JSON.stringify(message);
  room.forEach((client) => {
    if (client.socket !== exclude && client.socket.readyState === 1) { // WebSocket.OPEN = 1
      client.socket.send(data);
    }
  });
}

function broadcastPresence(fastify: FastifyInstance, roomName: string, presence: { userId: string; username: string; status: 'online' | 'offline' }, exclude?: any) {
  broadcast(fastify, roomName, { type: 'presence', payload: presence }, exclude);
}

export default fp(websocketPlugin);