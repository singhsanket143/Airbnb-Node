package services

import (
	db "ReviewService/db/repositories"
	"ReviewService/dto"
	"ReviewService/models"
	"fmt"
	"strconv"
)

type ReviewService interface {
	GetReviewById(id string) (*models.Review, error)
	CreateReview(payload *dto.CreateReviewRequestDTO) (*models.Review, error)
	UpdateReview(id string, payload *dto.UpdateReviewRequestDTO) (*models.Review, error)
	DeleteReview(id string) error
	GetAllReviews() ([]*models.Review, error)
	GetReviewsByUserId(userId string) ([]*models.Review, error)
	GetReviewsByHotelId(hotelId string) ([]*models.Review, error)
	GetReviewsByBookingId(bookingId string) ([]*models.Review, error)
}

type ReviewServiceImpl struct {
	reviewRepository db.ReviewRepository
}

func NewReviewService(_reviewRepository db.ReviewRepository) ReviewService {
	return &ReviewServiceImpl{
		reviewRepository: _reviewRepository,
	}
}

func (r *ReviewServiceImpl) GetReviewById(id string) (*models.Review, error) {
	fmt.Println("Fetching review in ReviewService")

	idInt, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		fmt.Println("Error parsing review ID:", err)
		return nil, fmt.Errorf("invalid review ID")
	}

	review, err := r.reviewRepository.GetByID(idInt)
	if err != nil {
		fmt.Println("Error fetching review:", err)
		return nil, err
	}
	return review, nil
}

func (r *ReviewServiceImpl) CreateReview(payload *dto.CreateReviewRequestDTO) (*models.Review, error) {
	fmt.Println("Creating review in ReviewService")

	// Validate rating range
	if payload.Rating < 1 || payload.Rating > 5 {
		return nil, fmt.Errorf("rating must be between 1 and 5")
	}

	// Call the repository to create the review
	review, err := r.reviewRepository.Create(payload.UserId, payload.BookingId, payload.HotelId, payload.Comment, payload.Rating)
	if err != nil {
		fmt.Println("Error creating review:", err)
		return nil, err
	}

	fmt.Println("Review created successfully:", review)
	return review, nil
}

func (r *ReviewServiceImpl) UpdateReview(id string, payload *dto.UpdateReviewRequestDTO) (*models.Review, error) {
	fmt.Println("Updating review in ReviewService")

	idInt, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		fmt.Println("Error parsing review ID:", err)
		return nil, fmt.Errorf("invalid review ID")
	}

	// Validate rating range
	if payload.Rating < 1 || payload.Rating > 5 {
		return nil, fmt.Errorf("rating must be between 1 and 5")
	}

	// Call the repository to update the review
	review, err := r.reviewRepository.Update(idInt, payload.Comment, payload.Rating)
	if err != nil {
		fmt.Println("Error updating review:", err)
		return nil, err
	}

	fmt.Println("Review updated successfully:", review)
	return review, nil
}

func (r *ReviewServiceImpl) DeleteReview(id string) error {
	fmt.Println("Deleting review in ReviewService")

	idInt, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		fmt.Println("Error parsing review ID:", err)
		return fmt.Errorf("invalid review ID")
	}

	// Call the repository to delete the review
	err = r.reviewRepository.Delete(idInt)
	if err != nil {
		fmt.Println("Error deleting review:", err)
		return err
	}

	fmt.Println("Review deleted successfully")
	return nil
}

func (r *ReviewServiceImpl) GetAllReviews() ([]*models.Review, error) {
	fmt.Println("Fetching all reviews in ReviewService")

	reviews, err := r.reviewRepository.GetAll()
	if err != nil {
		fmt.Println("Error fetching reviews:", err)
		return nil, err
	}
	return reviews, nil
}

func (r *ReviewServiceImpl) GetReviewsByUserId(userId string) ([]*models.Review, error) {
	fmt.Println("Fetching reviews by user ID in ReviewService")

	userIdInt, err := strconv.ParseInt(userId, 10, 64)
	if err != nil {
		fmt.Println("Error parsing user ID:", err)
		return nil, fmt.Errorf("invalid user ID")
	}

	reviews, err := r.reviewRepository.GetByUserId(userIdInt)
	if err != nil {
		fmt.Println("Error fetching reviews by user ID:", err)
		return nil, err
	}
	return reviews, nil
}

func (r *ReviewServiceImpl) GetReviewsByHotelId(hotelId string) ([]*models.Review, error) {
	fmt.Println("Fetching reviews by hotel ID in ReviewService")

	hotelIdInt, err := strconv.ParseInt(hotelId, 10, 64)
	if err != nil {
		fmt.Println("Error parsing hotel ID:", err)
		return nil, fmt.Errorf("invalid hotel ID")
	}

	reviews, err := r.reviewRepository.GetByHotelId(hotelIdInt)
	if err != nil {
		fmt.Println("Error fetching reviews by hotel ID:", err)
		return nil, err
	}
	return reviews, nil
}

func (r *ReviewServiceImpl) GetReviewsByBookingId(bookingId string) ([]*models.Review, error) {
	fmt.Println("Fetching reviews by booking ID in ReviewService")

	bookingIdInt, err := strconv.ParseInt(bookingId, 10, 64)
	if err != nil {
		fmt.Println("Error parsing booking ID:", err)
		return nil, fmt.Errorf("invalid booking ID")
	}

	reviews, err := r.reviewRepository.GetByBookingId(bookingIdInt)
	if err != nil {
		fmt.Println("Error fetching reviews by booking ID:", err)
		return nil, err
	}
	return reviews, nil
}
