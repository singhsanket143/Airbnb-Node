import { z } from "zod";

export const hotelSchema = z.object({
    name: z.string().min(1, "Hotel name is required"),
    description: z.string().min(1, "Hotel description is required"),
    hostId: z.number().optional(),
    cityId: z.number().optional(),
    stateId: z.number().optional(),
    pincode: z.string().min(1, "Pincode is required"),
    address: z.string().min(1, "Address is required"),
    averageRating: z.number().optional(),
    numberOfRatings: z.number().optional()
});