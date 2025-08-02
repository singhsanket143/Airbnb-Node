package db

import (
	"ReviewService/models"
	"database/sql"
	"fmt"
)

type ReviewRepository interface {
	GetByID(id int64) (*models.Review, error)
	Create(userId int64, bookingId int64, hotelId int64, comment string, rating int) (*models.Review, error)
	Update(id int64, comment string, rating int) (*models.Review, error)
	Delete(id int64) error
	GetAll() ([]*models.Review, error)
	GetByUserId(userId int64) ([]*models.Review, error)
	GetByHotelId(hotelId int64) ([]*models.Review, error)
	GetByBookingId(bookingId int64) ([]*models.Review, error)
}

type ReviewRepositoryImpl struct {
	db *sql.DB
}

func NewReviewRepository(_db *sql.DB) ReviewRepository {
	return &ReviewRepositoryImpl{
		db: _db,
	}
}

func (r *ReviewRepositoryImpl) GetAll() ([]*models.Review, error) {
	query := "SELECT id, user_id, booking_id, hotel_id, comment, rating, created_at, updated_at, deleted_at, is_synced FROM reviews WHERE deleted_at IS NULL"
	rows, err := r.db.Query(query)
	if err != nil {
		fmt.Println("Error fetching reviews:", err)
		return nil, err
	}
	defer rows.Close()

	var reviews []*models.Review
	for rows.Next() {
		review := &models.Review{}
		if err := rows.Scan(&review.Id, &review.UserId, &review.BookingId, &review.HotelId, &review.Comment, &review.Rating, &review.CreatedAt, &review.UpdatedAt, &review.DeletedAt, &review.IsSynced); err != nil {
			fmt.Println("Error scanning review:", err)
			return nil, err
		}
		reviews = append(reviews, review)
	}

	if err := rows.Err(); err != nil {
		fmt.Println("Error with rows:", err)
		return nil, err
	}

	return reviews, nil
}

func (r *ReviewRepositoryImpl) GetByID(id int64) (*models.Review, error) {
	query := "SELECT id, user_id, booking_id, hotel_id, comment, rating, created_at, updated_at, deleted_at, is_synced FROM reviews WHERE id = ? AND deleted_at IS NULL"
	row := r.db.QueryRow(query, id)

	review := &models.Review{}
	err := row.Scan(&review.Id, &review.UserId, &review.BookingId, &review.HotelId, &review.Comment, &review.Rating, &review.CreatedAt, &review.UpdatedAt, &review.DeletedAt, &review.IsSynced)

	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("No review found with the given ID")
			return nil, err
		} else {
			fmt.Println("Error scanning review:", err)
			return nil, err
		}
	}

	return review, nil
}

func (r *ReviewRepositoryImpl) Create(userId int64, bookingId int64, hotelId int64, comment string, rating int) (*models.Review, error) {
	query := "INSERT INTO reviews (user_id, booking_id, hotel_id, comment, rating) VALUES (?, ?, ?, ?, ?)"
	result, err := r.db.Exec(query, userId, bookingId, hotelId, comment, rating)

	if err != nil {
		fmt.Println("Error creating review:", err)
		return nil, err
	}

	lastInsertID, rowErr := result.LastInsertId()
	if rowErr != nil {
		fmt.Println("Error getting last insert ID:", rowErr)
		return nil, rowErr
	}

	review := &models.Review{
		Id:        lastInsertID,
		UserId:    userId,
		BookingId: bookingId,
		HotelId:   hotelId,
		Comment:   comment,
		Rating:    rating,
		IsSynced:  false,
	}

	fmt.Println("Review created successfully:", review)
	return review, nil
}

func (r *ReviewRepositoryImpl) Update(id int64, comment string, rating int) (*models.Review, error) {
	query := "UPDATE reviews SET comment = ?, rating = ? WHERE id = ? AND deleted_at IS NULL"
	result, err := r.db.Exec(query, comment, rating, id)

	if err != nil {
		fmt.Println("Error updating review:", err)
		return nil, err
	}

	rowsAffected, rowErr := result.RowsAffected()
	if rowErr != nil {
		fmt.Println("Error getting rows affected:", rowErr)
		return nil, rowErr
	}
	if rowsAffected == 0 {
		fmt.Println("No rows were affected, review not found or already deleted")
		return nil, fmt.Errorf("review not found")
	}

	// Fetch the updated review
	return r.GetByID(id)
}

