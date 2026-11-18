import {
  CCGConfig,
  CCGKey,
  CCGStep,
  CCGEncryptResult,
  CCGDecryptResult,
  validateKey,
  modInv,
  modSafe,
  charToVal,
  valToChar,
  generateFormula,
  DEFAULT_PROD_CONFIG,
  ACADEMIC_CONFIG,
  ASCII_OFFSET,
} from './types';

/**
 * Cifra uma mensagem usando a Cifra do Conselho de Guerra (CCG)
 * Retorna apenas o ciphertext (para uso no chat)
 */
export function encrypt(plaintext: string, config: CCGConfig = DEFAULT_PROD_CONFIG): string {
  if (!validateKey(config, config.M)) {
    throw new Error(`Chave inválida: mdc(a=${config.a}, M=${config.M}) !== 1`);
  }

  const offset = config.M === 26 ? 'A'.charCodeAt(0) : ASCII_OFFSET;
  const chars = [...plaintext];

  return chars
    .map((ch, i) => {
      const p = charToVal(ch, offset);
      const c = modSafe(config.a * p + config.b + config.s * i, config.M);
      return valToChar(c, offset);
    })
    .join('');
}

/**
 * Decifra uma mensagem usando a Cifra do Conselho de Guerra (CCG)
 * Retorna apenas o plaintext (para uso no chat)
 */
export function decrypt(ciphertext: string, config: CCGConfig = DEFAULT_PROD_CONFIG): string {
  if (!validateKey(config, config.M)) {
    throw new Error(`Chave inválida: mdc(a=${config.a}, M=${config.M}) !== 1`);
  }

  const aInv = modInv(config.a, config.M);
  const offset = config.M === 26 ? 'A'.charCodeAt(0) : ASCII_OFFSET;
  const chars = [...ciphertext];

  return chars
    .map((ch, i) => {
      const c = charToVal(ch, offset);
      const p = modSafe(aInv * (c - config.b - config.s * i), config.M);
      return valToChar(p, offset);
    })
    .join('');
}

/**
 * Cifra com passos detalhados (para o Laboratório Interativo / Sandbox)
 */
export function encryptWithSteps(plaintext: string, config: CCGConfig = DEFAULT_PROD_CONFIG): CCGEncryptResult {
  if (!validateKey(config, config.M)) {
    throw new Error(`Chave inválida: mdc(a=${config.a}, M=${config.M}) !== 1`);
  }

  const offset = config.M === 26 ? 'A'.charCodeAt(0) : ASCII_OFFSET;
  const formula = generateFormula(config, true);
  const chars = [...plaintext];
  const steps: CCGStep[] = [];
  let ciphertext = '';

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const p = charToVal(ch, offset);
    const c = modSafe(config.a * p + config.b + config.s * i, config.M);
    const cipherChar = valToChar(c, offset);

    const stepFormula = `(${config.a} × ${p} + ${config.b} + ${config.s} × ${i}) mod ${config.M} = ${config.a * p + config.b + config.s * i} mod ${config.M} = ${c}`;

    steps.push({
      position: i,
      char: ch,
      plainValue: p,
      formula: stepFormula,
      cipherValue: c,
      cipherChar,
    });

    ciphertext += cipherChar;
  }

  return {
    ciphertext,
    steps,
    config,
  };
}

/**
 * Decifra com passos detalhados (para o Laboratório Interativo / Sandbox)
 */
export function decryptWithSteps(ciphertext: string, config: CCGConfig = DEFAULT_PROD_CONFIG): CCGDecryptResult {
  if (!validateKey(config, config.M)) {
    throw new Error(`Chave inválida: mdc(a=${config.a}, M=${config.M}) !== 1`);
  }

  const aInv = modInv(config.a, config.M);
  const offset = config.M === 26 ? 'A'.charCodeAt(0) : ASCII_OFFSET;
  const formula = generateFormula(config, false);
  const chars = [...ciphertext];
  const steps: CCGStep[] = [];
  let plaintext = '';

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const c = charToVal(ch, offset);
    const p = modSafe(aInv * (c - config.b - config.s * i), config.M);
    const plainChar = valToChar(p, offset);

    const stepFormula = `[${aInv} × (${c} - ${config.b} - ${config.s} × ${i})] mod ${config.M} = [${aInv} × ${c - config.b - config.s * i}] mod ${config.M} = ${aInv * (c - config.b - config.s * i)} mod ${config.M} = ${p}`;

    steps.push({
      position: i,
      char: ch,
      plainValue: c,
      formula: stepFormula,
      cipherValue: p,
      cipherChar: plainChar,
    });

    plaintext += plainChar;
  }

  return {
    plaintext,
    steps,
    config,
  };
}

/**
 * Verifica se um roundtrip (encrypt -> decrypt) preserva a mensagem original
 */
export function verifyRoundtrip(plaintext: string, config: CCGConfig = DEFAULT_PROD_CONFIG): boolean {
  try {
    const cipher = encrypt(plaintext, config);
    const decoded = decrypt(cipher, config);
    return decoded === plaintext;
  } catch {
    return false;
  }
}

/**
 * Chave padrão de produção exportada para uso direto
 */
export const DEFAULT_KEY: CCGKey = {
  a: DEFAULT_PROD_CONFIG.a,
  b: DEFAULT_PROD_CONFIG.b,
  s: DEFAULT_PROD_CONFIG.s,
};

/**
 * Chave acadêmica exportada para uso direto
 */
export const ACADEMIC_KEY: CCGKey = {
  a: ACADEMIC_CONFIG.a,
  b: ACADEMIC_CONFIG.b,
  s: ACADEMIC_CONFIG.s,
};

export * from './types';