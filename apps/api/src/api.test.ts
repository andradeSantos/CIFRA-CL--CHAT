import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify from 'fastify';
import securityPlugin from '../src/plugins/security';
import websocketPlugin from '../src/plugins/websocket';
import { authRoutes } from '../src/routes/auth';
import { messageRoutes } from '../src/routes/messages';
import { healthRoutes } from '../src/routes/health';

describe('API Integration Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    
    await app.register(securityPlugin);
    await app.register(websocketPlugin);
    await app.register(authRoutes, { prefix: '/auth' });
    await app.register(messageRoutes, { prefix: '/messages' });
    await app.register(healthRoutes);
    
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('should return ok status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });
      
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.status).toBe('ok');
      expect(body.database).toBe('connected');
    });
  });

  describe('Auth Routes', () => {
    const testUser = {
      username: 'testuser_' + Date.now(),
      password: 'senha123456',
    };

    it('should register a new user', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: testUser,
      });
      
      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.username).toBe(testUser.username);
      expect(body.rank).toBe('Recruta');
      expect(body.id).toBeDefined();
      
      // Check cookie is set
      const cookies = response.cookies;
      expect(cookies).toBeDefined();
      expect(cookies.some(c => c.name === 'token')).toBe(true);
      const tokenCookie = cookies.find(c => c.name === 'token')!;
      expect(tokenCookie.httpOnly).toBe(true);
      expect(tokenCookie.sameSite).toBe('Strict');
    });

    it('should not register duplicate username', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: testUser,
      });
      
      expect(response.statusCode).toBe(409);
      const body = JSON.parse(response.body);
      expect(body.code).toBe('USERNAME_EXISTS');
    });

    it('should login with valid credentials', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: testUser,
      });
      
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.username).toBe(testUser.username);
      
      // Check cookie is set
      const cookies = response.cookies;
      expect(cookies.some(c => c.name === 'token')).toBe(true);
    });

    it('should reject invalid credentials', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: { username: testUser.username, password: 'wrongpassword' },
      });
      
      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('Auth Cookie Validation', () => {
    const testUser = {
      username: 'testuser_cookie_' + Date.now(),
      password: 'senha123456',
    };
    let tokenCookie: string;

    beforeAll(async () => {
      // Register and login to get cookie
      await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: testUser,
      });
      
      const loginResponse = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: testUser,
      });
      
      const cookies = loginResponse.cookies;
      const token = cookies.find(c => c.name === 'token')!;
      tokenCookie = `${token.name}=${token.value}`;
    });

    it('should return user info with valid cookie', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/auth/me',
        headers: { cookie: tokenCookie },
      });
      
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.username).toBe(testUser.username);
    });

    it('should reject request without cookie', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/auth/me',
      });
      
      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.code).toBe('UNAUTHORIZED');
    });
  });

  describe('Messages Routes', () => {
    const testUser = {
      username: 'testuser_msg_' + Date.now(),
      password: 'senha123456',
    };
    let tokenCookie: string;

    beforeAll(async () => {
      await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: testUser,
      });
      
      const loginResponse = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: testUser,
      });
      
      const cookies = loginResponse.cookies;
      const token = cookies.find(c => c.name === 'token')!;
      tokenCookie = `${token.name}=${token.value}`;
    });

    it('should return empty history initially', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/messages',
        headers: { cookie: tokenCookie },
      });
      
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBe(0);
    });
  });
});

// Type for FastifyInstance with our plugins
interface FastifyInstance {
  inject: (opts: { method: string; url: string; payload?: any; headers?: any }) => Promise<{
    statusCode: number;
    body: string;
    cookies: Array<{ name: string; value: string; httpOnly?: boolean; sameSite?: string }>;
  }>;
  close: () => Promise<void>;
  ready: () => Promise<void>;
  register: (plugin: any, opts?: any) => Promise<void>;
}