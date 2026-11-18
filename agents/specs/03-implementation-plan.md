# Plano de Implementação — Chat Clã (CCG)

**Objetivo:** Entregar sistema funcional para apresentação acadêmica (04/12) com 3 partes: Ideia (4min), Demo Manual (4min), Implementação ao Vivo (7min).

---

## Cronograma (Semanas até 04/12)

| Semana | Datas | Foco | Entregável |
|--------|-------|------|------------|
| **S1** | 17–23 Nov | **Foundation** | Monorepo, Docker, DB, CCG Core (testes passando) |
| **S2** | 24–30 Nov | **Backend Auth + WS** | API rodando: register/login/JWT cookie, WS broadcast |
| **S3** | 01–07 Dez | **Frontend Chat + UI** | Next.js: login, sala Clã, mensagens cifradas, menu contexto, timer 10s |
| **S4** | 08–11 Dez | **Academia + Polish** | Sandbox, Desafios, Raio-X, Design System, Slides, Ensaios |

> **Hoje é 17/11 (Segunda).** Início da S1.

---

## S1 — Foundation (17–23 Nov)

### Dia 1 (17/11) — Setup Monorepo + CCG Core
- [ ] `pnpm init -w` + `turbo.json` workspaces
- [ ] `packages/ccg-core`: implementar `math.ts`, `index.ts`, `types.ts`
- [ ] **Testes unitários (Vitest):**
  - `gcd`, `modInv`, `modSafe`
  - `encrypt/decrypt` roundtrip M=95 (chave a=7,b=8,s=3)
  - **5 vetores M=26** (ATAQUE→ICOTQR etc.) — **obrigatório para academia**
- [ ] Publicar package local (`pnpm install`)

### Dia 2 (18/11) — Docker + PostgreSQL + Prisma
- [ ] `docker-compose.yml` (postgres, api, web)
- [ ] `apps/api/prisma/schema.prisma` (User, Message)
- [ ] `pnpm db:push` → migrações iniciais
- [ ] Healthcheck postgres funcionando

### Dia 3 (19/11) — Fastify Bootstrap
- [ ] `apps/api`: Fastify + plugins (jwt, cookie, cors, websocket)
- [ ] Config JWT/Cookie (secrets via env)
- [ ] Rota `GET /health` → 200 OK
- [ ] `docker compose up -d` sobe tudo sem erros

### Dia 4 (20/11) — Auth Routes
- [ ] `POST /auth/register` → bcrypt hash + Prisma create
- [ ] `POST /auth/login` → verify + sign JWT + set cookie
- [ ] `POST /auth/logout` → clear cookie
- [ ] `GET /auth/me` → valida cookie, retorna user
- [ ] Testes integração (Supertest)

### Dia 5 (21/11) — WebSocket Server
- [ ] Plugin WS com autenticação via cookie
- [ ] Sala única `cla`: join/leave/broadcast
- [ ] `GET /messages` (histórico paginado)
- [ ] Persistência `Message` (sender_id, ciphertext, version)
- [ ] Broadcast `presence` (online/offline)

### Dia 6–7 (22–23/11) — Integração FE/BE + Buffer
- [ ] Next.js bootstrap (`apps/web`) + Tailwind + design tokens
- [ ] Proxy `/api/*` → Fastify (Next rewrites)
- [ ] WS client hook conecta, recebe history + presence
- [ ] **Checkpoint S1:** `docker compose up` → API + WS + DB funcionando

---

## S2 — Backend Completo (24–30 Nov)

### Dia 8 (24/11) — Validação CCG Server-side (Demo)
- [ ] `CcgService` usa `ccg-core` para cifrar/decifrar no backend (apenas para demo do painel de apresentação)
- [ ] Endpoint `POST /ccg/encrypt` + `POST /ccg/decrypt` (protegido, só demo)

### Dia 9 (25/11) — Rate Limit + Segurança
- [ ] `@fastify/rate-limit`: auth 5/min, WS 30/s
- [ ] Helmet/CSP headers
- [ ] CORS restrito ao frontend

