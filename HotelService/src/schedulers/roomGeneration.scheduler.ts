import cron from 'node-cron';
import cronRoomGenerationService from '../services/cronRoomGeneration.service';
import logger from '../config/logger.config';

export class RoomGenerationScheduler {
  private cronJob: cron.ScheduledTask | null = null;
  private isRunning = false;

  /**
   * Start the cron scheduler for automatic room generation
   * Runs every day at 2:00 AM by default
   */
  start(cronExpression: string = '0 2 * * *'): void {
    if (this.isRunning) {
      logger.warn('Room generation scheduler is already running');
      return;
    }

    logger.info(`Starting room generation scheduler with cron expression: ${cronExpression}`);

    this.cronJob = cron.schedule(cronExpression, async () => {
      await this.executeRoomGeneration();
    }, {
      scheduled: true,
      timezone: process.env.TZ || 'UTC',
    });

    this.isRunning = true;
    logger.info('Room generation scheduler started successfully');

    // Set up graceful shutdown
    this.setupGracefulShutdown();
  }

  /**
   * Stop the cron scheduler
   */
  stop(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
      this.isRunning = false;
      logger.info('Room generation scheduler stopped');
    }
  }

  /**
   * Execute room generation manually (for testing or immediate execution)
   */
  async executeRoomGeneration(daysAhead: number = 30): Promise<void> {
    if (this.isRunning) {
      logger.info('Executing manual room generation');
    }

    try {
      const startTime = Date.now();
      logger.info(`Starting automatic room generation for next ${daysAhead} days`);

      const result = await cronRoomGenerationService.generateRoomsForAllCategories(daysAhead);

      const executionTime = Date.now() - startTime;
      
      logger.info('Automatic room generation completed', {
        ...result,
        executionTimeMs: executionTime,
        executionTimeSeconds: Math.round(executionTime / 1000),
      });

      // Log summary
      if (result.success) {
        logger.info(`✅ Automatic room generation successful: ${result.totalJobsCreated} jobs created for ${result.totalCategoriesProcessed} categories`);
      } else {
        logger.error(`❌ Automatic room generation failed: ${result.errors.length} errors occurred`);
        result.errors.forEach((error, index) => {
          logger.error(`Error ${index + 1}: ${error}`);
        });
      }

    } catch (error) {
      logger.error('Critical error in automatic room generation', { error });
    }
  }

  /**
   * Get scheduler status
   */
  getStatus(): {
    isRunning: boolean;
    nextRun?: Date;
    lastRun?: Date;
  } {
    if (!this.cronJob) {
      return { isRunning: false };
    }

    return {
      isRunning: this.isRunning,
      // Note: node-cron doesn't provide next run time directly
      // You could implement this by calculating based on the cron expression
    };
  }

  /**
   * Set up graceful shutdown
   */
  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down room generation scheduler...`);
      this.stop();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }
}

// Create singleton instance
const roomGenerationScheduler = new RoomGenerationScheduler();

export default roomGenerationScheduler; 