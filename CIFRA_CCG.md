# CIFRA DO CONSELHO DE GUERRA (CCG) — Especificação Técnica Completa

> Documento de referência para implementação, validação e ensino da cifra.
> Versão: 1.0 | Projeto: CIFRA CHALLENGE (SENAC)

---

## 1. Definição Matemática

A **Cifra do Conselho de Guerra (CCG)** é uma **cifra afim posicional generalizada** com **salto progressivo**.

### 1.1 Parâmetros

| Símbolo | Nome | Domínio | Descrição |
|---------|------|---------|-----------|
| `M` | Módulo / Tamanho do Alfabeto | `{26, 95}` | `26` = A–Z (acadêmico) / `95` = ASCII imprimível 32–126 (produção) |
| `a` | Chave Multiplicativa | `ℤ⁺`, `mdc(a, M) = 1` | Multiplica o texto plano; deve ser coprimo de `M` |
| `b` | Chave de Deslocamento | `ℤ` | Soma constante (deslocamento fixo) |
| `s` | Salto Posicional | `ℤ` | Peso da posição `i` (deslocamento progressivo) |
| `i` | Posição | `ℕ₀` | Índice do caractere na mensagem (`0, 1, 2, ...`) |
| `pᵢ` | Texto Plano (numérico) | `[0, M-1]` | Valor do caractere original na posição `i` |
| `cᵢ` | Texto Cifrado (numérico) | `[0, M-1]` | Valor resultante após cifragem |
| `a⁻¹` | Inverso Modular de `a` | `[1, M-1]` | `a · a⁻¹ ≡ 1 (mod M)` — calculado via Euclides Estendido |

### 1.2 Fórmulas

**Cifragem (Encryption):**
```
cᵢ = (a · pᵢ + b + s · i) mod M
```

**Decifragem (Decryption):**
```
pᵢ = [a⁻¹ · (cᵢ - b - s · i)] mod M
```

> **Nota:** A operação `mod M` aqui é o **módulo seguro** — sempre retorna valor em `[0, M-1]`:
> `modSafe(x, M) = ((x % M) + M) % M`

---

## 2. Condição de Reversibilidade (Existência do Inverso)

Para que a decifragem seja possível, **o inverso modular `a⁻¹` deve existir**.

> **Teorema:** `a⁻¹ mod M` existe **se e somente se** `mdc(a, M) = 1` (a e M são coprimos).

### Por que isso importa?

- Se `mdc(a, M) = d > 1`, a multiplicação por `a` **não é injetiva** módulo `M`.
- Dois valores diferentes `p₁ ≠ p₂` podem produzir o mesmo `cᵢ` → **colisão irreversível**.
- Exemplo: `M = 95`, `a = 5` → `mdc(5, 95) = 5`. Valores `p` que diferem por `19` (95/5) colidem.

### Validação Automática

O sistema **rejeita chaves inválidas** no momento da cifragem/decifragem:

```typescript
if (gcd(a, M) !== 1) {
  throw new Error(`Chave inválida: mdc(a=${a}, M=${M}) !== 1`);
}
```

---

## 3. Configurações Oficiais

### 3.1 Produção — Chat Clã (M = 95)

| Parâmetro | Valor | Justificativa |
|-----------|-------|---------------|
| `M` | 95 | Todos os 95 caracteres ASCII imprimíveis (espaço `32` a `~` `126`) |
| `a` | 7 | `mdc(7, 95) = 1` ✓ (95 = 5 × 19) |
| `b` | 8 | Deslocamento fixo arbitrário |
| `s` | 3 | Salto posicional arbitrário |
| `a⁻¹` | **68** | `7 × 68 = 476 = 5 × 95 + 1 ≡ 1 (mod 95)` |
| Offset ASCII | 32 | `charCodeAt(0) - 32` mapeia espaço→0, `~`→94 |

### 3.2 Acadêmico — Validação (M = 26)

| Parâmetro | Valor | Justificativa |
|-----------|-------|---------------|
| `M` | 26 | Alfabeto latino A–Z (A=0, ..., Z=25) |
| `a` | 5 | `mdc(5, 26) = 1` ✓ |
| `b` | 8 | Mesmo deslocamento da produção |
| `s` | 3 | Mesmo salto da produção |
| `a⁻¹` | **21** | `5 × 21 = 105 = 4 × 26 + 1 ≡ 1 (mod 26)` |
| Offset ASCII | 65 (`'A'`) | `charCodeAt(0) - 65` mapeia A→0, Z→25 |

