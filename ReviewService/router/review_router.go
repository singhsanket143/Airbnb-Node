package router

import (
	"ReviewService/controllers"
	"ReviewService/middlewares"

	"github.com/go-chi/chi/v5"
)

type ReviewRouter struct {
	reviewController *controllers.ReviewController
}

func NewReviewRouter(_reviewController *controllers.ReviewController) Router {
	return &ReviewRouter{
		reviewController: _reviewController,
	}
}

func (rr *ReviewRouter) Register(r chi.Router) {
	// CRUD operations
	r.With(middlewares.ReviewCreateRequestValidator).Post("/reviews", rr.reviewController.CreateReview)
	r.Get("/reviews", rr.reviewController.GetAllReviews)
	r.Get("/reviews/{id}", rr.reviewController.GetReviewById)
	r.With(middlewares.ReviewUpdateRequestValidator).Put("/reviews/{id}", rr.reviewController.UpdateReview)
	r.Delete("/reviews/{id}", rr.reviewController.DeleteReview)

	// Filter operations
	r.Get("/reviews/user", rr.reviewController.GetReviewsByUserId)
	r.Get("/reviews/hotel", rr.reviewController.GetReviewsByHotelId)
	r.Get("/reviews/booking", rr.reviewController.GetReviewsByBookingId)
}
