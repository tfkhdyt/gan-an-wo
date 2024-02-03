FROM node:20.11.0-slim AS builder
WORKDIR /app
COPY package.json ./
RUN npm i
COPY . .
RUN npm run build

FROM gcr.io/distroless/nodejs20-debian12:nonroot
WORKDIR /app
COPY --from=builder --chown=nonroot:nonroot /app/package.json ./
COPY --from=builder --chown=nonroot:nonroot /app/.next ./.next
COPY --from=builder --chown=nonroot:nonroot /app/public ./public
RUN npm i --omit=dev
EXPOSE 3000
CMD ["npm", "start"]
