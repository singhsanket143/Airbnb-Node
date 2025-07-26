import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import Room from '../db/models/room';
import RoomCategory from '../db/models/roomCategory';
import Hotel from '../db/models/hotel';
import { RoomGenerationJob, RoomGenerationResult } from '../dto/roomGeneration.dto';
import logger from '../config/logger.config';

export class RoomGenerationService {
  /**
   * Generate room records for a given room category and date range
   */
  async generateRooms(jobData: RoomGenerationJob): Promise<RoomGenerationResult> {
    const jobId = uuidv4();
    const errors: string[] = [];
    let totalRoomsCreated = 0;
    let totalDatesProcessed = 0;

    try {
      logger.info(`Starting room generation job ${jobId}`, { jobData });

      // Validate room category exists
      const roomCategory = await RoomCategory.findByPk(jobData.roomCategoryId);
      if (!roomCategory) {
        throw new Error(`Room category with ID ${jobData.roomCategoryId} not found`);
      }

      // Validate date range
      const startDate = new Date(jobData.startDate);
      const endDate = new Date(jobData.endDate);
      
      if (startDate >= endDate) {
        throw new Error('Start date must be before end date');
      }

      if (startDate < new Date()) {
        throw new Error('Start date cannot be in the past');
      }

      // Calculate total dates to process
      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      logger.info(`Processing ${totalDays} days for room category ${roomCategory.id}`);

      // Process dates in batches
      const batchSize = jobData.batchSize || 100;
      const currentDate = new Date(startDate);
      
      while (currentDate < endDate) {
        const batchEndDate = new Date(currentDate);
        batchEndDate.setDate(batchEndDate.getDate() + batchSize);
        
        if (batchEndDate > endDate) {
          batchEndDate.setTime(endDate.getTime());
        }

        const batchResult = await this.processDateBatch(
          roomCategory,
          currentDate,
          batchEndDate,
          jobData.priceOverride
        );

        totalRoomsCreated += batchResult.roomsCreated;
        totalDatesProcessed += batchResult.datesProcessed;
        
        if (batchResult.errors.length > 0) {
          errors.push(...batchResult.errors);
        }

        // Move to next batch
        currentDate.setTime(batchEndDate.getTime());
      }

      const result: RoomGenerationResult = {
        success: errors.length === 0,
        totalRoomsCreated,
        totalDatesProcessed,
        errors,
        jobId,
      };

      logger.info(`Room generation job ${jobId} completed`, result);
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      logger.error(`Room generation job ${jobId} failed`, { error: errorMessage, jobData });
      
      return {
        success: false,
        totalRoomsCreated,
        totalDatesProcessed,
        errors: [errorMessage],
        jobId,
      };
    }
  }

  /**
   * Process a batch of dates for room generation
   */
  private async processDateBatch(
    roomCategory: RoomCategory,
    startDate: Date,
    endDate: Date,
    priceOverride?: number
  ): Promise<{ roomsCreated: number; datesProcessed: number; errors: string[] }> {
    const errors: string[] = [];
    let roomsCreated = 0;
    let datesProcessed = 0;

    try {
      const currentDate = new Date(startDate);
      const roomsToCreate: any[] = [];

      while (currentDate < endDate) {
        // Check if rooms already exist for this date and category
        const existingRoom = await Room.findOne({
          where: {
            roomCategoryId: roomCategory.id,
            dateOfAvailability: currentDate,
            deletedAt: null,
          },
        });

        if (!existingRoom) {
          // Create room record for this date
          roomsToCreate.push({
            hotelId: roomCategory.hotelId,
            roomCategoryId: roomCategory.id,
            dateOfAvailability: new Date(currentDate),
            price: priceOverride || roomCategory.price,
          });
        }

        currentDate.setDate(currentDate.getDate() + 1);
        datesProcessed++;
      }

      // Bulk insert rooms if any to create
      if (roomsToCreate.length > 0) {
        await Room.bulkCreate(roomsToCreate);
        roomsCreated = roomsToCreate.length;
        logger.info(`Created ${roomsCreated} room records for date range`, {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          roomCategoryId: roomCategory.id,
        });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error in batch processing';
      errors.push(errorMessage);
      logger.error('Error processing date batch', { error: errorMessage, startDate, endDate });
    }

    return { roomsCreated, datesProcessed, errors };
  }

  /**
   * Get room generation statistics for a room category
   */
  async getRoomGenerationStats(roomCategoryId: number, startDate?: Date, endDate?: Date) {
    const whereClause: any = {
      roomCategoryId,
      deletedAt: null,
    };

    if (startDate && endDate) {
      whereClause.dateOfAvailability = {
        [Op.between]: [startDate, endDate],
      };
    }

    const totalRooms = await Room.count({ where: whereClause });
    const availableRooms = await Room.count({
      where: {
        ...whereClause,
        bookingId: null,
      },
    });

    return {
      totalRooms,
      availableRooms,
      bookedRooms: totalRooms - availableRooms,
    };
  }
}

export default new RoomGenerationService(); 