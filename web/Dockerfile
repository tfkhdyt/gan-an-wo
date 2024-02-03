FROM node:21.6.1-alpine3.19 AS builder
WORKDIR /app
COPY package.json ./
RUN npm i
COPY . .
RUN npm run build

FROM node:21.6.1-alpine3.19
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
RUN npm i --omit=dev
EXPOSE 3000
CMD ["npm", "start"]
