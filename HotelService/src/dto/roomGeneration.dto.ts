import { z } from "zod";

export const RoomGenerationRequestSchema = z.object({
	roomCategoryId: z.number().positive(),
	startDate: z.string().datetime(),
	endDate: z.string().datetime(),
	scheduleType: z.enum(["immediate", "scheduled"]).default("immediate"),
	scheduledAt: z.string().datetime().optional(),
	priceOverride: z.number().positive().optional(),
});

export const RoomGenerationJobReqSchema = z.object({
	roomCategoryId: z.number().positive(),
	startDate: z.string().date(), // to make sure no timestamp
	endDate: z.string().date(), // to make sure no timestamp
	priceOverride: z.number().positive().optional(),
	batchSize: z.number().positive().default(100),
	roomNo: z.number().positive(),
});

export type RoomGenerationJobReq = z.infer<typeof RoomGenerationJobReqSchema>;
export type RoomGenerationRequest = z.infer<typeof RoomGenerationRequestSchema>;

export interface RoomGenerationResponse {
	success: boolean;
	totalRoomsCreated: number;
	totalDatesProcessed: number;
	errors: string[];
	jobId?: string;
}
