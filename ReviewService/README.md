# Review Service

A Go-based microservice for managing hotel reviews in the Airbnb system.

## Features

- CRUD operations for reviews
- Filter reviews by user, hotel, or booking
- Soft delete functionality
- Input validation
- RESTful API endpoints

## Database Schema

The service uses MySQL database `airbnb_reviews` with the following table structure:

```sql
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
 is_synced BOOLEAN NOT NULL DEFAULT FALSE
);
```

## API Endpoints

### CRUD Operations
- `POST /reviews` - Create a new review
- `GET /reviews` - Get all reviews
- `GET /reviews/{id}` - Get review by ID
- `PUT /reviews/{id}` - Update a review
- `DELETE /reviews/{id}` - Delete a review (soft delete)

### Filter Operations
- `GET /reviews/user?user_id={id}` - Get reviews by user ID
- `GET /reviews/hotel?hotel_id={id}` - Get reviews by hotel ID
- `GET /reviews/booking?booking_id={id}` - Get reviews by booking ID

## Setup

1. **Install dependencies:**
   ```bash
   make deps
   ```

2. **Set up environment variables:**
   Create a `.env` file with:
   ```
   DB_USER=root
   DB_PASSWORD=root
   DB_NET=tcp
   DB_ADDR=127.0.0.1:3306
   DBName=airbnb_reviews
   PORT=:8081
   ```

3. **Run database migrations:**
   ```bash
   make migrate-up
   ```

4. **Run the service:**
   ```bash
   make run
   ```

## Example Usage

### Create a Review
```bash
curl -X POST http://localhost:8081/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "booking_id": 123,
    "hotel_id": 456,
    "comment": "Great hotel with excellent service!",
    "rating": 5
  }'
```

### Get All Reviews
```bash
curl http://localhost:8081/reviews
```

### Get Reviews by Hotel
```bash
curl "http://localhost:8081/reviews/hotel?hotel_id=456"
```

## Architecture

The service follows a clean architecture pattern:
- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic layer
- **Repositories**: Data access layer
- **Models**: Data structures
- **DTOs**: Data transfer objects for API requests/responses
- **Middlewares**: Request validation and processing
- **Router**: URL routing and middleware chaining

## Dependencies

- Go 1.24.1+
- MySQL 8.0+
- Chi router for HTTP routing
- Goose for database migrations
- Validator for input validation 