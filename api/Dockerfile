FROM golang:1.22.0-alpine3.19 AS builder

WORKDIR /src

COPY . .

ENV CGO_ENABLED=0
ENV GOOS=linux
ENV GOARCH=amd64

RUN go build -ldflags="-s -w" -o gan-an-wo ./cmd/api

FROM gcr.io/distroless/static-debian12:nonroot

WORKDIR /app

COPY --from=builder --chown=nonroot:nonroot /src/gan-an-wo ./gan-an-wo

CMD [ "./gan-an-wo" ]
