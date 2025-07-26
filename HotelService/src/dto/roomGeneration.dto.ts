import { z } from 'zod';

export const RoomGenerationJobSchema = z.object({
  roomCategoryId: z.number().positive(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  priceOverride: z.number().positive().optional(),
  batchSize: z.number().positive().default(100),
});

export const RoomGenerationRequestSchema = z.object({
  roomCategoryId: z.number().positive(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  priceOverride: z.number().positive().optional(),
  scheduleType: z.enum(['immediate', 'scheduled']).default('immediate'),
  scheduledAt: z.string().datetime().optional(),
});

export type RoomGenerationJob = z.infer<typeof RoomGenerationJobSchema>;
export type RoomGenerationRequest = z.infer<typeof RoomGenerationRequestSchema>;

export interface RoomGenerationResult {
  success: boolean;
  totalRoomsCreated: number;
  totalDatesProcessed: number;
  errors: string[];
  jobId: string;
} 