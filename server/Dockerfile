# Fly.io / Render ready
FROM node:20-alpine AS base

WORKDIR /app

# Install server deps
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# Build client
COPY ../client /client
RUN cd /client && npm ci --no-audit --no-fund && npm run build

# Copy server source
COPY ./src ./src

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

CMD ["npm","start"]
