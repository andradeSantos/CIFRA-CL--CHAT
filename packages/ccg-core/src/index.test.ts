import { describe, it, expect } from 'vitest';
import {
  gcd,
  modInv,
  modSafe,
  validateKey,
  encrypt,
  decrypt,
  encryptWithSteps,
  decryptWithSteps,
  verifyRoundtrip,
  charToVal,
  valToChar,
  DEFAULT_PROD_CONFIG,
  ACADEMIC_CONFIG,
  DEFAULT_KEY,
  ACADEMIC_KEY,
  ASCII_OFFSET,
} from './index';
import { TEST_VECTORS_M26, EDGE_CASES_M95, INVALID_KEYS } from './test-vectors';

describe('CCG Core - Funções Matemáticas Base', () => {
  describe('gcd', () => {
    it('deve retornar 1 para números coprimos', () => {
      expect(gcd(7, 95)).toBe(1);
      expect(gcd(5, 26)).toBe(1);
      expect(gcd(3, 95)).toBe(1);
    });

    it('deve retornar o MDC correto para não-coprimos', () => {
      expect(gcd(5, 95)).toBe(5);
      expect(gcd(19, 95)).toBe(19);
      expect(gcd(10, 26)).toBe(2);
      expect(gcd(13, 26)).toBe(13);
    });

    it('deve lidar com números negativos', () => {
      expect(gcd(-7, 95)).toBe(1);
      expect(gcd(7, -95)).toBe(1);
      expect(gcd(-5, -95)).toBe(5);
    });

    it('deve retornar o próprio número quando um é zero', () => {
      expect(gcd(0, 7)).toBe(7);
      expect(gcd(7, 0)).toBe(7);
    });
  });

  describe('modInv', () => {
    it('deve calcular inverso modular correto para M=26', () => {
      // 5 * 21 = 105 = 4*26 + 1 => inv(5, 26) = 21
      expect(modInv(5, 26)).toBe(21);
      // 7 * 15 = 105 = 4*26 + 1 => inv(7, 26) = 15
      expect(modInv(7, 26)).toBe(15);
      // 3 * 9 = 27 = 1*26 + 1 => inv(3, 26) = 9
      expect(modInv(3, 26)).toBe(9);
    });

    it('deve calcular inverso modular correto para M=95', () => {
      // 7 * 68 = 476 = 5*95 + 1 => inv(7, 95) = 68
      expect(modInv(7, 95)).toBe(68);
      // 3 * 63 = 189 = 2*95 - 1 => 3 * 63 = 189 ≡ -1, então inv(3, 95) = 63? não
      // 3 * 64 = 192 = 2*95 + 2 => não
      // 3 * 32 = 96 = 1*95 + 1 => inv(3, 95) = 32
      expect(modInv(3, 95)).toBe(32);
    });

    it('deve lançar erro quando inverso não existe', () => {
      expect(() => modInv(5, 95)).toThrow('Inverso multiplicativo não existe');
      expect(() => modInv(19, 95)).toThrow('Inverso multiplicativo não existe');
      expect(() => modInv(10, 26)).toThrow('Inverso multiplicativo não existe');
    });

    it('deve retornar resultado positivo', () => {
      expect(modInv(7, 26)).toBeGreaterThan(0);
      expect(modInv(7, 26)).toBeLessThan(26);
    });
  });

  describe('modSafe', () => {
    it('deve retornar resto positivo para números positivos', () => {
      expect(modSafe(10, 26)).toBe(10);
      expect(modSafe(27, 26)).toBe(1);
      expect(modSafe(100, 95)).toBe(5);
    });

    it('deve retornar resultado positivo para números negativos', () => {
      expect(modSafe(-1, 26)).toBe(25);
      expect(modSafe(-27, 26)).toBe(25);
      expect(modSafe(-100, 95)).toBe(90);
    });

    it('deve retornar 0 para múltiplos exatos', () => {
      expect(modSafe(26, 26)).toBe(0);
      expect(modSafe(-26, 26) === 0).toBe(true);
      expect(modSafe(95, 95)).toBe(0);
      // -0 === 0 é true em JS, mas Object.is(-0, 0) é false
      // vitest usa Object.is, então comparamos com ===
    });
  });

  describe('validateKey', () => {
    it('deve retornar true para chaves válidas (coprimas)', () => {
      expect(validateKey({ a: 7, b: 8, s: 3 }, 95)).toBe(true);
      expect(validateKey({ a: 5, b: 8, s: 3 }, 26)).toBe(true);
      expect(validateKey({ a: 3, b: 0, s: 1 }, 95)).toBe(true);
      expect(validateKey({ a: 11, b: 5, s: 2 }, 26)).toBe(true);
    });

    it('deve retornar false para chaves inválidas (não coprimas)', () => {
      expect(validateKey({ a: 5, b: 8, s: 3 }, 95)).toBe(false);
      expect(validateKey({ a: 19, b: 8, s: 3 }, 95)).toBe(false);
      expect(validateKey({ a: 10, b: 8, s: 3 }, 26)).toBe(false);
      expect(validateKey({ a: 13, b: 8, s: 3 }, 26)).toBe(false);
    });
  });
});

