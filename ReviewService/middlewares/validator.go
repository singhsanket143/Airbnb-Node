package middlewares

import (
	"ReviewService/dto"
	"ReviewService/utils"
	"context"
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
)

var validate = validator.New()

func ReviewCreateRequestValidator(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var payload dto.CreateReviewRequestDTO

		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid JSON payload", err)
			return
		}

		if err := validate.Struct(payload); err != nil {
			utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Validation failed", err)
			return
		}

		ctx := context.WithValue(r.Context(), "payload", payload)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func ReviewUpdateRequestValidator(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var payload dto.UpdateReviewRequestDTO

		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid JSON payload", err)
			return
		}

		if err := validate.Struct(payload); err != nil {
			utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Validation failed", err)
			return
		}

		ctx := context.WithValue(r.Context(), "payload", payload)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
