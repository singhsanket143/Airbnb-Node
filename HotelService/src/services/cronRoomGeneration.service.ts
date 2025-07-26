import { Op } from 'sequelize';
import RoomCategory from '../db/models/roomCategory';
import Room from '../db/models/room';
import { addRoomGenerationJob } from '../queues/roomGeneration.queue';
import { RoomGenerationJob } from '../dto/roomGeneration.dto';
import logger from '../config/logger.config';

export class CronRoomGenerationService {
  /**
   * Generate rooms for all active room categories for the next N days
   * This is designed to be called by a cron job every 24 hours
   */
  async generateRoomsForAllCategories(daysAhead: number = 30): Promise<{
    success: boolean;
    totalCategoriesProcessed: number;
    totalJobsCreated: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let totalCategoriesProcessed = 0;
    let totalJobsCreated = 0;

    try {
      logger.info(`Starting automatic room generation for next ${daysAhead} days`);

      // Get all active room categories
      const roomCategories = await RoomCategory.findAll({
        where: {
          deletedAt: null,
        },
        include: [
          {
            model: require('../db/models/hotel').default,
            as: 'hotel',
            where: {
              deletedAt: null,
            },
          },
        ],
      });

      if (roomCategories.length === 0) {
        logger.warn('No active room categories found for automatic room generation');
        return {
          success: true,
          totalCategoriesProcessed: 0,
          totalJobsCreated: 0,
          errors: [],
        };
      }

      logger.info(`Found ${roomCategories.length} active room categories`);

      // Calculate date range
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0); // Start from beginning of today

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + daysAhead);
      endDate.setHours(23, 59, 59, 999); // End at end of the target day

      // Process each room category
      for (const roomCategory of roomCategories) {
        try {
          const jobCreated = await this.processRoomCategory(
            roomCategory,
            startDate,
            endDate
          );

          if (jobCreated) {
            totalJobsCreated++;
          }
          totalCategoriesProcessed++;

        } catch (error) {
          const errorMessage = `Failed to process room category ${roomCategory.id}: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`;
          errors.push(errorMessage);
          logger.error(errorMessage, { roomCategoryId: roomCategory.id, error });
        }
      }

      const result = {
        success: errors.length === 0,
        totalCategoriesProcessed,
        totalJobsCreated,
        errors,
      };

      logger.info('Automatic room generation completed', result);
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      logger.error('Automatic room generation failed', { error: errorMessage });
      
      return {
        success: false,
        totalCategoriesProcessed,
        totalJobsCreated,
        errors: [errorMessage],
      };
    }
  }

  /**
   * Process a single room category for automatic room generation
   */
  private async processRoomCategory(
    roomCategory: RoomCategory,
    startDate: Date,
    endDate: Date
  ): Promise<boolean> {
    try {
      // Check if rooms already exist for this date range
      const existingRoomsCount = await Room.count({
        where: {
          roomCategoryId: roomCategory.id,
          dateOfAvailability: {
            [Op.between]: [startDate, endDate],
          },
          deletedAt: null,
        },
      });

      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // If we already have rooms for most of the date range, skip this category
      const coveragePercentage = (existingRoomsCount / totalDays) * 100;
      
      if (coveragePercentage >= 80) {
        logger.info(`Room category ${roomCategory.id} already has ${coveragePercentage.toFixed(1)}% coverage, skipping`);
        return false;
      }

      // Create job for room generation
      const jobData: RoomGenerationJob = {
        roomCategoryId: roomCategory.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        priceOverride: undefined, // Use default price from room category
        batchSize: 100,
      };

      await addRoomGenerationJob(jobData, {
        priority: 1, // High priority for automatic jobs
      });

      logger.info(`Created room generation job for category ${roomCategory.id}`, {
        roomCategoryId: roomCategory.id,
        hotelId: roomCategory.hotelId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        existingRooms: existingRoomsCount,
        totalDays,
        coveragePercentage: coveragePercentage.toFixed(1),
      });

      return true;

    } catch (error) {
      logger.error(`Error processing room category ${roomCategory.id}`, { error });
      throw error;
    }
  }

  /**
   * Generate rooms for a specific room category (manual trigger)
   */
  async generateRoomsForCategory(
    roomCategoryId: number,
    daysAhead: number = 30
  ): Promise<{
    success: boolean;
    jobCreated: boolean;
    error?: string;
  }> {
    try {
      const roomCategory = await RoomCategory.findByPk(roomCategoryId, {
        include: [
          {
            model: require('../db/models/hotel').default,
            as: 'hotel',
            where: {
              deletedAt: null,
            },
          },
        ],
      });

      if (!roomCategory) {
        return {
          success: false,
          jobCreated: false,
          error: `Room category ${roomCategoryId} not found`,
        };
      }

      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + daysAhead);
      endDate.setHours(23, 59, 59, 999);

      const jobCreated = await this.processRoomCategory(roomCategory, startDate, endDate);

      return {
        success: true,
        jobCreated,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      logger.error(`Error generating rooms for category ${roomCategoryId}`, { error: errorMessage });
      
      return {
        success: false,
        jobCreated: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get statistics about automatic room generation
   */
  async getCronGenerationStats(): Promise<{
    totalCategories: number;
    categoriesWithJobs: number;
    averageRoomCoverage: number;
    lastRunTime?: Date;
  }> {
    try {
      const totalCategories = await RoomCategory.count({
        where: {
          deletedAt: null,
        },
        include: [
          {
            model: require('../db/models/hotel').default,
            as: 'hotel',
            where: {
              deletedAt: null,
            },
          },
        ],
      });

      // Calculate average room coverage for next 30 days
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      endDate.setHours(23, 59, 59, 999);

      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      const roomCategories = await RoomCategory.findAll({
        where: {
          deletedAt: null,
        },
        include: [
          {
            model: require('../db/models/hotel').default,
            as: 'hotel',
            where: {
              deletedAt: null,
            },
          },
        ],
      });

      let totalCoverage = 0;
      let categoriesWithRooms = 0;

      for (const category of roomCategories) {
        const existingRooms = await Room.count({
          where: {
            roomCategoryId: category.id,
            dateOfAvailability: {
              [Op.between]: [startDate, endDate],
            },
            deletedAt: null,
          },
        });

        const coverage = (existingRooms / totalDays) * 100;
        totalCoverage += coverage;
        
        if (existingRooms > 0) {
          categoriesWithRooms++;
        }
      }

      const averageCoverage = roomCategories.length > 0 ? totalCoverage / roomCategories.length : 0;

      return {
        totalCategories,
        categoriesWithJobs: categoriesWithRooms,
        averageRoomCoverage: Math.round(averageCoverage * 100) / 100,
      };

    } catch (error) {
      logger.error('Error getting cron generation stats', { error });
      throw error;
    }
  }
}

export default new CronRoomGenerationService(); 