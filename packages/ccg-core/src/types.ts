import { z } from 'zod';

/**
 * Configuração da Cifra do Conselho de Guerra (CCG)
 * M = 95 para produção (ASCII imprimível 32-126)
 * M = 26 para validação acadêmica (A-Z)
 */
export const CCGConfigSchema = z.object({
  M: z.union([z.literal(95), z.literal(26)]),
  a: z.number().int().positive(),
  b: z.number().int(),
  s: z.number().int(),
});

export type CCGConfig = z.infer<typeof CCGConfigSchema>;

/**
 * Chave tática do Clã (parâmetros da cifra)
 */
export const CCGKeySchema = z.object({
  a: z.number().int(),
  b: z.number().int(),
  s: z.number().int(),
});

export type CCGKey = z.infer<typeof CCGKeySchema>;

/**
 * Resultado detalhado de um passo de cifragem/decifragem
 * Usado no Laboratório Interativo (Sandbox) da Academia
 */
export const CCGStepSchema = z.object({
  position: z.number().int().nonnegative(),
  char: z.string().length(1),
  plainValue: z.number().int(),
  formula: z.string(),
  cipherValue: z.number().int(),
  cipherChar: z.string().length(1),
});

export type CCGStep = z.infer<typeof CCGStepSchema>;

/**
 * Resultado completo da cifragem com passos
 */
export const CCGEncryptResultSchema = z.object({
  ciphertext: z.string(),
  steps: z.array(CCGStepSchema),
  config: CCGConfigSchema,
});

export type CCGEncryptResult = z.infer<typeof CCGEncryptResultSchema>;

/**
 * Resultado completo da decifragem com passos
 */
export const CCGDecryptResultSchema = z.object({
  plaintext: z.string(),
  steps: z.array(CCGStepSchema),
  config: CCGConfigSchema,
});

export type CCGDecryptResult = z.infer<typeof CCGDecryptResultSchema>;

/**
 * Valida se uma chave é válida (mdc(a, M) === 1)
 */
export function validateKey(key: CCGKey, M: number): boolean {
  return gcd(key.a, M) === 1;
}

/**
 * Calcula o máximo divisor comum (algoritmo de Euclides)
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

/**
 * Calcula o inverso multiplicativo modular usando Algoritmo de Euclides Estendido
 * Retorna x tal que (a * x) % M === 1
 */
export function modInv(a: number, M: number): number {
  let [t, newT] = [0, 1];
  let [r, newR] = [M, a];

  while (newR !== 0) {
    const q = Math.floor(r / newR);
    [t, newT] = [newT, t - q * newT];
    [r, newR] = [newR, r - q * newR];
  }

  if (r > 1) {
    throw new Error(`Inverso multiplicativo não existe: mdc(${a}, ${M}) = ${r} !== 1`);
  }

  if (t < 0) {
    t += M;
  }

  return t;
}

/**
 * Operação módulo segura que sempre retorna resultado não-negativo
 */
export function modSafe(x: number, M: number): number {
  const r = x % M;
  return r < 0 ? r + M : r;
}

/**
 * Configuração padrão de produção (M=95, ASCII imprimível)
 * a=7 é coprimo de 95 (95 = 5 * 19)
 */
export const DEFAULT_PROD_CONFIG: CCGConfig = {
  M: 95,
  a: 7,
  b: 8,
  s: 3,
};

/**
 * Configuração acadêmica (M=26, A-Z)
 * Usada para os 5 vetores de teste obrigatórios
 */
export const ACADEMIC_CONFIG: CCGConfig = {
  M: 26,
  a: 5,
  b: 8,
  s: 3,
};

/**
 * Offset ASCII para M=95 (espaço = 32)
 */
export const ASCII_OFFSET = 32;

/**
 * Converte caractere para valor numérico (0 a M-1)
 */
export function charToVal(ch: string, offset: number = ASCII_OFFSET): number {
  return ch.charCodeAt(0) - offset;
}

/**
 * Converte valor numérico para caractere
 */
export function valToChar(v: number, offset: number = ASCII_OFFSET): string {
  return String.fromCharCode(v + offset);
}

/**
 * Gera a string da fórmula para exibição no Sandbox
 */
export function generateFormula(config: CCGConfig, isEncrypt: boolean): string {
  const { a, b, s, M } = config;
  if (isEncrypt) {
    return `cᵢ = (${a} × pᵢ + ${b} + ${s} × i) mod ${M}`;
  }
  const aInv = modInv(a, M);
  return `pᵢ = [${aInv} × (cᵢ - ${b} - ${s} × i)] mod ${M}`;
}