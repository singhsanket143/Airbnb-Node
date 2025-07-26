import dotenv from 'dotenv';
import roomGenerationScheduler from '../schedulers/roomGeneration.scheduler';
import logger from '../config/logger.config';

// Load environment variables
dotenv.config();

// Import database models to ensure they're loaded
import '../db/models/index';

class CronRoomGenerationWorker {
  private isRunning = false;

  async start() {
    if (this.isRunning) {
      logger.warn('Cron worker is already running');
      return;
    }

    this.isRunning = true;
    logger.info('Starting cron room generation worker...');

    try {
      // Get cron expression from environment or use default
      const cronExpression = process.env.ROOM_GENERATION_CRON || '0 2 * * *'; // Default: daily at 2 AM
      const daysAhead = parseInt(process.env.ROOM_GENERATION_DAYS_AHEAD || '30');

      logger.info(`Cron configuration: ${cronExpression} (${daysAhead} days ahead)`);

      // Start the scheduler
      roomGenerationScheduler.start(cronExpression);

      // Set up graceful shutdown
      this.setupGracefulShutdown();

      // Keep the worker running
      this.keepAlive();

    } catch (error) {
      logger.error('Failed to start cron worker', { error });
      process.exit(1);
    }
  }

  private setupGracefulShutdown() {
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down cron worker gracefully...`);
      this.isRunning = false;

      try {
        // Stop the scheduler
        roomGenerationScheduler.stop();
        logger.info('Cron worker shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during cron worker shutdown', { error });
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }

  private keepAlive() {
    const interval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(interval);
        return;
      }

      // Log worker status periodically
      const status = roomGenerationScheduler.getStatus();
      logger.debug('Cron worker is running', { status });
    }, 60000); // Log every minute
  }

  async stop() {
    this.isRunning = false;
    roomGenerationScheduler.stop();
    logger.info('Cron worker stopped');
  }
}

// Start the worker if this file is run directly
if (require.main === module) {
  const worker = new CronRoomGenerationWorker();
  worker.start().catch((error) => {
    logger.error('Failed to start cron worker', { error });
    process.exit(1);
  });
}

export default CronRoomGenerationWorker; 