### Dia 10 (26/11) — Testes E2E Backend
- [ ] Playwright: register → login → WS connect → send msg → receive
- [ ] Verifica cookie HttpOnly no DevTools (requisito apresentação)

### Dia 11–12 (27–28/11) — **Segundo Acompanhamento (27/11)**
- [ ] Preparar demo da cifra funcionando (manual + computacional)
- [ ] Slides Parte 1 + 2 prontos
- [ ] Buffer para imprevistos

### Dia 13–14 (29–30/11) — Refinamento Backend
- [ ] Logs estruturados (pino)
- [ ] Graceful shutdown (SIGTERM)
- [ ] Documentação API (Scalar/OpenAPI)

---

## S3 — Frontend Chat + UI (01–07 Dez)

### Dia 15 (01/12) — Layout + Autenticação FE
- [ ] `(auth)/login` + `(auth)/register` pages (Server Components)
- [ ] `useAuth` hook (ler cookie via `/auth/me`)
- [ ] Middleware Next.js: protege `/chat/*`, redireciona se sem sessão
- [ ] Design tokens aplicados (cores, tipografia, raio)

### Dia 16 (02/12) — Sala Clã (Chat)
- [ ] Layout: Sidebar (membros online) + Main (MessageList + Input)
- [ ] `MessageList`: virtualização (react-window) para histórico
- [ ] `MessageBubble`: renderiza **apenas ciphertext** (fonte mono, cor umber)
- [ ] `MessageInput`: onSubmit → `ccg-core.encrypt()` → WS send

### Dia 17 (03/12) — Menu Contextual + Timer 10s
- [ ] `ContextMenu` component (Framer Motion spring + blur)
- [ ] Desktop: `onContextMenu` → anchor + popover
- [ ] Mobile: `onTouchStart` + 500ms hold → haptic + popover
- [ ] "Descriptografar" → `ccg-core.decrypt()` local → substitui texto
- [ ] **Timer visual:** barra circular regressiva 10s (SVG stroke-dashoffset)
- [ ] Auto-ocultação: `setTimeout(10s)` → volta ciphertext

### Dia 18 (04/12) — **Apresentação Final (04/12)**
- [ ] Ensaiar 3 partes (15 min total)
- [ ] Verificar: DevTools mostra cookie HttpOnly + JWT
- [ ] Verificar: DB armazena apenas ciphertext
- [ ] Verificar: 5 testes obrigatórios PASS no painel demo

### Dia 19–21 (05–07/12) — Polish UI/UX
- [ ] Animações entrada/saída mensagens (Framer layout)
- [ ] Scroll suave, focus-visible, ARIA labels
- [ ] Dark mode toggle (persiste no localStorage)
- [ ] Responsividade mobile (44px touch targets)

---

## S4 — Academia da Cifra + Entrega (08–11 Dez)

### Dia 22 (08/12) — Academia: Estrutura + Navegação
- [ ] Rota `/academia` (layout com sidebar steps)
- [ ] Step 1: Manual Histórico (MDX + imagens)
- [ ] Step 2: Raio-X Matemático (KaTeX render das fórmulas)
- [ ] Step 3: Laboratório Sandbox (input texto + chaves → tabela animada)
- [ ] Step 4: Desafios (3 níveis, validação, badge no perfil)

### Dia 23 (09/12) — Sandbox Interativo
- [ ] Tabela passo a passo: `i | char | p_i | conta | c_i | char`
- [ ] Animação linha a linha (stagger Framer Motion)
- [ ] Botão "Mostrar Inversa" expande cálculo decifragem
- [ ] Chaves editáveis (valida mdc(a,M)=1 em tempo real)

### Dia 24 (10/12) — Desafios + Integração Perfil
- [ ] Nível 1 (Iniciante): M=26, chaves dadas, 3 perguntas
- [ ] Nível 2 (Estrategista): M=95, chaves dadas, 3 perguntas
- [ ] Nível 3 (General): apenas ciphertext + dica, descobre chaves
- [ ] Conclusão → atualiza `User.rank` + badge visual

