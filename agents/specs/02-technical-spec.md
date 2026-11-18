# Especificação Técnica e Arquitetura — Chat Clã

**Versão:** 1.0  
**Data:** 2026-11-17

---

## 1. Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────────┐
│                        DOCKER NETWORK                           │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │   Next.js    │◄──►│   Fastify    │◄──►│   PostgreSQL 16  │  │
│  │   (Frontend) │    │   (Backend)  │    │   (Database)     │  │
│  │   Port 3000  │    │   Port 3001  │    │   Port 5432      │  │
│  └──────────────┘    └──────────────┘    └──────────────────┘  │
│         │                   │                    │              │
│         │              WS ↑ │                    │              │
│         └───────────────────┴────────────────────┘              │
│                          ▲                                      │
│                    Cookie/JWT                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Stack Tecnológica

| Camada | Tech | Versão | Justificativa |
|--------|------|--------|---------------|
| **Frontend** | Next.js (App Router) | 14+ | Roteamento protegido, SSR/CSR híbrido, performance |
| | React | 18+ | Hooks, Suspense, Server Components |
| | TypeScript | 5+ | Type safety end-to-end |
| | Tailwind CSS | 3.4+ | Utility-first, design tokens, dark mode nativo |
| | Framer Motion | 11+ | Animações spring, layout animations |
| | Lucide React | 0.4+ | Ícones finos (stroke 1.5) estilo Apple |
| | KaTeX | 0.16+ | Renderização matemática rápida (SSR-compatible) |
| **Backend** | Fastify | 4.28+ | Baixa latência, schema validation, plugins ecosystem |
| | @fastify/jwt | 8+ | JWT assinado (HS256/RS256) |
| | @fastify/cookie | 9+ | Cookies assinados, HttpOnly, SameSite |
| | @fastify/websocket | 10+ | WS nativo, integração com hooks Fastify |
| | @fastify/cors | 9+ | CORS configurável |
| | bcryptjs / argon2 | latest | Hash senhas (cost 12) |
| | Prisma ORM | 5+ | Type-safe DB, migrations, DX |
| | Zod | 3.23+ | Validação schemas (compartilhado FE/BE) |
| **Database** | PostgreSQL | 16 (Alpine) | Confiável, JSONB, UUID, Docker oficial |
| **Infra** | Docker Compose | 2.24+ | One-command dev/prod parity |
| | Node.js | 20 LTS | Runtime unificado FE/BE |

---

## 3. Estrutura do Monorepo

```
cifra_challenge/
├── apps/
│   ├── web/                 # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/         # App Router pages
│   │   │   │   ├── (auth)/  # login, register
│   │   │   │   ├── (chat)/  # chat layout + page
│   │   │   │   ├── academia/ # módulo educacional
│   │   │   │   └── api/     # Next.js route handlers (proxy)
│   │   │   ├── components/  # UI components
│   │   │   │   ├── ui/      # primitives (Button, Card, Popover)
│   │   │   │   ├── chat/    # MessageBubble, MessageList, Input
│   │   │   │   ├── academia/ # Sandbox, Challenges, MathViewer
│   │   │   │   └── layout/  # Header, Sidebar, ContextMenu
│   │   │   ├── lib/         # utils, ccg-client, ws-client
│   │   │   ├── hooks/       # useAuth, useWS, useDecryptTimer
│   │   │   ├── styles/      # globals.css + design tokens
│   │   │   └── types/       # shared types (Zod inferred)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── next.config.js
│   │   └── Dockerfile
│   │
│   └── api/                 # Fastify Backend
│       ├── src/
│       │   ├── routes/
│       │   │   ├── auth.ts       # POST /register, /login, /logout, /me
│       │   │   ├── messages.ts   # GET /messages, WS /ws
│       │   │   └── health.ts     # GET /health
│       │   ├── plugins/
│       │   │   ├── jwt.ts        # JWT config + cookie
│       │   │   ├── websocket.ts  # WS server + auth hook
│       │   │   └── cors.ts
│       │   ├── services/
│       │   │   ├── auth.service.ts
│       │   │   ├── message.service.ts
│       │   │   └── ccg.service.ts      # server-side encrypt/decrypt (demo)
│       │   ├── middleware/
│       │   │   └── auth.ts       # verify JWT from cookie
│       │   ├── prisma/
│       │   │   └── schema.prisma
│       │   ├── utils/
│       │   │   └── crypto.ts     # bcrypt, jwt sign/verify
│       │   └── index.ts          # bootstrap Fastify
│       ├── package.json
│       ├── tsconfig.json
│       └── Dockerfile
│
├── packages/
│   └── ccg-core/            # Shared CCG implementation (TS)
│       ├── src/
│       │   ├── index.ts           # encrypt, decrypt, validateKey
│       │   ├── math.ts            # modInv, gcd, modSafe
│       │   ├── types.ts           # CCGKey, CCGConfig
│       │   └── test-vectors.ts    # 5 casos obrigatórios (M=26)
│       ├── package.json
│       └── vitest.config.ts
│
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
├── package.json (root, workspaces)
├── turbo.json (Turborepo)
└── README.md
```

