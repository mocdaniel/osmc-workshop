# ---- Build Stage ----
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Cache go.mod and go.sum
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -o talk-api ./cmd/main.go

# ---- Runtime Stage ----
FROM alpine:3.19

# Add non‑root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy the compiled binary from builder
COPY --from=builder /app/talk-api /app/talk-api

# Expose the default port (8080)
EXPOSE 8080

# Switch to non‑root user
USER appuser

# Entry point
ENTRYPOINT ["/app/talk-api"]