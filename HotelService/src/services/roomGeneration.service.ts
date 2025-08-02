import RoomCategory from "../db/models/roomCategory";
import { RoomGenerationJob } from "../dto/roomGeneration.dto";
import { RoomCategoryRepository } from "../repositories/roomCategory.repository";
import { RoomRepository } from "../repositories/room.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import Room from "../db/models/room";
import { CreationAttributes } from "sequelize";
import logger from "../config/logger.config";

const roomCategoryRepository = new RoomCategoryRepository();
const roomRepository = new RoomRepository();

export async function generateRooms(jobData: RoomGenerationJob ) {

    // Check if the category exists

    let totalRoomsCreated = 0;
    let totalDatesProcessed = 0;


    const roomCategory = await roomCategoryRepository.findById(jobData.roomCategoryId);

    if (!roomCategory) {
        logger.error(`Room category with id ${jobData.roomCategoryId} not found`);
        throw new NotFoundError(`Room category with id ${jobData.roomCategoryId} not found`);
    }

    const startDate = new Date(jobData.startDate);
    const endDate = new Date(jobData.endDate);

    if (startDate >= endDate) {
        logger.error(`Start date must be before end date`);
        throw new BadRequestError(`Start date must be before end date`);
    }

    if (startDate < new Date()) {
        logger.error(`Start date must be in the future`);
        throw new BadRequestError(`Start date must be in the future`);
    }
    

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000*60*60*24));

    logger.info(`Generating rooms for ${totalDays} days`);

    const batchSize = jobData.batchSize || 100; // put it in env variable or a some config

    const currentDate = new Date(startDate);

    while(currentDate < endDate) {
        const batchEndDate = new Date(currentDate);

        batchEndDate.setDate(batchEndDate.getDate() + batchSize);


        if(batchEndDate > endDate ) {
            batchEndDate.setTime(endDate.getTime());
        }

        const batchResult = await processDateBatch(roomCategory, currentDate, batchEndDate, jobData.priceOverride);

        totalRoomsCreated += batchResult.roomsCreated;
        totalDatesProcessed += batchResult.datesProcessed;

        currentDate.setTime(batchEndDate.getTime());

        
    }


    return {
        totalRoomsCreated,
        totalDatesProcessed,
    }


}

export async function processDateBatch(roomCategory: RoomCategory, startDate: Date, endDate: Date, priceOverride?: number) {

    let roomsCreated = 0;
    let datesProcessed = 0;
    const roomsToCreate: CreationAttributes<Room>[] = [];

    const currentDate = new Date(startDate);

    // SELECT * FROM ROOM_CATEGORY WHERE ID = ? AND DATE_OF_AVAILABILITY BETWEEN ? and ? 
    // TODO: Use a better query to get the rooms
    while(currentDate <= endDate) {
        const existingRoom = await roomRepository.findByRoomCategoryIdAndDate(
            roomCategory.id,
            currentDate
        );

        logger.info(`Existing room: ${JSON.stringify(existingRoom)} : ${currentDate}`);

        if(!existingRoom) {
            const roomPayload = {
                hotelId: roomCategory.hotelId,
                roomCategoryId: roomCategory.id,
                dateOfAvailability: new Date(currentDate),
                price: priceOverride || roomCategory.price,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };
            console.log(`Room payload: ${JSON.stringify(roomPayload)}`);
            roomsToCreate.push(roomPayload);
        }

        currentDate.setDate(currentDate.getDate() + 1);
        datesProcessed++;
    }

    console.log(`Rooms to create: ${JSON.stringify(roomsToCreate)}`);

    if(roomsToCreate.length > 0) {
        logger.info(`Creating ${roomsToCreate.length} rooms`);
        await roomRepository.bulkCreate(roomsToCreate);
        roomsCreated += roomsToCreate.length;
    }

    return {
        roomsCreated,
        datesProcessed,
    }
}