---

## 4. Modelo de Dados (Prisma Schema)

```prisma
// apps/api/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String    @id @default(uuid())
  username     String    @unique @db.VarChar(50)
  passwordHash String    @db.Text
  rank         String    @default("Recruta") @db.VarChar(30)
  createdAt    DateTime  @default(now())
  messages     Message[]
  @@map("users")
}

model Message {
  id            String   @id @default(uuid())
  senderId      String   @db.Uuid
  sender        User     @relation(fields: [senderId], references: [id])
  ciphertext    String   @db.Text
  cipherVersion String   @default("CCG-v1") @db.VarChar(20)
  createdAt     DateTime @default(now())
  @@index([createdAt])
  @@map("messages")
}
```

---

## 5. API Contracts (Zod Schemas)

```typescript
// packages/ccg-core/src/types.ts (shared)

export const CCGConfigSchema = z.object({
  M: z.literal(95),           // ASCII 32-126
  a: z.number().int().positive(), // coprimo de M
  b: z.number().int(),
  s: z.number().int(),
});

export type CCGConfig = z.infer<typeof CCGConfigSchema>;

export const CCGKeySchema = z.object({
  a: z.number().int(),
  b: z.number().int(),
  s: z.number().int(),
});

export type CCGKey = z.infer<typeof CCGKeySchema>;

// Validação: mdc(a, M) === 1
export function validateKey(key: CCGKey, M = 95): boolean {
  return gcd(key.a, M) === 1;
}
```

### 5.1 Auth Routes
| Method | Path | Body | Response | Cookies |
|--------|------|------|----------|---------|
| POST | `/auth/register` | `{username, password}` | `{id, username, rank}` | — |
| POST | `/auth/login` | `{username, password}` | `{id, username, rank}` | `token=jwt; HttpOnly; SameSite=Strict; Path=/` |
| POST | `/auth/logout` | — | `{ok: true}` | `token=; Max-Age=0` |
| GET | `/auth/me` | — | `{id, username, rank}` | (valida cookie) |

### 5.2 Messages Routes
| Method | Path | Query/Body | Response |
|--------|------|------------|----------|
| GET | `/messages` | `?limit=50&before=<iso>` | `Message[]` (ciphertext only) |
| WS | `/ws` | (cookie auth) | `{type: 'history'|'message'|'presence', payload}` |

**WS Message Types:**
```typescript
// Client → Server
{ type: 'send', payload: { ciphertext: string } }

// Server → Client
{ type: 'history', payload: Message[] }
{ type: 'message', payload: Message & { senderUsername: string } }
{ type: 'presence', payload: { userId: string, username: string, status: 'online'|'offline' } }
{ type: 'error', payload: { code: string, message: string } }
```

---

## 6. Implementação da CCG (Core Algorítmico)

