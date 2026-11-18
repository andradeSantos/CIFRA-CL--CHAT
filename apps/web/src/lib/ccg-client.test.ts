import { describe, it, expect } from 'vitest';
import { encrypt, decrypt, ACADEMIC_CONFIG, DEFAULT_PROD_CONFIG } from '@cifra/ccg-core';
import { PROD_KEY, ACADEMIC_KEY } from './ccg-client';

describe('ccg-client & Academia Test Vectors', () => {
  it('exports PROD_KEY and ACADEMIC_KEY matching ccg-core configs', () => {
    expect(PROD_KEY).toEqual(DEFAULT_PROD_CONFIG);
    expect(ACADEMIC_KEY).toEqual(ACADEMIC_CONFIG);
  });

  it('validates the 5 mandatory M=26 vectors', () => {
    const vectors = [
      ['ATAQUE', 'ICOTQR'],
      ['TROPAS', 'ZSGOUJ'],
      ['DEFESA', 'XFNLGX'],
      ['RECUAR', 'PFYNUE'],
      ['VITORIA', 'JZFJBLA'],
    ];

    for (const [plain, expectedCipher] of vectors) {
      const cipher = encrypt(plain, ACADEMIC_KEY);
      expect(cipher).toBe(expectedCipher);
      expect(decrypt(cipher, ACADEMIC_KEY)).toBe(plain);
    }
  });

  it('performs roundtrip on M=95 production config', () => {
    const message = 'Ordem do Conselho: 100%!';
    const cipher = encrypt(message, PROD_KEY);
    expect(cipher).not.toBe(message);
    expect(decrypt(cipher, PROD_KEY)).toBe(message);
  });
});