describe('CCG Core - Conversão de Caracteres', () => {
  describe('charToVal / valToChar (M=26)', () => {
    it('deve converter A-Z para 0-25 e vice-versa', () => {
      expect(charToVal('A', 'A'.charCodeAt(0))).toBe(0);
      expect(charToVal('Z', 'A'.charCodeAt(0))).toBe(25);
      expect(valToChar(0, 'A'.charCodeAt(0))).toBe('A');
      expect(valToChar(25, 'A'.charCodeAt(0))).toBe('Z');
    });

    it('deve fazer roundtrip perfeito', () => {
      const offset = 'A'.charCodeAt(0);
      for (let i = 0; i < 26; i++) {
        const ch = String.fromCharCode(offset + i);
        expect(valToChar(charToVal(ch, offset), offset)).toBe(ch);
      }
    });
  });

  describe('charToVal / valToChar (M=95)', () => {
    it('deve converter ASCII 32-126 para 0-94 e vice-versa', () => {
      expect(charToVal(' ', ASCII_OFFSET)).toBe(0); // espaço = 32
      expect(charToVal('~', ASCII_OFFSET)).toBe(94); // ~ = 126
      expect(valToChar(0, ASCII_OFFSET)).toBe(' ');
      expect(valToChar(94, ASCII_OFFSET)).toBe('~');
    });

    it('deve fazer roundtrip perfeito para todos caracteres imprimíveis', () => {
      for (let i = 0; i < 95; i++) {
        const ch = String.fromCharCode(ASCII_OFFSET + i);
        expect(valToChar(charToVal(ch, ASCII_OFFSET), ASCII_OFFSET)).toBe(ch);
      }
    });
  });
});

describe('CCG Core - Cifragem/Decifragem Simples', () => {
  describe('Configuração Acadêmica (M=26)', () => {
    it('deve cifrar e decifrar com chave padrão acadêmica', () => {
      const plain = 'ATAQUE';
      const cipher = encrypt(plain, ACADEMIC_CONFIG);
      const decoded = decrypt(cipher, ACADEMIC_CONFIG);
      expect(decoded).toBe(plain);
    });

    it('deve usar ACADEMIC_KEY como atalho', () => {
      const plain = 'TESTE';
      const cipher = encrypt(plain, { ...ACADEMIC_CONFIG, ...ACADEMIC_KEY });
      const decoded = decrypt(cipher, { ...ACADEMIC_CONFIG, ...ACADEMIC_KEY });
      expect(decoded).toBe(plain);
    });
  });

  describe('Configuração de Produção (M=95)', () => {
    it('deve cifrar e decifrar com chave padrão de produção', () => {
      const plain = 'OLA MUNDO!';
      const cipher = encrypt(plain, DEFAULT_PROD_CONFIG);
      const decoded = decrypt(cipher, DEFAULT_PROD_CONFIG);
      expect(decoded).toBe(plain);
    });

    it('deve usar DEFAULT_KEY como atalho', () => {
      const plain = 'MENSAGEM SECRETA 123';
      const cipher = encrypt(plain, { ...DEFAULT_PROD_CONFIG, ...DEFAULT_KEY });
      const decoded = decrypt(cipher, { ...DEFAULT_PROD_CONFIG, ...DEFAULT_KEY });
      expect(decoded).toBe(plain);
    });

    it('deve preservar espaços e pontuação', () => {
      const plain = 'OLA, MUNDO! COMO VAI?';
      const cipher = encrypt(plain, DEFAULT_PROD_CONFIG);
      const decoded = decrypt(cipher, DEFAULT_PROD_CONFIG);
      expect(decoded).toBe(plain);
    });

    it('deve diferenciar maiúsculas e minúsculas', () => {
      const plain = 'AbCdEf';
      const cipher = encrypt(plain, DEFAULT_PROD_CONFIG);
      const decoded = decrypt(cipher, DEFAULT_PROD_CONFIG);
      expect(decoded).toBe(plain);
    });
  });
});

