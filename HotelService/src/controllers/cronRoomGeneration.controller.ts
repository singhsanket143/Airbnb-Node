import { Request, Response } from 'express';
import roomGenerationScheduler from '../schedulers/roomGeneration.scheduler';
import cronRoomGenerationService from '../services/cronRoomGeneration.service';
import logger from '../config/logger.config';

export class CronRoomGenerationController {
  /**
   * Start the automatic room generation scheduler
   */
  async startScheduler(req: Request, res: Response) {
    try {
      const { cronExpression, daysAhead } = req.body;

      // Validate cron expression if provided
      if (cronExpression && !this.isValidCronExpression(cronExpression)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid cron expression. Use format: minute hour day month dayOfWeek',
        });
      }

      // Start the scheduler
      roomGenerationScheduler.start(cronExpression);

      return res.status(200).json({
        success: true,
        message: 'Room generation scheduler started successfully',
        data: {
          cronExpression: cronExpression || '0 2 * * *', // Default: daily at 2 AM
          daysAhead: daysAhead || 30,
          status: 'running',
        },
      });

    } catch (error) {
      logger.error('Error starting room generation scheduler', { error });
      
      return res.status(500).json({
        success: false,
        message: 'Failed to start scheduler',
      });
    }
  }

  /**
   * Stop the automatic room generation scheduler
   */
  async stopScheduler(req: Request, res: Response) {
    try {
      roomGenerationScheduler.stop();

      return res.status(200).json({
        success: true,
        message: 'Room generation scheduler stopped successfully',
        data: {
          status: 'stopped',
        },
      });

    } catch (error) {
      logger.error('Error stopping room generation scheduler', { error });
      
      return res.status(500).json({
        success: false,
        message: 'Failed to stop scheduler',
      });
    }
  }

  /**
   * Get scheduler status
   */
  async getSchedulerStatus(req: Request, res: Response) {
    try {
      const status = roomGenerationScheduler.getStatus();

      return res.status(200).json({
        success: true,
        data: status,
      });

    } catch (error) {
      logger.error('Error getting scheduler status', { error });
      
      return res.status(500).json({
        success: false,
        message: 'Failed to get scheduler status',
      });
    }
  }

  /**
   * Execute room generation manually for all categories
   */
  async executeManualGeneration(req: Request, res: Response) {
    try {
      const { daysAhead = 30 } = req.body;

      if (daysAhead < 1 || daysAhead > 365) {
        return res.status(400).json({
          success: false,
          message: 'Days ahead must be between 1 and 365',
        });
      }

      logger.info('Manual room generation requested', { daysAhead });

      // Execute the room generation
      await roomGenerationScheduler.executeRoomGeneration(daysAhead);

      return res.status(200).json({
        success: true,
        message: 'Manual room generation completed successfully',
        data: {
          daysAhead,
          executedAt: new Date().toISOString(),
        },
      });

    } catch (error) {
      logger.error('Error executing manual room generation', { error });
      
      return res.status(500).json({
        success: false,
        message: 'Failed to execute manual room generation',
      });
    }
  }

  /**
   * Execute room generation for a specific category
   */
  async executeCategoryGeneration(req: Request, res: Response) {
    try {
      const { roomCategoryId } = req.params;
      const { daysAhead = 30 } = req.body;

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

      if (daysAhead < 1 || daysAhead > 365) {
        return res.status(400).json({
          success: false,
          message: 'Days ahead must be between 1 and 365',
        });
      }

      logger.info('Manual room generation for category requested', { roomCategoryId: categoryId, daysAhead });

      const result = await cronRoomGenerationService.generateRoomsForCategory(categoryId, daysAhead);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error || 'Failed to generate rooms for category',
        });
      }

      return res.status(200).json({
        success: true,
        message: result.jobCreated 
          ? 'Room generation job created successfully' 
          : 'No room generation needed (sufficient coverage exists)',
        data: {
          roomCategoryId: categoryId,
          daysAhead,
          jobCreated: result.jobCreated,
          executedAt: new Date().toISOString(),
        },
      });

    } catch (error) {
      logger.error('Error executing category room generation', { error, params: req.params });
      
      return res.status(500).json({
        success: false,
        message: 'Failed to execute category room generation',
      });
    }
  }

  /**
   * Get cron generation statistics
   */
  async getCronStats(req: Request, res: Response) {
    try {
      const stats = await cronRoomGenerationService.getCronGenerationStats();

      return res.status(200).json({
        success: true,
        data: {
          ...stats,
          lastUpdated: new Date().toISOString(),
        },
      });

    } catch (error) {
      logger.error('Error getting cron generation stats', { error });
      
      return res.status(500).json({
        success: false,
        message: 'Failed to get cron generation statistics',
      });
    }
  }

  /**
   * Validate cron expression
   */
  private isValidCronExpression(expression: string): boolean {
    // Basic cron expression validation
    const cronRegex = /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/;
    return cronRegex.test(expression);
  }
}

export default new CronRoomGenerationController(); 