package controllers

import (
	"ReviewService/dto"
	"ReviewService/services"
	"ReviewService/utils"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type ReviewController struct {
	ReviewService services.ReviewService
}

func NewReviewController(_reviewService services.ReviewService) *ReviewController {
	return &ReviewController{
		ReviewService: _reviewService,
	}
}

func (rc *ReviewController) GetReviewById(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Fetching review by ID in ReviewController")

	reviewId := chi.URLParam(r, "id")
	if reviewId == "" {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Review ID is required", fmt.Errorf("missing review ID"))
		return
	}

	review, err := rc.ReviewService.GetReviewById(reviewId)
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to fetch review", err)
		return
	}
	if review == nil {
		utils.WriteJsonErrorResponse(w, http.StatusNotFound, "Review not found", fmt.Errorf("review with ID %s not found", reviewId))
		return
	}
	utils.WriteJsonSuccessResponse(w, http.StatusOK, "Review fetched successfully", review)
	fmt.Println("Review fetched successfully:", review)
}

func (rc *ReviewController) CreateReview(w http.ResponseWriter, r *http.Request) {
	payload := r.Context().Value("payload").(dto.CreateReviewRequestDTO)

	fmt.Println("Payload received:", payload)

	review, err := rc.ReviewService.CreateReview(&payload)

	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to create review", err)
		return
	}

	utils.WriteJsonSuccessResponse(w, http.StatusCreated, "Review created successfully", review)
	fmt.Println("Review created successfully:", review)
}

func (rc *ReviewController) UpdateReview(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Updating review in ReviewController")

	reviewId := chi.URLParam(r, "id")
	if reviewId == "" {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Review ID is required", fmt.Errorf("missing review ID"))
		return
	}

	payload := r.Context().Value("payload").(dto.UpdateReviewRequestDTO)

	fmt.Println("Payload received:", payload)

	review, err := rc.ReviewService.UpdateReview(reviewId, &payload)

	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to update review", err)
		return
	}

	utils.WriteJsonSuccessResponse(w, http.StatusOK, "Review updated successfully", review)
	fmt.Println("Review updated successfully:", review)
}

func (rc *ReviewController) DeleteReview(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Deleting review in ReviewController")

	reviewId := chi.URLParam(r, "id")
	if reviewId == "" {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Review ID is required", fmt.Errorf("missing review ID"))
		return
	}

	err := rc.ReviewService.DeleteReview(reviewId)

	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to delete review", err)
		return
	}

	utils.WriteJsonSuccessResponse(w, http.StatusOK, "Review deleted successfully", nil)
	fmt.Println("Review deleted successfully")
}

func (rc *ReviewController) GetAllReviews(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Fetching all reviews in ReviewController")

	reviews, err := rc.ReviewService.GetAllReviews()
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to fetch reviews", err)
		return
	}

	utils.WriteJsonSuccessResponse(w, http.StatusOK, "Reviews fetched successfully", reviews)
	fmt.Println("Reviews fetched successfully, count:", len(reviews))
}

func (rc *ReviewController) GetReviewsByUserId(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Fetching reviews by user ID in ReviewController")

	userId := r.URL.Query().Get("user_id")
	if userId == "" {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "User ID is required", fmt.Errorf("missing user ID"))
		return
	}

	reviews, err := rc.ReviewService.GetReviewsByUserId(userId)
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to fetch reviews by user ID", err)
		return
	}

	utils.WriteJsonSuccessResponse(w, http.StatusOK, "Reviews fetched successfully", reviews)
	fmt.Println("Reviews fetched successfully for user ID:", userId, "count:", len(reviews))
}

func (rc *ReviewController) GetReviewsByHotelId(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Fetching reviews by hotel ID in ReviewController")

	hotelId := r.URL.Query().Get("hotel_id")
	if hotelId == "" {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Hotel ID is required", fmt.Errorf("missing hotel ID"))
		return
	}

	reviews, err := rc.ReviewService.GetReviewsByHotelId(hotelId)
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to fetch reviews by hotel ID", err)
		return
	}

	utils.WriteJsonSuccessResponse(w, http.StatusOK, "Reviews fetched successfully", reviews)
	fmt.Println("Reviews fetched successfully for hotel ID:", hotelId, "count:", len(reviews))
}

func (rc *ReviewController) GetReviewsByBookingId(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Fetching reviews by booking ID in ReviewController")

	bookingId := r.URL.Query().Get("booking_id")
	if bookingId == "" {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Booking ID is required", fmt.Errorf("missing booking ID"))
		return
	}

	reviews, err := rc.ReviewService.GetReviewsByBookingId(bookingId)
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to fetch reviews by booking ID", err)
		return
	}

	utils.WriteJsonSuccessResponse(w, http.StatusOK, "Reviews fetched successfully", reviews)
	fmt.Println("Reviews fetched successfully for booking ID:", bookingId, "count:", len(reviews))
}
