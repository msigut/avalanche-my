# Stage 0
FROM node:20.10-alpine AS base
RUN apk update  --no-cache && apk upgrade --no-cache openssl && apk add --no-cache libc6-compat

# DEV - pro vyvoj a testovani
FROM base as dev
WORKDIR /app
ENV NODE_ENV development
COPY package.json ./
RUN yarn install --no-lockfile
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
EXPOSE 3000
CMD ["yarn", "dev"]

# Stage 1 - bez yarn.lock, cista instalace v produkcnim modu, po instalaci vymaze cache
FROM base AS deps
WORKDIR /app
COPY package.json ./
RUN yarn install --no-lockfile --production && yarn cache clean

# Stage 2 - produkcni sesvetaveni [nextConfig.mjs: output: "standalone"] [.dockerignore: node_modules]
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Stage 3 - finalni kompozice: /.next/standalone + /public + user:nodejs + user + port + ENV + TELEMETRY:OFF
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
USER nextjs
ENV PORT 3000
ENV NEXT_TELEMETRY_DISABLED 1
EXPOSE 3000
CMD ["node", "server.js"]
