package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"talk-api/internal/models"
)

// mockRepo implements TalkRepository for testing handlers.
type mockRepo struct {
	talk *models.Talk
}

func (m *mockRepo) GetTalkByID(_ context.Context, id int) (*models.Talk, error) {
	if m.talk != nil && m.talk.ID == id {
		return m.talk, nil
	}
	return nil, nil
}
func (m *mockRepo) GetAllTalks(_ context.Context) ([]*models.Talk, error) {
	if m.talk != nil {
		return []*models.Talk{m.talk}, nil
	}
	return []*models.Talk{}, nil
}
func (m *mockRepo) ToggleBookmark(_ context.Context, id int) error {
	if m.talk != nil && m.talk.ID == id {
		m.talk.IsBookmarked = !m.talk.IsBookmarked
	}
	return nil
}

func TestTalkHandler_GetTalk(t *testing.T) {
	// Prepare a sample talk
	sample := &models.Talk{
		ID:           1,
		Title:        "Sample Talk",
		Abstract:     "Sample abstract",
		SpeakerID:    2,
		IsBookmarked: false,
		StartTime:    time.Now(),
		EndTime:      time.Now().Add(30 * time.Minute),
	}
	h := New(&mockRepo{talk: sample})

	req := httptest.NewRequest(http.MethodGet, "/api/talk/1", nil)
	rr := httptest.NewRecorder()
	h.TalkHandler(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Fatalf("expected status %d, got %d", http.StatusOK, status)
	}
	var got models.Talk
	if err := json.NewDecoder(rr.Body).Decode(&got); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}
	if got.ID != sample.ID || got.Title != sample.Title {
		t.Errorf("unexpected talk returned: %+v", got)
	}
}

func TestTalksHandler_GetAll(t *testing.T) {
	sample := &models.Talk{
		ID:           1,
		Title:        "Sample Talk",
		Abstract:     "Sample abstract",
		SpeakerID:    2,
		IsBookmarked: false,
		StartTime:    time.Now(),
		EndTime:      time.Now().Add(30 * time.Minute),
	}
	h := New(&mockRepo{talk: sample})

	req := httptest.NewRequest(http.MethodGet, "/api/talks", nil)
	rr := httptest.NewRecorder()
	h.TalksHandler(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Fatalf("expected status %d, got %d", http.StatusOK, status)
	}
	var talks []models.Talk
	if err := json.NewDecoder(rr.Body).Decode(&talks); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}
	if len(talks) != 1 || talks[0].ID != sample.ID {
		t.Errorf("unexpected talks slice: %+v", talks)
	}
}