### 6.1 Funções Matemáticas Base
```typescript
// packages/ccg-core/src/math.ts

export function gcd(a: number, b: number): number {
  while (b !== 0) [a, b] = [b, a % b];
  return Math.abs(a);
}

export function modInv(a: number, M: number): number {
  // Extended Euclidean Algorithm
  let [t, newT] = [0, 1];
  let [r, newR] = [M, a];
  while (newR !== 0) {
    const q = Math.floor(r / newR);
    [t, newT] = [newT, t - q * newT];
    [r, newR] = [newR, r - q * newR];
  }
  if (r > 1) throw new Error('Inverse does not exist');
  if (t < 0) t += M;
  return t;
}

export function modSafe(x: number, M: number): number {
  const r = x % M;
  return r < 0 ? r + M : r;
}
```

### 6.2 Cifragem/Decifragem (M=95)
```typescript
// packages/ccg-core/src/index.ts

const DEFAULT_KEY: CCGKey = { a: 7, b: 8, s: 3 }; // a=7 coprimo de 95
const M = 95; // ASCII 32 (space) ... 126 (~)
const OFFSET = 32; // char code base

export function charToVal(ch: string): number {
  return ch.charCodeAt(0) - OFFSET;
}

export function valToChar(v: number): string {
  return String.fromCharCode(modSafe(v, M) + OFFSET);
}

export function encrypt(plaintext: string, key: CCGKey = DEFAULT_KEY): string {
  if (!validateKey(key)) throw new Error('Invalid key: a not coprime with M');
  const aInv = modInv(key.a, M);
  return [...plaintext].map((ch, i) => {
    const p = charToVal(ch);
    const c = modSafe(key.a * p + key.b + key.s * i, M);
    return valToChar(c);
  }).join('');
}

export function decrypt(ciphertext: string, key: CCGKey = DEFAULT_KEY): string {
  if (!validateKey(key)) throw new Error('Invalid key: a not coprime with M');
  const aInv = modInv(key.a, M);
  return [...ciphertext].map((ch, i) => {
    const c = charToVal(ch);
    const p = modSafe(aInv * (c - key.b - key.s * i), M);
    return valToChar(p);
  }).join('');
}
```

### 6.3 Test Vectors (M=26 para validação acadêmica)
```typescript
// packages/ccg-core/src/test-vectors.ts
export const TEST_VECTORS_M26 = [
  { plain: 'ATAQUE', cipher: 'ICOTQR', key: { a: 5, b: 8, s: 3 } },
  { plain: 'TROPAS', cipher: 'ZJGVQJ', key: { a: 5, b: 8, s: 3 } },
  { plain: 'DEFESA', cipher: 'LMDXKM', key: { a: 5, b: 8, s: 3 } },
  { plain: 'RECUAR', cipher: 'JMYNQF', key: { a: 5, b: 8, s: 3 } },
  { plain: 'VITORIA', cipher: 'BWHOZCC', key: { a: 5, b: 8, s: 3 } },
];
```

---

## 7. Frontend — Componentes Críticos

### 7.1 Context Menu (Desktop + Mobile)
```tsx
// apps/web/src/components/chat/MessageBubble.tsx
interface MessageBubbleProps {
  message: Message; // { id, ciphertext, senderUsername, createdAt }
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const [showPlain, setShowPlain] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(null);
  const { decrypt, key } = useCCG(); // client-side CCG

  // Desktop: right-click
  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuAnchor({ x: e.clientX, y: e.clientY });
  };

  // Mobile: long press
  const onTouchStart = (e: React.TouchEvent) => {
    const timer = setTimeout(() => {
      const touch = e.touches[0];
      setMenuAnchor({ x: touch.clientX, y: touch.clientY });
      // haptic feedback
      navigator.vibrate?.(10);
    }, 500);
    e.currentTarget.ontouchend = () => clearTimeout(timer);
  };

  const handleDecrypt = () => {
    const plain = decrypt(message.ciphertext, key);
    setShowPlain(true);
    // 10s auto-hide
    setTimeout(() => setShowPlain(false), 10_000);
    setMenuAnchor(null);
  };

  return (
    <div className="relative group" onContextMenu={onContextMenu} onTouchStart={onTouchStart}>
      <div className="message-bubble">
        {showPlain ? (
          <>
            <span className="font-mono text-terracotta">{decrypt(message.ciphertext, key)}</span>
            <DecryptTimer /> {/* circular progress 10s */}
          </>
        ) : (
          <span className="font-mono text-umber">{message.ciphertext}</span>
        )}
      </div>

      {menuAnchor && (
        <ContextMenu anchor={menuAnchor} onClose={() => setMenuAnchor(null)}>
          <ContextMenuItem onClick={handleDecrypt}>
            <LockOpen className="w-4 h-4" />
            Descriptografar
          </ContextMenuItem>
        </ContextMenu>
      )}
    </div>
  );
}
```

