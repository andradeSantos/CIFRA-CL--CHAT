FROM node:20-alpine

RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm@9.6.0

# Copy workspace root config
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./

# Copy ccg-core source (needed for file: dependency)
COPY packages/ccg-core/ ./packages/ccg-core/

# Copy web source
COPY apps/web/ ./apps/web/

# Install all workspace dependencies from root
RUN pnpm install

# Build Next.js (standalone output)
ARG NEXT_PUBLIC_API_URL=http://api:3001
ARG NEXT_PUBLIC_WS_URL=ws://localhost:10023
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL}
RUN pnpm --filter @cifra/web build
RUN cp -r apps/web/.next/static apps/web/.next/standalone/apps/web/.next/static

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

CMD ["node", "apps/web/.next/standalone/apps/web/server.js"]