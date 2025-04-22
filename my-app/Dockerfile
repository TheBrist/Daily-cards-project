# Build stage
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Serve stage
FROM node:20
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist .
CMD ["serve", "-s", ".", "-l", "8080"]