func (r *ReviewRepositoryImpl) Delete(id int64) error {
	query := "UPDATE reviews SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL"
	result, err := r.db.Exec(query, id)

	if err != nil {
		fmt.Println("Error deleting review:", err)
		return err
	}

	rowsAffected, rowErr := result.RowsAffected()
	if rowErr != nil {
		fmt.Println("Error getting rows affected:", rowErr)
		return rowErr
	}
	if rowsAffected == 0 {
		fmt.Println("No rows were affected, review not found or already deleted")
		return fmt.Errorf("review not found")
	}
	fmt.Println("Review deleted successfully, rows affected:", rowsAffected)
	return nil
}

func (r *ReviewRepositoryImpl) GetByUserId(userId int64) ([]*models.Review, error) {
	query := "SELECT id, user_id, booking_id, hotel_id, comment, rating, created_at, updated_at, deleted_at, is_synced FROM reviews WHERE user_id = ? AND deleted_at IS NULL"
	rows, err := r.db.Query(query, userId)
	if err != nil {
		fmt.Println("Error fetching reviews by user ID:", err)
		return nil, err
	}
	defer rows.Close()

	var reviews []*models.Review
	for rows.Next() {
		review := &models.Review{}
		if err := rows.Scan(&review.Id, &review.UserId, &review.BookingId, &review.HotelId, &review.Comment, &review.Rating, &review.CreatedAt, &review.UpdatedAt, &review.DeletedAt, &review.IsSynced); err != nil {
			fmt.Println("Error scanning review:", err)
			return nil, err
		}
		reviews = append(reviews, review)
	}

	if err := rows.Err(); err != nil {
		fmt.Println("Error with rows:", err)
		return nil, err
	}

	return reviews, nil
}

func (r *ReviewRepositoryImpl) GetByHotelId(hotelId int64) ([]*models.Review, error) {
	query := "SELECT id, user_id, booking_id, hotel_id, comment, rating, created_at, updated_at, deleted_at, is_synced FROM reviews WHERE hotel_id = ? AND deleted_at IS NULL"
	rows, err := r.db.Query(query, hotelId)
	if err != nil {
		fmt.Println("Error fetching reviews by hotel ID:", err)
		return nil, err
	}
	defer rows.Close()

	var reviews []*models.Review
	for rows.Next() {
		review := &models.Review{}
		if err := rows.Scan(&review.Id, &review.UserId, &review.BookingId, &review.HotelId, &review.Comment, &review.Rating, &review.CreatedAt, &review.UpdatedAt, &review.DeletedAt, &review.IsSynced); err != nil {
			fmt.Println("Error scanning review:", err)
			return nil, err
		}
		reviews = append(reviews, review)
	}

	if err := rows.Err(); err != nil {
		fmt.Println("Error with rows:", err)
		return nil, err
	}

	return reviews, nil
}

func (r *ReviewRepositoryImpl) GetByBookingId(bookingId int64) ([]*models.Review, error) {
	query := "SELECT id, user_id, booking_id, hotel_id, comment, rating, created_at, updated_at, deleted_at, is_synced FROM reviews WHERE booking_id = ? AND deleted_at IS NULL"
	rows, err := r.db.Query(query, bookingId)
	if err != nil {
		fmt.Println("Error fetching reviews by booking ID:", err)
		return nil, err
	}
	defer rows.Close()

	var reviews []*models.Review
	for rows.Next() {
		review := &models.Review{}
		if err := rows.Scan(&review.Id, &review.UserId, &review.BookingId, &review.HotelId, &review.Comment, &review.Rating, &review.CreatedAt, &review.UpdatedAt, &review.DeletedAt, &review.IsSynced); err != nil {
			fmt.Println("Error scanning review:", err)
			return nil, err
		}
		reviews = append(reviews, review)
	}

	if err := rows.Err(); err != nil {
		fmt.Println("Error with rows:", err)
		return nil, err
	}

	return reviews, nil
}