### 7.2 WebSocket Client Hook
```typescript
// apps/web/src/hooks/useWS.ts
export function useWS() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [presence, setPresence] = useState<Presence[]>([]);

  useEffect(() => {
    const socket = new WebSocket(`${WS_URL}/ws`); // cookie sent automatically
    socket.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);
      switch (type) {
        case 'history': setMessages(payload); break;
        case 'message': setMessages((m) => [...m, payload]); break;
        case 'presence': setPresence((p) => updatePresence(p, payload)); break;
      }
    };
    setWs(socket);
    return () => socket.close();
  }, []);

  const send = (ciphertext: string) => ws?.send(JSON.stringify({ type: 'send', payload: { ciphertext } }));

  return { messages, presence, send };
}
```

---

## 8. Backend — Fastify Plugins e Rotas

### 8.1 JWT + Cookie Plugin
```typescript
// apps/api/src/plugins/jwt.ts
fastify.register(jwt, {
  secret: process.env.JWT_SECRET!,
  sign: { algorithm: 'HS256', expiresIn: '7d' },
  cookie: { cookieName: 'token', signed: false }, // HttpOnly handled by @fastify/cookie
});

fastify.register(cookie, {
  secret: process.env.COOKIE_SECRET!,
  hook: 'onRequest',
  parseOptions: { httpOnly: true, sameSite: 'strict', path: '/', secure: process.env.NODE_ENV === 'production' },
});
```

### 8.2 WebSocket com Autenticação
```typescript
// apps/api/src/plugins/websocket.ts
fastify.register(websocket);

fastify.register(async (fastify) => {
  fastify.get('/ws', { websocket: true }, async (conn, req) => {
    // Validate JWT from cookie
    const token = req.cookies.token;
    if (!token) { conn.socket.close(4001, 'Unauthorized'); return; }
    let user: UserPayload;
    try { user = fastify.jwt.verify(token); } catch { conn.socket.close(4001, 'Invalid token'); return; }

    // Join Clã room
    const room = 'cla';
    fastify.rooms = fastify.rooms || new Map();
    const clients = fastify.rooms.get(room) || new Set();
    clients.add(conn.socket);
    fastify.rooms.set(room, clients);

    // Send history
    const history = await messageService.getRecent(50);
    conn.socket.send(JSON.stringify({ type: 'history', payload: history }));

    // Broadcast presence
    broadcast(room, { type: 'presence', payload: { userId: user.id, username: user.username, status: 'online' } }, conn.socket);

    conn.socket.on('message', async (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'send') {
        const saved = await messageService.create(user.id, msg.payload.ciphertext);
        broadcast(room, { type: 'message', payload: { ...saved, senderUsername: user.username } });
      }
    });

    conn.socket.on('close', () => {
      clients.delete(conn.socket);
      broadcast(room, { type: 'presence', payload: { userId: user.id, username: user.username, status: 'offline' } });
    });
  });
});

function broadcast(room: string, msg: object, exclude?: WebSocket) {
  fastify.rooms?.get(room)?.forEach((client) => {
    if (client !== exclude && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(msg));
    }
  });
}
```

---

