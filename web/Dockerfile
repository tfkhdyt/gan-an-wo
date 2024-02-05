FROM node:21.6.1-alpine3.19 AS builder
WORKDIR /app
COPY package.json ./
ARG API_URL
ARG API_SECRET_KEY
ENV NEXT_PUBLIC_API_URL ${API_URL}
ENV NEXT_PUBLIC_API_SECRET_KEY ${API_SECRET_KEY}}
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
