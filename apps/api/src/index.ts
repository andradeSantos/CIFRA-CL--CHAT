import Fastify from 'fastify';
import securityPlugin from './plugins/security';
import websocketPlugin from './plugins/websocket';
import { authRoutes } from './routes/auth';
import { messageRoutes } from './routes/messages';
import { healthRoutes } from './routes/health';

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
  },
});

async function main() {
  // Plugins de segurança (cookie, jwt, cors, rate-limit)
  await fastify.register(securityPlugin);

  // WebSocket
  await fastify.register(websocketPlugin);

  // Rotas
  await fastify.register(authRoutes, { prefix: '/auth' });
  await fastify.register(messageRoutes, { prefix: '/messages' });
  await fastify.register(healthRoutes);

  // Graceful shutdown
  const shutdown = async () => {
    fastify.log.info('Shutting down...');
    await fastify.close();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  try {
    const port = Number(process.env.PORT) || 3001;
    const host = process.env.HOST || '0.0.0.0';
    await fastify.listen({ port, host });
    fastify.log.info(`🚀 API rodando em http://${host}:${port}`);
    fastify.log.info(`🔌 WebSocket em ws://${host}:${port}/ws`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();