## 9. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: postgres-cla
    environment:
      POSTGRES_DB: cla_db
      POSTGRES_USER: cla_user
      POSTGRES_PASSWORD: cla_pass
    ports:
      - "5432:5432"
    volumes:
      - pgdata_cla:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U cla_user -d cla_db"]
      interval: 5s
      timeout: 3s
      retries: 10

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    container_name: api-cla
    environment:
      DATABASE_URL: postgresql://cla_user:cla_pass@postgres:5432/cla_db
      JWT_SECRET: ${JWT_SECRET}
      COOKIE_SECRET: ${COOKIE_SECRET}
      NODE_ENV: development
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./apps/api:/app
      - /app/node_modules

  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    container_name: web-cla
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
      NEXT_PUBLIC_WS_URL: ws://localhost:3001
    ports:
      - "3000:3000"
    depends_on:
      - api
    volumes:
      - ./apps/web:/app
      - /app/node_modules
      - /app/.next

volumes:
  pgdata_cla:
```

---

## 10. Variáveis de Ambiente (`.env.example`)

```bash
# Database
DATABASE_URL=postgresql://cla_user:cla_pass@localhost:5432/cla_db

# Auth
JWT_SECRET=super-secret-jwt-key-min-32-chars-change-in-prod
COOKIE_SECRET=super-secret-cookie-key-min-32-chars-change-in-prod

# CCG Key (shared)
CCG_A=7
CCG_B=8
CCG_S=3
CCG_M=95

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

---

## 11. Design Tokens (Tailwind Config)

```javascript
// apps/web/tailwind.config.ts
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light (Pergaminho)
        'sand-light': '#F6F1E9',
        'sand': '#EBE2D3',
        'earth-border': '#D5C7B2',
        'terracotta': '#A65E2E',
        'ochre': '#C28449',
        'espresso': '#2B1E16',
        'umber': '#6E5849',
        // Dark (Terra Noturna)
        'dark-earth': '#1C1511',
        'bark': '#291F19',
      },
      fontFamily: {
        sans: ['-apple-system', 'SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'JetBrains Mono', 'Monaco', 'monospace'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
      animation: {
        'spring-in': 'springIn 0.3s ease-out',
        'blur-in': 'blurIn 0.2s ease-out',
      },
      keyframes: {
        springIn: { '0%': { transform: 'scale(0.95)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        blurIn: { '0%': { filter: 'blur(4px)', opacity: '0' }, '100%': { filter: 'blur(0)', opacity: '1' } },
      },
    },
  },
};
```

---

## 12. Segurança — Checklist

- [ ] Senhas: bcrypt cost 12 / Argon2id
- [ ] JWT: HS256, expiração 7d, secret ≥32 chars
- [ ] Cookies: HttpOnly, SameSite=Strict, Secure (prod), Path=/
- [ ] DB: apenas `ciphertext` persistido; `password_hash` nunca exposto
- [ ] WS: handshake valida cookie JWT; rejeita sem auth
- [ ] CORS: origin restrito (apenas frontend)
- [ ] Rate limit: login/register (5/min), WS msg (30/s)
- [ ] Helmet/CSP: headers de segurança no Fastify
- [ ] Validação Zod em todas as entradas (body, query, params)
- [ ] Logs: sem dados sensíveis (senhas, tokens, plaintext)

---

## 13. Testes

| Camada | Ferramenta | Cobertura Alvo |
|--------|------------|----------------|
| **CCG Core** | Vitest | 100% (encrypt/decrypt/roundtrip + 5 vetores M=26 + M=95) |
| **API** | Vitest + Supertest | Rotas auth, messages, WS (mock) |
| **Frontend** | Vitest + React Testing Library | Hooks, componentes críticos (MessageBubble, ContextMenu, Sandbox) |
| **E2E** | Playwright | Fluxo completo: register → login → send → decrypt → academia |

---

## 14. Scripts de Desenvolvimento

```json
// package.json (root)
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "db:push": "cd apps/api && npx prisma db push",
    "db:studio": "cd apps/api && npx prisma studio",
    "docker:up": "docker compose up -d",
    "docker:down": "docker compose down -v",
    "docker:logs": "docker compose logs -f"
  }
}
```