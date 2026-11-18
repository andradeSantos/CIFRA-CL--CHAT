import { FastifyInstance } from 'fastify';
import { AuthService } from '../services/auth.service';
import { RegisterSchema, LoginSchema, AuthMeResponseSchema } from '../types/api';
import { authenticate } from '../middleware/auth';

export async function authRoutes(fastify: FastifyInstance) {
  /**
   * POST /auth/register
   * Cadastra novo membro do Clã
   */
  fastify.post(
    '/register',
    {
      schema: RegisterSchema,
      config: { rateLimit: { max: 5, timeWindow: '1 minute' } },
    },
    async (request, reply) => {
      try {
        const { user, token } = await AuthService.register(request.body, fastify);

        // Set cookie HttpOnly
        reply.setCookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 7 * 24 * 60 * 60, // 7 dias
        });

        return reply.code(201).send(user);
      } catch (error) {
        if (error instanceof Error && error.message === 'USERNAME_EXISTS') {
          return reply.code(409).send({ error: 'Nome de guerra já em uso', code: 'USERNAME_EXISTS' });
        }
        throw error;
      }
    }
  );

  /**
   * POST /auth/login
   * Autentica membro e retorna cookie JWT
   */
  fastify.post(
    '/login',
    {
      schema: LoginSchema,
      config: { rateLimit: { max: 5, timeWindow: '1 minute' } },
    },
    async (request, reply) => {
      try {
        const { user, token } = await AuthService.login(request.body, fastify);

        reply.setCookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 7 * 24 * 60 * 60,
        });

        return user;
      } catch (error) {
        if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
          return reply.code(401).send({ error: 'Credenciais inválidas', code: 'INVALID_CREDENTIALS' });
        }
        throw error;
      }
    }
  );

  /**
   * POST /auth/logout
   * Remove cookie de sessão
   */
  fastify.post('/logout', async (_request, reply) => {
    reply.clearCookie('token', { path: '/' });
    return { ok: true };
  });

  /**
   * GET /auth/me
   * Retorna usuário autenticado (valida cookie)
   */
  fastify.get(
    '/me',
    {
      preHandler: authenticate,
    },
    async (request, reply) => {
      const user = await AuthService.me(request.user!.id);
      if (!user) {
        return reply.code(404).send({ error: 'Usuário não encontrado', code: 'USER_NOT_FOUND' });
      }
      return user;
    }
  );
}