---

## 4. Algoritmos Auxiliares

### 4.1 Máximo Divisor Comum (Euclides)

```typescript
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}
```

### 4.2 Inverso Modular (Euclides Estendido)

Retorna `x` tal que `(a * x) % M === 1`.

```typescript
function modInv(a: number, M: number): number {
  let [t, newT] = [0, 1];
  let [r, newR] = [M, a];

  while (newR !== 0) {
    const q = Math.floor(r / newR);
    [t, newT] = [newT, t - q * newT];
    [r, newR] = [newR, r - q * newR];
  }

  if (r > 1) throw new Error('Inverso não existe');
  if (t < 0) t += M;
  return t;
}
```

### 4.3 Módulo Seguro (Sempre não-negativo)

```typescript
function modSafe(x: number, M: number): number {
  const r = x % M;
  return r < 0 ? r + M : r;
}
```

### 4.4 Conversão Caractere ↔ Valor

```typescript
// M=95: offset=32 (espaço), M=26: offset=65 ('A')
function charToVal(ch: string, offset: number): number {
  return ch.charCodeAt(0) - offset;
}

function valToChar(v: number, offset: number): string {
  return String.fromCharCode(v + offset);
}
```

---

## 5. Exemplo Passo a Passo — ATAQUE (M=26)

**Configuração:** `M=26, a=5, b=8, s=3, a⁻¹=21` | **Plaintext:** `ATAQUE` (A=0, T=19, A=0, Q=16, U=20, E=4)

| i | Char | pᵢ | Fórmula (cifragem) | cᵢ | Cipher |
|---|------|-----|-------------------|-----|--------|
| 0 | A | 0 | (5·0 + 8 + 3·0) mod 26 = 8 mod 26 | 8 | **I** |
| 1 | T | 19 | (5·19 + 8 + 3·1) mod 26 = 106 mod 26 | 2 | **C** |
| 2 | A | 0 | (5·0 + 8 + 3·2) mod 26 = 14 mod 26 | 14 | **O** |
| 3 | Q | 16 | (5·16 + 8 + 3·3) mod 26 = 97 mod 26 | 19 | **T** |
| 4 | U | 20 | (5·20 + 8 + 3·4) mod 26 = 120 mod 26 | 16 | **Q** |
| 5 | E | 4 | (5·4 + 8 + 3·5) mod 26 = 43 mod 26 | 17 | **R** |

**Resultado:** `ATAQUE` → **`ICOTQR`** ✅

---

### Decifragem de `ICOTQR` (verificação)

| i | Char | cᵢ | Fórmula (decifragem) | pᵢ | Plain |
|---|------|-----|---------------------|-----|--------|
| 0 | I | 8 | [21·(8 - 8 - 3·0)] mod 26 = 0 mod 26 | 0 | **A** |
| 1 | C | 2 | [21·(2 - 8 - 3·1)] mod 26 = [21·(-9)] mod 26 = (-189) mod 26 = 19 | 19 | **T** |
| 2 | O | 14 | [21·(14 - 8 - 3·2)] mod 26 = [21·0] mod 26 = 0 | 0 | **A** |
| 3 | T | 19 | [21·(19 - 8 - 3·3)] mod 26 = [21·0] mod 26 = 0 → 16* | 16 | **Q** |
| 4 | Q | 16 | [21·(16 - 8 - 3·4)] mod 26 = [21·(-8)] mod 26 = (-168) mod 26 = 20 | 20 | **U** |
| 5 | R | 17 | [21·(17 - 8 - 3·5)] mod 26 = [21·(-8)] mod 26 = 4 | 4 | **E** |

> *Linha 3: `19-8-9=2` → `21×2=42 mod 26 = 16` ✓

**Resultado:** `ICOTQR` → **`ATAQUE`** ✅

---

## 6. Vetores de Teste Obrigatórios (M=26, a=5, b=8, s=3)

| # | Plaintext | Ciphertext | Status |
|---|-----------|------------|--------|
| 1 | ATAQUE | ICOTQR | ✅ Referência do documento |
| 2 | TROPAS | ZSGOUJ | ✅ Validado |
| 3 | DEFESA | XFNLGX | ✅ Validado |
| 4 | RECUAR | PFYNUE | ✅ Validado |
| 5 | VITORIA | JZFJBLA | ✅ Validado |

