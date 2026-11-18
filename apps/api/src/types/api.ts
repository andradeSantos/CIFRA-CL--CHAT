import { z } from 'zod';

/**
 * Schemas de validação compartilhados (Zod)
 */

export const RegisterSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/),
    password: z.string().min(8).max(100),
  }),
});

export const LoginSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(1),
  }),
});

export const SendMessageSchema = z.object({
  body: z.object({
    ciphertext: z.string().min(1).max(5000),
  }),
});

export const MessageQuerySchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().positive().max(100).default(50),
    before: z.string().datetime().optional(),
  }),
});

export type RegisterInput = z.infer<typeof RegisterSchema>['body'];
export type LoginInput = z.infer<typeof LoginSchema>['body'];
export type SendMessageInput = z.infer<typeof SendMessageSchema>['body'];
export type MessageQueryInput = z.infer<typeof MessageQuerySchema>['query'];

/**
 * Tipos de resposta da API
 */
export const UserResponseSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  rank: z.string(),
});

export const MessageResponseSchema = z.object({
  id: z.string().uuid(),
  senderId: z.string().uuid(),
  senderUsername: z.string(),
  ciphertext: z.string(),
  cipherVersion: z.string(),
  createdAt: z.string().datetime(),
});

export const AuthMeResponseSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  rank: z.string(),
});

export type UserResponse = z.infer<typeof UserResponseSchema>;
export type MessageResponse = z.infer<typeof MessageResponseSchema>;
export type AuthMeResponse = z.infer<typeof AuthMeResponseSchema>;

/**
 * Payload do JWT
 */
export const JWTPayloadSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
});

export type JWTPayload = z.infer<typeof JWTPayloadSchema>;