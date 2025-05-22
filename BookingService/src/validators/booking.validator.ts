import { z } from 'zod';

export const createBookingSchema = z.object({
    userId: z.number({ message: "User ID must be present" }),
    hotelId: z.number({ message: "Hotel ID must be present" }),
    totalGuests: z.number({ message: "Total guests must be present" }).min(1, { message: "Total guests must be at least 1" }),
    bookingAmount: z.number({ message: "Booking amount must be present" }).min(1, { message: "Booking amount must be greater than 1" }),
})