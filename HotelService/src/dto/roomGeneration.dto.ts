import { z } from "zod";

// TODO: Extend the controller to take request schema and decide whether it wants a sync or async flow
export const RoomGenerationRequestSchema = z.object({
    roomCategoryId: z.number().positive(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    scheduleType: z.enum(['immediate', 'scheduled']).default('immediate'),
    scheduledAt: z.string().datetime().optional(),
    priceOverride: z.number().positive().optional(),
});

export const RoomGenerationJobSchema = z.object({
    roomCategoryId: z.number().positive(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    priceOverride: z.number().positive().optional(),
    batchSize: z.number().positive().default(100),
});

export type RoomGenerationJob = z.infer<typeof RoomGenerationJobSchema>;
export type RoomGenerationRequest = z.infer<typeof RoomGenerationRequestSchema>;

export interface RoomGenerationResponse {
    success: boolean;
    totalRoomsCreated: number;
    totalDatesProcessed: number;
    errors: string[];
    jobId: string;
}