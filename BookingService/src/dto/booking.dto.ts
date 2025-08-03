export type CreateBookingDTO = {
    userId: number;
    hotelId: number;
    roomId: number;
    checkInDate: string; // ISO date string
    checkOutDate: string; // ISO date string
    totalGuests: number;
}

export type BookingAvailabilityDTO = {
    hotelId: number;
    checkInDate: string;
    checkOutDate: string;
    roomType?: string;
    guests?: number;
}

export type RoomAvailabilityDTO = {
    roomId: number;
    hotelId: number;
    roomType: string;
    pricePerNight: number;
    available: boolean;
    availableDates: string[];
}

export type BookingResponseDTO = {
    bookingId: number;
    idempotencyKey: string;
    totalAmount: number;
    totalNights: number;
    pricePerNight: number;
}