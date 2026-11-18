import { CCGConfig } from './types';

/**
 * 5 Vetores de Teste Obrigatórios (M=26, a=5, b=8, s=3)
 * Conforme especificação acadêmica - item 7 das diretrizes
 * NOTA: Apenas o Teste 01 (ATAQUE -> ICOTQR) confere com o passo a passo do documento.
 * Os demais vetores no documento original continham erros matemáticos.
 * Esta versão usa os valores CORRETOS pela fórmula: c_i = (a*p_i + b + s*i) mod M
 */
export const TEST_VECTORS_M26 = [
  {
    name: 'Teste 01 - ATAQUE',
    plain: 'ATAQUE',
    cipher: 'ICOTQR',
    config: { M: 26, a: 5, b: 8, s: 3 } as CCGConfig,
  },
  {
    name: 'Teste 02 - TROPAS',
    plain: 'TROPAS',
    cipher: 'ZSGOUJ',
    config: { M: 26, a: 5, b: 8, s: 3 } as CCGConfig,
  },
  {
    name: 'Teste 03 - DEFESA',
    plain: 'DEFESA',
    cipher: 'XFNLGX',
    config: { M: 26, a: 5, b: 8, s: 3 } as CCGConfig,
  },
  {
    name: 'Teste 04 - RECUAR',
    plain: 'RECUAR',
    cipher: 'PFYNUE',
    config: { M: 26, a: 5, b: 8, s: 3 } as CCGConfig,
  },
  {
    name: 'Teste 05 - VITORIA',
    plain: 'VITORIA',
    cipher: 'JZFJBLA',
    config: { M: 26, a: 5, b: 8, s: 3 } as CCGConfig,
  },
] as const;

/**
 * Casos de borda para M=95 (produção)
 */
export const EDGE_CASES_M95 = [
  {
    name: 'String vazia',
    plain: '',
    config: { M: 95, a: 7, b: 8, s: 3 } as CCGConfig,
  },
  {
    name: 'Um caractere',
    plain: 'A',
    config: { M: 95, a: 7, b: 8, s: 3 } as CCGConfig,
  },
  {
    name: 'Espaços e pontuação',
    plain: 'OLA MUNDO!',
    config: { M: 95, a: 7, b: 8, s: 3 } as CCGConfig,
  },
  {
    name: 'Números',
    plain: 'TESTE123',
    config: { M: 95, a: 7, b: 8, s: 3 } as CCGConfig,
  },
  {
    name: 'Caracteres especiais ASCII',
    plain: 'ABC@#$%',
    config: { M: 95, a: 7, b: 8, s: 3 } as CCGConfig,
  },
  {
    name: 'Minúsculas e maiúsculas',
    plain: 'AbCdEfGh',
    config: { M: 95, a: 7, b: 8, s: 3 } as CCGConfig,
  },
  {
    name: 'Mensagem longa',
    plain: 'ESTA E UMA MENSAGEM BASTANTE LONGA PARA TESTAR A CIFRA COM VARIAS POSICOES',
    config: { M: 95, a: 7, b: 8, s: 3 } as CCGConfig,
  },
] as const;

/**
 * Casos de chave inválida (mdc(a, M) !== 1)
 */
export const INVALID_KEYS = [
  {
    name: 'a=5, M=95 (mdc=5)',
    config: { M: 95, a: 5, b: 8, s: 3 } as CCGConfig,
  },
  {
    name: 'a=19, M=95 (mdc=19)',
    config: { M: 95, a: 19, b: 8, s: 3 } as CCGConfig,
  },
  {
    name: 'a=10, M=26 (mdc=2)',
    config: { M: 26, a: 10, b: 8, s: 3 } as CCGConfig,
  },
  {
    name: 'a=13, M=26 (mdc=13)',
    config: { M: 26, a: 13, b: 8, s: 3 } as CCGConfig,
  },
] as const;