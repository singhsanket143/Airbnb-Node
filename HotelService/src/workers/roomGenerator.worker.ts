import dotenv from 'dotenv';
import roomGenerationQueue from '../queues/roomGeneration.queue';
import logger from '../config/logger.config';

// Load environment variables
dotenv.config();

// Import database models to ensure they're loaded
import '../db/models/index';

class RoomGenerationWorker {
  private isRunning = false;

  async start() {
    if (this.isRunning) {
      logger.warn('Worker is already running');
      return;
    }

    this.isRunning = true;
    logger.info('Starting room generation worker...');

    try {
      // Connect to the queue
      await roomGenerationQueue.isReady();
      logger.info('Connected to room generation queue');

      // Set up graceful shutdown
      this.setupGracefulShutdown();

      // Keep the worker running
      this.keepAlive();

    } catch (error) {
      logger.error('Failed to start worker', { error });
      process.exit(1);
    }
  }

  private setupGracefulShutdown() {
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);
      this.isRunning = false;

      try {
        // Close the queue
        await roomGenerationQueue.close();
        logger.info('Worker shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown', { error });
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
      logger.debug('Worker is running...');
    }, 30000); // Log every 30 seconds
  }

  async stop() {
    this.isRunning = false;
    await roomGenerationQueue.close();
    logger.info('Worker stopped');
  }
}

// Start the worker if this file is run directly
if (require.main === module) {
  const worker = new RoomGenerationWorker();
  worker.start().catch((error) => {
    logger.error('Failed to start worker', { error });
    process.exit(1);
  });
}

export default RoomGenerationWorker; 