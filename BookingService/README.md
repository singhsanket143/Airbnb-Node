# Booking Service

A microservice for handling hotel bookings with room availability, pricing, and date range support.

## Features

- **Room-based Bookings**: Book specific rooms with availability checking
- **Date Range Support**: Support for check-in and check-out dates
- **Dynamic Pricing**: Automatic price calculation based on room type and duration
- **Availability Checking**: Real-time room availability for date ranges
- **Idempotency**: Prevents duplicate bookings with idempotency keys
- **Hotel Service Integration**: Integrates with HotelService for room information

## API Endpoints

### Check Room Availability
```
GET /api/v1/bookings/availability?hotelId=1&checkInDate=2024-01-15&checkOutDate=2024-01-17&roomType=SINGLE&guests=2
```

**Query Parameters:**
- `hotelId` (required): Hotel ID
- `checkInDate` (required): Check-in date (YYYY-MM-DD)
- `checkOutDate` (required): Check-out date (YYYY-MM-DD)
- `roomType` (optional): Room type filter (SINGLE, DOUBLE, FAMILY, DELUXE, SUITE)
- `guests` (optional): Number of guests

**Response:**
```json
{
  "availableRooms": [
    {
      "roomId": 1,
      "hotelId": 1,
      "roomType": "SINGLE",
      "pricePerNight": 100,
      "available": true,
      "availableDates": ["2024-01-15", "2024-01-17"]
    }
  ],
  "totalAvailable": 1
}
```

### Create Booking
```
POST /api/v1/bookings
```

**Request Body:**
```json
{
  "userId": 1,
  "hotelId": 1,
  "roomId": 1,
  "checkInDate": "2024-01-15",
  "checkOutDate": "2024-01-17",
  "totalGuests": 2
}
```

**Response:**
```json
{
  "bookingId": 123,
  "idempotencyKey": "uuid-string",
  "totalAmount": 300,
  "totalNights": 2,
  "pricePerNight": 150
}
```

### Confirm Booking
```
POST /api/v1/bookings/confirm/:idempotencyKey
```

**Response:**
```json
{
  "bookingId": 123,
  "status": "CONFIRMED",
  "totalAmount": 300,
  "totalNights": 2,
  "pricePerNight": 150
}
```

## Database Schema

### Booking Table
- `id`: Primary key
- `userId`: User making the booking
- `hotelId`: Hotel being booked
- `roomId`: Specific room being booked
- `checkInDate`: Check-in date
- `checkOutDate`: Check-out date
- `totalNights`: Number of nights
- `pricePerNight`: Price per night
- `totalAmount`: Total booking amount
- `status`: Booking status (PENDING, CONFIRMED, CANCELLED)
- `totalGuests`: Number of guests

## Environment Variables

```env
PORT=3001
REDIS_SERVER_URL=redis://localhost:6379
LOCK_TTL=5000
HOTEL_SERVICE_URL=http://localhost:3002
DATABASE_URL=mysql://user:password@localhost:3306/airbnb_booking_dev
```

## Integration with HotelService

The BookingService integrates with the HotelService to:
- Get room information and pricing
- Check room availability
- Validate room existence

The integration uses HTTP calls to the HotelService API and falls back to mock data if the service is unavailable.

## Running the Service

```bash
# Install dependencies
npm install

# Run migrations
npx prisma migrate dev

# Start the service
npm run dev
```

## Validation

The service includes comprehensive validation for:
- Date ranges (check-out must be after check-in)
- Future dates only
- Room availability
- Required fields
- Data types and formats