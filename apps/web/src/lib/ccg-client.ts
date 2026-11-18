import { encrypt, decrypt, encryptWithSteps, decryptWithSteps, DEFAULT_PROD_CONFIG, ACADEMIC_CONFIG, type CCGConfig, type CCGStep } from '@cifra/ccg-core';

export const PROD_KEY = DEFAULT_PROD_CONFIG;
export const ACADEMIC_KEY = ACADEMIC_CONFIG;

export function useCCG() {
  const encryptMessage = (plaintext: string, config: CCGConfig = PROD_KEY): string => {
    return encrypt(plaintext, config);
  };

  const decryptMessage = (ciphertext: string, config: CCGConfig = PROD_KEY): string => {
    return decrypt(ciphertext, config);
  };

  const encryptWithStepsMessage = (plaintext: string, config: CCGConfig = PROD_KEY) => {
    return encryptWithSteps(plaintext, config);
  };

  const decryptWithStepsMessage = (ciphertext: string, config: CCGConfig = PROD_KEY) => {
    return decryptWithSteps(ciphertext, config);
  };

  return {
    encrypt: encryptMessage,
    decrypt: decryptMessage,
    encryptWithSteps: encryptWithStepsMessage,
    decryptWithSteps: decryptWithStepsMessage,
    key: PROD_KEY,
    academicKey: ACADEMIC_KEY,
  };
}

export type { CCGConfig, CCGStep };