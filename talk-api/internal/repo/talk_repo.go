package repo

import (
	"context"
	"log"

	"talk-api/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

// TalkRepository defines the methods for talk data access.
type TalkRepository interface {
	GetTalkByID(ctx context.Context, id int) (*models.Talk, error)
	GetAllTalks(ctx context.Context) ([]*models.Talk, error)
	ToggleBookmark(ctx context.Context, id int) error
}

// talkRepo implements TalkRepository using a pgx connection pool.
type talkRepo struct {
	db *pgxpool.Pool
}

// New creates a new TalkRepository.
func New(db *pgxpool.Pool) TalkRepository {
	return &talkRepo{db: db}
}

// GetTalkByID retrieves a single talk by its ID.
func (r *talkRepo) GetTalkByID(ctx context.Context, id int) (*models.Talk, error) {
	const query = `SELECT id, title, abstract, speaker_id, is_bookmarked, start_time, end_time FROM talks WHERE id = $1`
	log.Printf("DB: GetTalkByID start id=%d", id)
	row := r.db.QueryRow(ctx, query, id)

	var t models.Talk
	err := row.Scan(&t.ID, &t.Title, &t.Abstract, &t.SpeakerID, &t.IsBookmarked, &t.StartTime, &t.EndTime)
	if err != nil {
		log.Printf("DB: GetTalkByID error id=%d err=%v", id, err)
		return nil, err
	}
	log.Printf("DB: GetTalkByID success id=%d", id)
	return &t, nil
}

// GetAllTalks retrieves all talks.
func (r *talkRepo) GetAllTalks(ctx context.Context) ([]*models.Talk, error) {
	const query = `SELECT id, title, abstract, speaker_id, is_bookmarked, start_time, end_time FROM talks`
	log.Println("DB: GetAllTalks start")
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		log.Printf("DB: GetAllTalks error %v", err)
		return nil, err
	}
	defer rows.Close()

	var talks []*models.Talk
	for rows.Next() {
		var t models.Talk
		if err := rows.Scan(&t.ID, &t.Title, &t.Abstract, &t.SpeakerID, &t.IsBookmarked, &t.StartTime, &t.EndTime); err != nil {
			log.Printf("DB: GetAllTalks row scan error %v", err)
			return nil, err
		}
		talks = append(talks, &t)
	}
	if rows.Err() != nil {
		log.Printf("DB: GetAllTalks rows error %v", rows.Err())
		return nil, rows.Err()
	}
	log.Printf("DB: GetAllTalks success count=%d", len(talks))
	return talks, nil
}

// ToggleBookmark flips the is_bookmarked flag for a talk.
func (r *talkRepo) ToggleBookmark(ctx context.Context, id int) error {
	const query = `UPDATE talks SET is_bookmarked = NOT is_bookmarked WHERE id = $1`
	log.Printf("DB: ToggleBookmark start id=%d", id)
	_, err := r.db.Exec(ctx, query, id)
	if err != nil {
		log.Printf("DB: ToggleBookmark error id=%d err=%v", id, err)
		return err
	}
	log.Printf("DB: ToggleBookmark success id=%d", id)
	return nil
}
