# CIFRA CHALLENGE — Cifra do Conselho de Guerra (CCG)

> **Projeto acadêmico SENAC** — Implementação completa da Cifra do Conselho de Guerra com frontend Next.js, API Fastify, criptografia modular e academia interativa.

---

## 🎯 Visão Geral

O **CIFRA CHALLENGE** é uma aplicação full-stack que implementa a **Cifra do Conselho de Guerra (CCG)** — uma cifra afim posicional generalizada com salto progressivo. O projeto demonstra:

- **Criptografia simétrica** baseada em aritmética modular
- **Frontend Next.js 14** com App Router, Tailwind CSS e design system próprio (paleta terra/areia)
- **API Fastify** com WebSocket, autenticação JWT e Prisma/PostgreSQL
- **Academia Interativa** com 6 abas: Manual Histórico, Resumo da Cifra, Raio-X Matemático, Laboratório Sandbox, Desafios do Recruta, Painel Demo
- **Validação automática de chaves** (mdc(a, M) = 1) via Algoritmo de Euclides Estendido
- **Testes vetoriais acadêmicos** (5 vetores M=26) e casos de borda M=95

---

## 🏗️ Arquitetura

```
cifra_challenge/
├── apps/
│   ├── web/                 # Next.js 14 (React 18, Tailwind, TypeScript)
│   │   ├── src/
│   │   │   ├── app/         # App Router pages
│   │   │   ├── components/  # UI + Academia components
│   │   │   ├── lib/         # Cliente CCG (TypeScript)
│   │   │   └── styles/      # Globals + design tokens
│   │   └── Dockerfile
│   └── api/                 # Fastify API (TypeScript)
│       ├── src/
│       │   ├── routes/      # REST endpoints
│       │   ├── services/    # Business logic
│       │   ├── plugins/     # WebSocket, security
│       │   └── middleware/  # Auth JWT
│       ├── prisma/          # Schema + migrations
│       └── Dockerfile
├── packages/
│   └── ccg-core/            # Biblioteca criptográfica pura (TS)
│       ├── src/
│       │   ├── index.ts     # encrypt/decrypt + steps
│       │   ├── types.ts     # Schemas Zod, validação, math utils
│       │   └── test-vectors.ts # 5 vetores acadêmicos + edge cases
│       └── vitest tests
├── docker-compose.yml       # Postgres + API + Web + Prisma Studio
├── turbo.json               # Turborepo pipeline
└── package.json             # pnpm workspace
```

---

## ⚡ Início Rápido

### Pré-requisitos
- **Docker** + Docker Compose
- **Node.js 20+** (para desenvolvimento local)
- **pnpm 9+**

### Com Docker (Produção)

```bash
# Clone e suba tudo
git clone <repo>
cd cifra_challenge
docker compose up -d --build

# Acesse:
# Frontend:     http://localhost:10022
# API:          http://localhost:10023
# Prisma Studio: http://localhost:5555
```

### Desenvolvimento Local

```bash
# Instala dependências
pnpm install

# Sobe apenas o Postgres
docker compose up -d postgres

# Roda migrações
pnpm --filter @cifra/api db:migrate

# Inicia dev servers (API + Web em paralelo)
pnpm dev

# Web:  http://localhost:3000
# API:  http://localhost:3001
```

---

## 🔐 A Cifra CCG — Resumo Técnico

| Parâmetro | Produção (Chat Clã) | Acadêmico (Testes) |
|-----------|---------------------|-------------------|
| **M**     | 95 (ASCII 32–126)   | 26 (A–Z)          |
| **a**     | 7                   | 5                 |
| **b**     | 8                   | 8                 |
| **s**     | 3                   | 3                 |
| **a⁻¹**   | 68 (mod 95)         | 21 (mod 26)       |

**Fórmulas:**
```
Cifrar:    cᵢ = (a · pᵢ + b + s · i) mod M
Decifrar:  pᵢ = [a⁻¹ · (cᵢ - b - s · i)] mod M
```

**Condição de reversibilidade:** `mdc(a, M) = 1` (chave válida ⇔ `a` coprimo de `M`)

---

## 🧪 Testes

```bash
# Todos os testes (workspace)
pnpm test

# Apenas ccg-core (vetores acadêmicos + edge cases)
pnpm --filter @cifra/ccg-core test

# Apenas web
pnpm --filter @cifra/web test

# Apenas api
pnpm --filter @cifra/api test
```

**Vetores de teste acadêmicos (M=26, a=5, b=8, s=3):**
| # | Plaintext | Ciphertext |
|---|-----------|------------|
| 1 | ATAQUE    | ICOTQR     |
| 2 | TROPAS    | ZSGOUJ     |
| 3 | DEFESA    | XFNLGX     |
| 4 | RECUAR    | PFYNUE     |
| 5 | VITORIA   | JZFJBLA    |

---

## 📚 Academia da Cifra (Frontend)

Acesse `http://localhost:10022/academia` (ou `:3000` em dev) para 6 abas interativas:

1. **Manual Histórico** — Contexto narrativo da cifra
2. **Resumo da Cifra** — 4 passos + diferenciais + chave de produção
3. **Raio-X Matemático** — Fórmulas, dicionário de variáveis, exemplo passo a passo (ATAQUE), guia do `mod`, condição de reversibilidade
4. **Laboratório Sandbox** — Cifra/decifra interativa com passos detalhados por caractere
5. **Desafios do Recruta** — 5 vetores de teste + validação de chaves inválidas
6. **Painel Demo** — Chat criptografado em tempo real (WebSocket)

---

## 🛠️ Stack Tecnológico

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, Lucide Icons |
| **Backend** | Fastify, TypeScript, Prisma ORM, PostgreSQL |
| **Crypto** | `@cifra/ccg-core` (pure TS, zero deps), Euclides Estendido |
| **Auth** | JWT (access + refresh), HttpOnly cookies, bcrypt |
| **Real-time** | WebSocket (ws) nativo no Fastify |
| **Build** | Turborepo, tsup, pnpm workspaces |
| **Deploy** | Docker multi-stage, standalone Next.js output |

---

## 📁 Variáveis de Ambiente

```bash
# .env (raiz)
DATABASE_URL=postgresql://cla_user:cla_pass@localhost:5432/cla_db
JWT_SECRET=seu-segredo-super-seguro
COOKIE_SECRET=outro-segredo-para-cookies
FRONTEND_URL=http://localhost:10022
NEXT_PUBLIC_API_URL=http://localhost:10023
NEXT_PUBLIC_WS_URL=ws://localhost:10023
API_PORT=10023
WEB_PORT=10022
PRISMA_STUDIO_PORT=5555
```

---

## 📄 Licença

Projeto acadêmico SENAC — Uso educacional.