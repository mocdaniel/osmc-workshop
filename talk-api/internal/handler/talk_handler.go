package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"

	"talk-api/internal/repo"
)

// Handler groups dependencies for HTTP handlers.
type Handler struct {
	repo repo.TalkRepository
}

// New creates a new Handler with the provided repository.
func New(r repo.TalkRepository) *Handler {
	return &Handler{repo: r}
}

// TalkHandler handles GET /api/talk/{id} and POST /api/talk/{id}
func (h *Handler) TalkHandler(w http.ResponseWriter, r *http.Request) {
	// Extract ID from URL path.
	idStr := strings.TrimPrefix(r.URL.Path, "/api/talk/")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid talk id"})
		return
	}

	switch r.Method {
	case http.MethodGet:
		h.handleGetTalk(w, r, id)
	case http.MethodPost:
		h.handleToggleBookmark(w, r, id)
	default:
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"error": "method not allowed"})
	}
}

// TalksHandler handles GET /api/talks (list all talks)
func (h *Handler) TalksHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"error": "method not allowed"})
		return
	}
	h.handleGetAllTalks(w, r)
}

// handleGetTalk retrieves a single talk and writes JSON.
func (h *Handler) handleGetTalk(w http.ResponseWriter, r *http.Request, id int) {
	ctx := r.Context()
	talk, err := h.repo.GetTalkByID(ctx, id)
	if err != nil {
		log.Printf("handler GetTalk error: %v", err)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "talk not found"})
		return
	}
	h.writeJSON(w, talk)
}

// handleGetAllTalks retrieves all talks and writes JSON.
func (h *Handler) handleGetAllTalks(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	talks, err := h.repo.GetAllTalks(ctx)
	if err != nil {
		log.Printf("handler GetAllTalks error: %v", err)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "failed to fetch talks"})
		return
	}
	h.writeJSON(w, talks)
}

// handleToggleBookmark toggles the bookmark flag for a talk.
func (h *Handler) handleToggleBookmark(w http.ResponseWriter, r *http.Request, id int) {
	ctx := r.Context()
	if err := h.repo.ToggleBookmark(ctx, id); err != nil {
		log.Printf("handler ToggleBookmark error: %v", err)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "failed to toggle bookmark"})
		return
	}
	// Return the updated talk after toggling.
	updated, err := h.repo.GetTalkByID(ctx, id)
	if err != nil {
		log.Printf("handler after toggle GetTalk error: %v", err)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "talk not found after update"})
		return
	}
	h.writeJSON(w, updated)
}

// writeJSON writes the given data as JSON with proper headers.
func (h *Handler) writeJSON(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	enc := json.NewEncoder(w)
	if err := enc.Encode(data); err != nil {
		log.Printf("JSON encode error: %v", err)
		http.Error(w, "failed to encode response", http.StatusInternalServerError)
	}
}