### Dia 25 (11/12) — **Avaliação Final + Entrega**
- [ ] Build produção (`pnpm build` + `docker compose -f docker-compose.prod.yml up`)
- [ ] README: como rodar local, variáveis, comandos
- [ ] Código-fonte zipado / GitHub
- [ ] Slides finais (PDF)
- [ ] Documento técnico (specs já criados)

---

## Riscos e Mitigações

| Risco | Prob. | Impacto | Mitigação |
|-------|-------|---------|-----------|
| `a` não coprimo de 95 quebra decrypt | Alta | Crítico | Validar no `ccg-core` + testes; usar `a=7` fixo |
| WS não autentica cookie no Docker | Média | Alto | Testar cedo (Dia 5); `credentials: 'include'` no FE |
| Timer 10s desync entre abas | Baixa | Médio | Timer purely local (não sincronizado) — by design |
| Mobile long-press conflita com scroll | Média | Médio | `touch-action: none` no balão; testar iOS/Android |
| Tempo curto para Academia (S4) | Alta | Médio | Priorizar Sandbox + 1 desafio; Manual/Raio-X estáticos |

---

## Definição de Pronto (DoD) por Feature

| Feature | DoD |
|---------|-----|
| **CCG Core** | 100% testes Vitest passam; 5 vetores M=26 validados; roundtrip M=95 |
| **Auth** | Register/login/logout/me funcionam; cookie HttpOnly visível no DevTools |
| **WS** | Conecta autenticado; broadcast history + presence + novas msgs |
| **Chat UI** | Mensagens cifradas por padrão; menu contexto abre; decrypt 10s + auto-hide |
| **Academia** | 4 steps navegáveis; Sandbox animado; 1 desafio jogável |
| **Docker** | `docker compose up -d` sobe 3 containers healthy; `pnpm db:push` roda |
| **Apresentação** | 3 partes ensaiadas < 15min; demo ao vivo sem erros |

---

## Comandos Úteis (Cheat Sheet)

```bash
# Desenvolvimento
pnpm dev                    # sobe web + api (turbo)
pnpm docker:up              # sobe postgres + api + web (docker)
pnpm docker:logs            # logs combinados
pnpm db:push                # prisma db push (api)
pnpm db:studio              # prisma studio (abre browser)

# Testes
pnpm test                   # todos workspaces
pnpm --filter ccg-core test # só core
pnpm --filter api test      # só api
pnpm --filter web test      # só web
pnpm e2e                    # playwright

# Build/Produção
pnpm build                  # turbo build
docker compose -f docker-compose.prod.yml up -d --build

# Limpeza
pnpm docker:down            # para containers + remove volumes
```

---

## Checklist de Acompanhamentos Acadêmicos

| Data | Evento | Preparação |
|------|--------|------------|
| **13/11** | 1º Acompanhamento | ✓ Ideia + proposta (já feito nos docs) |
| **27/11** | 2º Acompanhamento | Cifra funcionando (manual + código); slides Parte 1+2 |
| **04/12** | Apresentação Final | Sistema completo rodando; slides 3 partes; demo ao vivo |
| **11/12** | Avaliação Final | Código + doc técnico + slides entregues |

---

## Notas Pessoais

- **Chave CCG fixa para demo:** `a=7, b=8, s=3, M=95` (a=7 é coprimo de 95)
- **Não inventar cripto real:** CCG é didática; foco na **experiência** (cifra auto, decrypt sob demanda, academia)
- **Design Apple + Terroso** é diferencial visual — caprichar nos tokens e micro-interações
- **DevTools ao vivo** na apresentação: aba Application → Cookies → `token` (HttpOnly) + aba Network → WS frames cifrados
- **Banco de dados:** `SELECT * FROM messages;` mostra apenas ciphertext — ponto forte para segurança

---

*Plano vivo — atualizar conforme progresso. Marcar ✓ ao concluir cada item.*