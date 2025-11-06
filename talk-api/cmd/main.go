package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"talk-api/internal/db"
	"talk-api/internal/handler"
	"talk-api/internal/repo"
)

func main() {
	// Initialize DB connection pool
	pool, err := db.InitDB()
	if err != nil {
		log.Fatalf("Failed to initialize DB: %v", err)
	}
	defer db.ClosePool(pool)

	// Create repository
	talkRepo := repo.New(pool)

	// Initialize HTTP handlers with the repository
	h := handler.New(talkRepo)

	// Register routes
	mux := http.NewServeMux()
	mux.HandleFunc("/api/talk/", h.TalkHandler)  // Handles GET /api/talk/{id} and POST /api/talk/{id}
	mux.HandleFunc("/api/talks", h.TalksHandler) // Handles GET /api/talks

	// Wrap with logging middleware
	loggedMux := loggingMiddleware(mux)

	// Determine port (default 8080)
	port := getPort()
	log.Printf("Starting server on %s", port)
	if err := http.ListenAndServe(port, loggedMux); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

// getPort reads the PORT environment variable or defaults to :8080
func getPort() string {
	if p := os.Getenv("PORT"); p != "" {
		return ":" + p
	}
	return ":8080"
}

// loggingMiddleware logs request method, path, status code and duration using the built‑in log package.
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Wrap ResponseWriter to capture status code
		rr := &responseRecorder{ResponseWriter: w, statusCode: http.StatusOK}
		start := time.Now()
		next.ServeHTTP(rr, r)
		duration := time.Now().Sub(start)
		log.Printf("%s %s %d %s", r.Method, r.URL.Path, rr.statusCode, duration)
	})
}

// responseRecorder captures the HTTP status code for logging.
type responseRecorder struct {
	http.ResponseWriter
	statusCode int
}

func (rr *responseRecorder) WriteHeader(code int) {
	rr.statusCode = code
	rr.ResponseWriter.WriteHeader(code)
}
