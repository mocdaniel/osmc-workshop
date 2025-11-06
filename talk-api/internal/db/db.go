package db

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// InitDB creates a new PostgreSQL connection pool.
// It reads the connection string from the environment variable DATABASE_URL.
// Example: postgres://user:password@localhost:5432/talkdb?sslmode=disable
func InitDB() (*pgxpool.Pool, error) {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		log.Println("DATABASE_URL not set, using default local connection")
		connStr = "postgres://postgres:postgres@localhost:5432/talkdb?sslmode=disable"
	}

	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		return nil, err
	}
	// Set reasonable pool settings
	config.MaxConns = 10
	config.MinConns = 2
	config.MaxConnLifetime = time.Hour

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		return nil, err
	}

	// Verify connection
	if err = pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, err
	}
	log.Println("PostgreSQL connection pool established")
	return pool, nil
}

// ClosePool gracefully shuts down the connection pool.
func ClosePool(pool *pgxpool.Pool) {
	if pool != nil {
		pool.Close()
		log.Println("PostgreSQL connection pool closed")
	}
}
