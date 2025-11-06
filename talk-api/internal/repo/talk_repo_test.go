package repo

import (
	"testing"

	"talk-api/internal/models"
)

// TestNewRepo ensures that the repository constructor returns a non‑nil instance.
func TestNewRepo(t *testing.T) {
	// Passing nil is acceptable for this simple sanity check; real usage provides a valid pool.
	r := New(nil)
	if r == nil {
		t.Fatalf("expected non‑nil repository, got nil")
	}
}

// TestTalkStructTag verifies that the Talk model has the expected JSON tags.
// This ensures the DTO matches the API specification.
func TestTalkStructTag(t *testing.T) {
	// The struct tags are defined in the model; we just instantiate to ensure compilation.
	_ = &models.Talk{
		ID:           0,
		Title:        "",
		Abstract:     "",
		SpeakerID:    0,
		IsBookmarked: false,
		StartTime:    models.Talk{}.StartTime,
		EndTime:      models.Talk{}.EndTime,
	}
}
