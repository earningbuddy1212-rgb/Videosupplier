# Multi-stage Dockerfile to build client and server into a single production image

# 1) Build client
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --silent
COPY client/ .
RUN npm run build

# 2) Build server and copy client build
FROM node:20-alpine AS server-build
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production --silent
COPY server/ ./server/
# copy built client into server public folder
COPY --from=client-build /app/client/dist ./server/public

ENV NODE_ENV=production
WORKDIR /app/server
EXPOSE 4000
CMD ["node", "src/index.js"]
