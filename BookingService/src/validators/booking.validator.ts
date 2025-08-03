import { z } from 'zod';

const baseBookingSchema = z.object({
    userId: z.number({ message: "User ID must be present" }),
    hotelId: z.number({ message: "Hotel ID must be present" }),
    roomId: z.number({ message: "Room ID must be present" }),
    checkInDate: z.string({ message: "Check-in date must be present" }),
    checkOutDate: z.string({ message: "Check-out date must be present" }),
    totalGuests: z.number({ message: "Total guests must be present" }).min(1, { message: "Total guests must be at least 1" }),
});

export const createBookingSchema = baseBookingSchema.superRefine((data, ctx) => {
    // Validate check-in date is in the future
    const checkIn = new Date(data.checkInDate);
    if (isNaN(checkIn.getTime()) || checkIn <= new Date()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Check-in date must be a valid future date",
            path: ["checkInDate"]
        });
    }

    // Validate check-out date is valid
    const checkOut = new Date(data.checkOutDate);
    if (isNaN(checkOut.getTime())) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Check-out date must be a valid date",
            path: ["checkOutDate"]
        });
    }

    // Validate check-out is after check-in
    if (checkOut <= checkIn) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Check-out date must be after check-in date",
            path: ["checkOutDate"]
        });
    }
});

export const availabilityQuerySchema = z.object({
    hotelId: z.string().transform((val) => parseInt(val)),
    checkInDate: z.string(),
    checkOutDate: z.string(),
    roomType: z.string().optional(),
    guests: z.string().optional().transform((val) => val ? parseInt(val) : undefined),
});