describe('CCG Core - 5 Vetores de Teste Obrigatórios (M=26)', () => {
  TEST_VECTORS_M26.forEach(({ name, plain, cipher, config }) => {
    it(`${name}: "${plain}" -> "${cipher}"`, () => {
      expect(encrypt(plain, config)).toBe(cipher);
    });

    it(`${name}: decifragem "${cipher}" -> "${plain}"`, () => {
      expect(decrypt(cipher, config)).toBe(plain);
    });

    it(`${name}: roundtrip completo`, () => {
      expect(verifyRoundtrip(plain, config)).toBe(true);
    });
  });
});

describe('CCG Core - Casos de Borda (M=95)', () => {
  EDGE_CASES_M95.forEach(({ name, plain, config }) => {
    it(`${name}: roundtrip`, () => {
      expect(verifyRoundtrip(plain, config)).toBe(true);
    });

    it(`${name}: cifragem produz string não-vazia (exceto vazia)`, () => {
      const cipher = encrypt(plain, config);
      if (plain.length > 0) {
        expect(cipher.length).toBe(plain.length);
      } else {
        expect(cipher).toBe('');
      }
    });
  });
});

describe('CCG Core - Chaves Inválidas', () => {
  INVALID_KEYS.forEach(({ name, config }) => {
    it(`${name}: deve lançar erro na cifragem`, () => {
      expect(() => encrypt('TESTE', config)).toThrow('Chave inválida');
    });

    it(`${name}: deve lançar erro na decifragem`, () => {
      expect(() => decrypt('TESTE', config)).toThrow('Chave inválida');
    });

    it(`${name}: validateKey deve retornar false`, () => {
      expect(validateKey({ a: config.a, b: config.b, s: config.s }, config.M)).toBe(false);
    });
  });
});

describe('CCG Core - Passos Detalhados (Sandbox)', () => {
  describe('encryptWithSteps', () => {
    it('deve retornar passos corretos para ATAQUE (M=26)', () => {
      const result = encryptWithSteps('ATAQUE', ACADEMIC_CONFIG);

      expect(result.ciphertext).toBe('ICOTQR');
      expect(result.steps).toHaveLength(6);
      expect(result.config.M).toBe(26);

      // Verificar passo 0: A (0) -> I (8)
      expect(result.steps[0]).toMatchObject({
        position: 0,
        char: 'A',
        plainValue: 0,
        cipherValue: 8,
        cipherChar: 'I',
      });

      // Verificar passo 1: T (19) -> C (2)
      expect(result.steps[1]).toMatchObject({
        position: 1,
        char: 'T',
        plainValue: 19,
        cipherValue: 2,
        cipherChar: 'C',
      });

      // Verificar passo 2: A (0) -> O (14) - DIFERENTE do passo 0!
      expect(result.steps[2]).toMatchObject({
        position: 2,
        char: 'A',
        plainValue: 0,
        cipherValue: 14,
        cipherChar: 'O',
      });
    });

    it('deve incluir fórmula legível em cada passo', () => {
      const result = encryptWithSteps('A', ACADEMIC_CONFIG);
      expect(result.steps[0].formula).toContain('5 × 0 + 8 + 3 × 0');
      expect(result.steps[0].formula).toContain('mod 26');
      expect(result.steps[0].formula).toContain('= 8');
    });

    it('deve funcionar com M=95', () => {
      const result = encryptWithSteps('OI', DEFAULT_PROD_CONFIG);
      expect(result.ciphertext.length).toBe(2);
      expect(result.steps).toHaveLength(2);
      expect(result.config.M).toBe(95);
    });
  });

  describe('decryptWithSteps', () => {
    it('deve retornar passos corretos para ICOTQR -> ATAQUE (M=26)', () => {
      const result = decryptWithSteps('ICOTQR', ACADEMIC_CONFIG);

      expect(result.plaintext).toBe('ATAQUE');
      expect(result.steps).toHaveLength(6);
      expect(result.config.M).toBe(26);

      // Verificar passo 0: I (8) -> A (0)
      expect(result.steps[0]).toMatchObject({
        position: 0,
        char: 'I',
        plainValue: 8,
        cipherValue: 0,
        cipherChar: 'A',
      });
    });

    it('deve incluir fórmula da inversa em cada passo', () => {
      const result = decryptWithSteps('I', ACADEMIC_CONFIG);
      // a=5, a⁻¹=21 mod 26
      expect(result.steps[0].formula).toContain('21 × (8 - 8 - 3 × 0)');
      expect(result.steps[0].formula).toContain('mod 26');
      expect(result.steps[0].formula).toContain('= 0');
    });
  });

  describe('Consistência encryptWithSteps <-> decryptWithSteps', () => {
    it('deve ser inverso perfeito para M=26', () => {
      const plain = 'ATAQUE';
      const enc = encryptWithSteps(plain, ACADEMIC_CONFIG);
      const dec = decryptWithSteps(enc.ciphertext, ACADEMIC_CONFIG);
      expect(dec.plaintext).toBe(plain);
    });

    it('deve ser inverso perfeito para M=95', () => {
      const plain = 'MENSAGEM SECRETA';
      const enc = encryptWithSteps(plain, DEFAULT_PROD_CONFIG);
      const dec = decryptWithSteps(enc.ciphertext, DEFAULT_PROD_CONFIG);
      expect(dec.plaintext).toBe(plain);
    });
  });
});