> **Nota:** O documento original continha erros nos vetores 2–5. Esta versão usa os valores **matematicamente corretos** pela fórmula.

---

## 7. Casos de Borda (M=95, Produção)

| Caso | Plaintext | Observação |
|------|-----------|------------|
| String vazia | `''` | Retorna `''` |
| Um caractere | `'A'` | Funciona (i=0) |
| Espaços/pontuação | `'OLA MUNDO!'` | ASCII completo suportado |
| Números | `'TESTE123'` | Dígitos incluídos no alfabeto |
| Especiais | `'ABC@#$%'` | Símbolos ASCII 33–47, 58–64, etc. |
| Minúsculas/maiúsculas | `'AbCdEfGh'` | Case-sensitive (valores diferentes) |
| Mensagem longa | `50+ chars` | Salto `s·i` cresce linearmente |

---

## 8. Chaves Inválidas (Rejeitadas pelo Sistema)

| a | M | mdc(a, M) | Por que falha |
|---|---|-----------|---------------|
| 5 | 95 | 5 | 95 = 5 × 19 → colisão a cada 19 posições |
| 19 | 95 | 19 | 95 = 5 × 19 → colisão a cada 5 posições |
| 10 | 26 | 2 | Pares colidem (a·p mod 26 sempre par) |
| 13 | 26 | 13 | Colisão a cada 2 posições |

---

## 9. Propriedades de Segurança (Contexto Educacional)

| Propriedade | Avaliação |
|-------------|-----------|
| **Resistência a frequência** | ✅ Alta — salto posicional `s·i` quebra padrões (ex: dois `A` em posições diferentes → cifras diferentes) |
| **Espaço de chaves** | `φ(M) × M²` — para M=95: `φ(95)=72` → ~650k chaves válidas |
| **Ataque de texto plano conhecido** | ⚠️ Vulnerável — equação linear resolve `(a, b, s)` com 3 pares conhecidos |
| **Ataque de texto cifrado apenas** | ⚠️ Vulnerável — análise de diferenças entre posições revela `s` e `a` |
| **Uso recomendado** | **Apenas educacional / CTF / gamificação** — **NÃO usar em produção real** |

---

## 10. API da Biblioteca `@cifra/ccg-core`

```typescript
import {
  encrypt,
  decrypt,
  encryptWithSteps,
  decryptWithSteps,
  verifyRoundtrip,
  validateKey,
  modInv,
  modSafe,
  gcd,
  DEFAULT_PROD_CONFIG,
  ACADEMIC_CONFIG,
  DEFAULT_KEY,
  ACADEMIC_KEY,
} from '@cifra/ccg-core';

// Uso simples
const cipher = encrypt('MENSAGEM', DEFAULT_PROD_CONFIG);
const plain = decrypt(cipher, DEFAULT_PROD_CONFIG);

// Com passos detalhados (para Sandbox/Academia)
const { ciphertext, steps } = encryptWithSteps('ATAQUE', ACADEMIC_CONFIG);

// Validação de chave
if (!validateKey({ a, b, s }, M)) throw new Error('Chave inválida');

// Roundtrip test
verifyRoundtrip('TESTE', DEFAULT_PROD_CONFIG); // true
```

---

## 11. Referências de Implementação

- **Core (TS puro):** `packages/ccg-core/src/index.ts` + `types.ts`
- **Testes vetoriais:** `packages/ccg-core/src/test-vectors.ts` + `index.test.ts`
- **Frontend Academia:** `apps/web/src/components/academia/`
  - `RaioXMatematico.tsx` — Fórmulas, dicionário, exemplo ATAQUE, guia mod, reversibilidade
  - `ResumoCifra.tsx` — 4 passos + diferenciais + chave produção
  - `SandboxLab.tsx` — Laboratório interativo com passos por caractere
  - `DesafiosRecruta.tsx` — 5 vetores + chaves inválidas
- **API:** `apps/api/src/services/message.service.ts` (integração WebSocket + CCG)

---

## 12. Changelog da Especificação

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | 2026-11-20 | Especificação inicial completa com vetores validados, exemplo ATAQUE, chaves inválidas, propriedades de segurança |

---

*Documento gerado para o projeto **CIFRA CHALLENGE** — SENAC.*
*Implementação de referência em TypeScript: `@cifra/ccg-core`.*