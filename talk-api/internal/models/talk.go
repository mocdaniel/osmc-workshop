package models

import "time"

type Talk struct {
	ID           int       `json:"id"`
	Title        string    `json:"title"`
	Abstract     string    `json:"abstract"`
	SpeakerID    int       `json:"speaker_id"`
	IsBookmarked bool      `json:"is_bookmarked"`
	StartTime    time.Time `json:"start_time"`
	EndTime      time.Time `json:"end_time"`
}
