FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm ci && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Install OTel instrumentation
RUN npm install @opentelemetry/api @opentelemetry/auto-instrumentations-node

EXPOSE 3000
CMD ["node", "server.js"]
