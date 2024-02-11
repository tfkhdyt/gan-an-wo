FROM node:18.19.0-alpine3.19 AS builder
WORKDIR /app
COPY package.json ./
ARG API_URL
ARG API_SECRET_KEY
ENV NEXT_PUBLIC_API_URL ${API_URL}
ENV NEXT_PUBLIC_API_SECRET_KEY ${API_SECRET_KEY}
RUN npm i
COPY . .
RUN npm run build

FROM gcr.io/distroless/nodejs18-debian12
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static/
EXPOSE 3000
CMD ["node", "server.js"]
