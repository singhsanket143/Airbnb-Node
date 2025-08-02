-- +goose Up
-- +goose StatementBegin
CREATE TABLE reviews (
 id BIGINT AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT NOT NULL,
 booking_id BIGINT NOT NULL,
 hotel_id BIGINT NOT NULL,
 comment TEXT NOT NULL,
 rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 deleted_at TIMESTAMP NULL,
 is_synced BOOLEAN NOT NULL DEFAULT FALSE,
 INDEX idx_user_id (user_id),
 INDEX idx_booking_id (booking_id),
 INDEX idx_hotel_id (hotel_id),
 INDEX idx_created_at (created_at),
 INDEX idx_deleted_at (deleted_at)
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE reviews;
-- +goose StatementEnd 