FROM node:20-alpine

RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
RUN npm install -g pnpm@9.6.0

# Copy workspace root config
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./

# Copy ccg-core source (needed for file: dependency)
COPY packages/ccg-core/ ./packages/ccg-core/

# Copy api source
COPY apps/api/ ./apps/api/

# Install all workspace dependencies from root
RUN pnpm install

# Generate Prisma client and build
RUN pnpm --filter @cifra/api db:generate
RUN pnpm --filter @cifra/api build

ENV NODE_ENV=production
ENV DATABASE_URL=postgresql://cla_user:cla_pass@postgres:5432/cla_db
ENV JWT_SECRET=${JWT_SECRET}
ENV COOKIE_SECRET=${COOKIE_SECRET}

EXPOSE 3001

CMD ["node", "apps/api/dist/index.js"]