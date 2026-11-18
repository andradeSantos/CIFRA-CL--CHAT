import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';

export default fp(async (fastify: FastifyInstance) => {
  const jwtSecret = process.env.JWT_SECRET;
  const cookieSecret = process.env.COOKIE_SECRET;

  if (!jwtSecret || !cookieSecret) {
    throw new Error('JWT_SECRET e COOKIE_SECRET são obrigatórios');
  }

  // Registrar cookie
  await fastify.register(cookie, {
    secret: cookieSecret,
    hook: 'onRequest',
    parseOptions: {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    },
  });

  // Registrar JWT
  await fastify.register(jwt, {
    secret: jwtSecret,
    sign: { algorithm: 'HS256', expiresIn: '7d' },
    cookie: { cookieName: 'token', signed: false },
  });

  // Registrar CORS
  const configuredFrontendUrl = process.env.FRONTEND_URL;

  await fastify.register(cors, {
    origin: (origin, cb) => {
      // Requisições sem origem (ex.: curl, Postman) são liberadas
      if (!origin) {
        return cb(null, true);
      }

      // Em produção restringe às origens configuradas em FRONTEND_URL
      if (configuredFrontendUrl) {
        const allowed = [
          configuredFrontendUrl,
          'http://localhost:10022',
          'http://127.0.0.1:10022',
        ];
        return cb(null, allowed.includes(origin) ? origin : false);
      }

      // Desenvolvimento / acesso pela rede local: aceita qualquer origem,
      // refletindo-a. Necessário quando o front é acessado pelo IP do servidor.
      cb(null, true);
    },
    credentials: true,
  });

  // Rate limiting
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    hook: 'onRequest',
  });
});