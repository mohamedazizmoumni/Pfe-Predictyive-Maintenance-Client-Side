# Angular 17 Universal (SSR) public marketing site. Same two-stage shape as
# the dashboard-frontend Dockerfile: compile with full devDependencies, run
# with only the production deps the Express SSR server
# (server.ts -> dist/sentinel-marketing/server/server.mjs) actually needs.

FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget -q --spider http://localhost:${PORT}/ || exit 1

CMD ["node", "dist/sentinel-marketing/server/server.mjs"]
