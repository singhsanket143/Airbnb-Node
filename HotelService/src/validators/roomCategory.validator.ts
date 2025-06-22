import { z } from "zod";
import { RoomType } from "../db/models/roomCategory";

export const roomCategorySchema = z.object({
	hotelId: z.number().int().positive(),
	price: z.number().positive(),
	roomType: z.enum(Object.values(RoomType) as [string, ...string[]]),
	roomCount: z.number().int().positive(),
});
