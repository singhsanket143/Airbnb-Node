import { Request, Response } from 'express';
import { RoomGenerationRequestSchema, RoomGenerationJobSchema } from '../dto/roomGeneration.dto';
import { addRoomGenerationJob, getJobStatus, getQueueStats } from '../queues/roomGeneration.queue';
import roomGenerationService from '../services/roomGeneration.service';
import logger from '../config/logger.config';

export class RoomGenerationController {
  /**
   * Generate rooms immediately or schedule for later
   */
  async generateRooms(req: Request, res: Response) {
    try {
      // Validate request body
      const validatedData = RoomGenerationRequestSchema.parse(req.body);
      
      logger.info('Room generation request received', { data: validatedData });

      if (validatedData.scheduleType === 'immediate') {
        // Execute immediately
        const jobData = RoomGenerationJobSchema.parse({
          roomCategoryId: validatedData.roomCategoryId,
          startDate: validatedData.startDate,
          endDate: validatedData.endDate,
          priceOverride: validatedData.priceOverride,
        });

        const result = await roomGenerationService.generateRooms(jobData);
        
        return res.status(200).json({
          success: true,
          message: 'Room generation completed',
          data: result,
        });

      } else {
        // Schedule for later
        if (!validatedData.scheduledAt) {
          return res.status(400).json({
            success: false,
            message: 'Scheduled time is required for scheduled jobs',
          });
        }

        const scheduledTime = new Date(validatedData.scheduledAt);
        const now = new Date();
        const delay = scheduledTime.getTime() - now.getTime();

        if (delay < 0) {
          return res.status(400).json({
            success: false,
            message: 'Scheduled time must be in the future',
          });
        }

        const jobData = RoomGenerationJobSchema.parse({
          roomCategoryId: validatedData.roomCategoryId,
          startDate: validatedData.startDate,
          endDate: validatedData.endDate,
          priceOverride: validatedData.priceOverride,
        });

        const job = await addRoomGenerationJob(jobData, { delay });

        return res.status(202).json({
          success: true,
          message: 'Room generation job scheduled successfully',
          data: {
            jobId: job.id,
            scheduledAt: validatedData.scheduledAt,
            estimatedCompletion: new Date(Date.now() + delay + 300000).toISOString(), // +5 minutes buffer
          },
        });
      }

    } catch (error) {
      logger.error('Error in room generation controller', { error });
      
      if (error instanceof Error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  /**
   * Get job status by job ID
   */
  async getJobStatus(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      
      if (!jobId) {
        return res.status(400).json({
          success: false,
          message: 'Job ID is required',
        });
      }

      const status = await getJobStatus(jobId);
      
      return res.status(200).json({
        success: true,
        data: status,
      });

    } catch (error) {
      logger.error('Error getting job status', { error, jobId: req.params.jobId });
      
      if (error instanceof Error) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(req: Request, res: Response) {
    try {
      const stats = await getQueueStats();
      
      return res.status(200).json({
        success: true,
        data: stats,
      });

    } catch (error) {
      logger.error('Error getting queue stats', { error });
      
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  /**
   * Get room generation statistics for a room category
   */
  async getRoomStats(req: Request, res: Response) {
    try {
      const { roomCategoryId } = req.params;
      const { startDate, endDate } = req.query;

      if (!roomCategoryId) {
        return res.status(400).json({
          success: false,
          message: 'Room category ID is required',
        });
      }

      const categoryId = parseInt(roomCategoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid room category ID',
        });
      }

      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;

      const stats = await roomGenerationService.getRoomGenerationStats(categoryId, start, end);
      
      return res.status(200).json({
        success: true,
        data: {
          roomCategoryId: categoryId,
          dateRange: start && end ? { startDate: start.toISOString(), endDate: end.toISOString() } : null,
          ...stats,
        },
      });

    } catch (error) {
      logger.error('Error getting room stats', { error, params: req.params });
      
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}

export default new RoomGenerationController(); 