describe('CCG Core - Propriedades Matemáticas', () => {
  it('duas letras iguais em posições diferentes produzem cifras diferentes (M=26)', () => {
    const result = encryptWithSteps('AA', ACADEMIC_CONFIG);
    expect(result.steps[0].cipherChar).not.toBe(result.steps[1].cipherChar);
  });

  it('duas letras iguais em posições diferentes produzem cifras diferentes (M=95)', () => {
    const result = encryptWithSteps('AA', DEFAULT_PROD_CONFIG);
    expect(result.steps[0].cipherChar).not.toBe(result.steps[1].cipherChar);
  });

  it('cifragem é determinística para mesma chave e mensagem', () => {
    const plain = 'TESTE DETERMINISTICO';
    const c1 = encrypt(plain, DEFAULT_PROD_CONFIG);
    const c2 = encrypt(plain, DEFAULT_PROD_CONFIG);
    expect(c1).toBe(c2);
  });

  it('chaves diferentes produzem cifras diferentes', () => {
    const plain = 'MESMA MENSAGEM';
    const c1 = encrypt(plain, { ...DEFAULT_PROD_CONFIG, a: 7 });
    const c2 = encrypt(plain, { ...DEFAULT_PROD_CONFIG, a: 11 });
    expect(c1).not.toBe(c2);
  });
});

describe('CCG Core - Exportações', () => {
  it('deve exportar DEFAULT_PROD_CONFIG com M=95', () => {
    expect(DEFAULT_PROD_CONFIG.M).toBe(95);
    expect(DEFAULT_PROD_CONFIG.a).toBe(7);
    expect(DEFAULT_PROD_CONFIG.b).toBe(8);
    expect(DEFAULT_PROD_CONFIG.s).toBe(3);
  });

  it('deve exportar ACADEMIC_CONFIG com M=26', () => {
    expect(ACADEMIC_CONFIG.M).toBe(26);
    expect(ACADEMIC_CONFIG.a).toBe(5);
    expect(ACADEMIC_CONFIG.b).toBe(8);
    expect(ACADEMIC_CONFIG.s).toBe(3);
  });

  it('deve exportar DEFAULT_KEY compatível com DEFAULT_PROD_CONFIG', () => {
    expect(DEFAULT_KEY.a).toBe(DEFAULT_PROD_CONFIG.a);
    expect(DEFAULT_KEY.b).toBe(DEFAULT_PROD_CONFIG.b);
    expect(DEFAULT_KEY.s).toBe(DEFAULT_PROD_CONFIG.s);
  });

  it('deve exportar ACADEMIC_KEY compatível com ACADEMIC_CONFIG', () => {
    expect(ACADEMIC_KEY.a).toBe(ACADEMIC_CONFIG.a);
    expect(ACADEMIC_KEY.b).toBe(ACADEMIC_CONFIG.b);
    expect(ACADEMIC_KEY.s).toBe(ACADEMIC_CONFIG.s);
  });
});