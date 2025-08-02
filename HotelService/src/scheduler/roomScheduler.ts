import * as cron from 'node-cron';
import { RoomRepository } from '../repositories/room.repository';
import { RoomCategoryRepository } from '../repositories/roomCategory.repository';
import { addRoomGenerationJobToQueue } from '../producers/roomGeneration.producer';
import { RoomGenerationJob } from '../dto/roomGeneration.dto';
import logger from '../config/logger.config';
import { serverConfig } from '../config';

const roomRepository = new RoomRepository();
const roomCategoryRepository = new RoomCategoryRepository();

let cronJob: cron.ScheduledTask | null = null;

/**
 * Start the room availability extension scheduler
 * Runs every minute to extend room availability by one day
 */
export const startScheduler = (): void => {
    if (cronJob) {
        logger.warn('Room scheduler is already running');
        return;
    }

    // Schedule job to run every minute
    cronJob = cron.schedule(serverConfig.ROOM_CRON, async () => {
        try {
            logger.info('Starting room availability extension check');
            await extendRoomAvailability();
            logger.info('Room availability extension check completed');
        } catch (error) {
            logger.error('Error in room availability extension scheduler:', error);
        }
    }, {
        // scheduled: false,
        timezone: 'UTC'
    });

    cronJob.start();
    logger.info(`Room availability extension scheduler started - running every ${serverConfig.ROOM_CRON}`);
};

/**
 * Stop the room availability extension scheduler
 */
export const stopScheduler = (): void => {
    if (cronJob) {
        cronJob.stop();
        cronJob = null;
        logger.info('Room availability extension scheduler stopped');
    }
};

/**
 * Get scheduler status
 */
export const getSchedulerStatus = (): { isRunning: boolean } => {
    return {
        isRunning: cronJob !== null && cronJob.getStatus() === 'scheduled'
    };
};

/**
 * Extend room availability by one day for all room categories
 */
const extendRoomAvailability = async (): Promise<void> => {
    try {
        // Get all room categories with their latest availability dates
        const roomCategoriesWithLatestDates = await roomRepository.findLatestDatesForAllCategories();
        
        if (roomCategoriesWithLatestDates.length === 0) {
            logger.info('No room categories found with availability dates');
            return;
        }

        logger.info(`Found ${roomCategoriesWithLatestDates.length} room categories to extend`);

        // Process each room category
        for (const categoryData of roomCategoriesWithLatestDates) {
            await extendCategoryAvailability(categoryData);
        }

    } catch (error) {
        logger.error('Error extending room availability:', error);
        throw error;
    }
};

/**
 * Extend availability for a specific room category
 */
const extendCategoryAvailability = async (categoryData: { roomCategoryId: number, latestDate: Date }): Promise<void> => {
    try {
        const { roomCategoryId, latestDate } = categoryData;

        // Calculate the next date (one day after the latest date)
        const nextDate = new Date(latestDate);
        nextDate.setDate(nextDate.getDate() + 1);

        // Check if the room category still exists
        const roomCategory = await roomCategoryRepository.findById(roomCategoryId);
        if (!roomCategory) {
            logger.warn(`Room category ${roomCategoryId} not found, skipping extension`);
            return;
        }

        // Check if room for next date already exists
        const existingRoom = await roomRepository.findByRoomCategoryIdAndDate(roomCategoryId, nextDate);
        if (existingRoom) {
            logger.debug(`Room for category ${roomCategoryId} on ${nextDate.toISOString()} already exists, skipping`);
            return;
        }

        const endDate = new Date(nextDate);
        endDate.setDate(endDate.getDate() + 1);

        // Create job to generate room for the next date
        const jobData: RoomGenerationJob = {
            roomCategoryId: roomCategoryId,
            startDate: nextDate.toISOString(),
            endDate: endDate.toISOString(),
            priceOverride: roomCategory.price,
            batchSize: 1
        };

        // Add job to queue
        await addRoomGenerationJobToQueue(jobData);
        
        logger.info(`Added room generation job for category ${roomCategoryId} on ${nextDate.toISOString()}`);

    } catch (error) {
        logger.error(`Error extending availability for room category ${categoryData.roomCategoryId}:`, error);
        // Don't throw here to avoid stopping the entire scheduler
    }
};

/**
 * Manually trigger room availability extension (for testing or manual execution)
 */
export const manualExtendAvailability = async (): Promise<void> => {
    logger.info('Manual room availability extension triggered');
    await extendRoomAvailability();
}; 