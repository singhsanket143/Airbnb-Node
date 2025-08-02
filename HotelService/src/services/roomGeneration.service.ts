import RoomCategory from "../db/models/roomCategory";
import { RoomGenerationJobReq } from "../dto/roomGeneration.dto";
import { RoomCategoryRepository } from "../repositories/roomCategory.repository";
import { RoomRepository } from "../repositories/room.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import Room from "../db/models/room";
import { CreationAttributes } from "sequelize";
import logger from "../config/logger.config";
import { getDateStringWithoutTimeStamp } from "../utils/helpers/date.helps";
import { addRoomGenPayloadToJobQueue } from "../producers/roomGeneration.producer";

const roomCategoryRepository = new RoomCategoryRepository();
const roomRepository = new RoomRepository();

export async function generateRooms(jobData: RoomGenerationJobReq) {
	// Check if the category exists

	let totalRoomsCreated = 0;
	let totalDatesProcessed = 0;

	const roomCategory = await roomCategoryRepository.findById(jobData.roomCategoryId);

	if (!roomCategory) {
		throw new NotFoundError(`Room category with id ${jobData.roomCategoryId} not found`);
	}

	if (jobData.roomNo > roomCategory.roomCount) {
		throw new BadRequestError(
			`Room number ${jobData.roomNo} exceeds the maximum room count of ${roomCategory.roomCount} for this category`
		);
	}

	const startDate = new Date(jobData.startDate);
	const endDate = new Date(jobData.endDate);

	if (startDate > endDate) {
		throw new BadRequestError(`Start date must not be after end date`);
	}

	if (startDate < new Date()) {
		throw new BadRequestError(`Start date must be in the future`);
	}

	const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

	logger.info(
		`Generating rooms for ${totalDays} days for room category ${roomCategory.id} for room number ${jobData.roomNo}`
	);

	const batchSize = jobData.batchSize || 100; // put it in env variable or a some config

	const currentDate = new Date(startDate);

	while (currentDate <= endDate) {
		const batchEndDate = new Date(currentDate);

		batchEndDate.setDate(batchEndDate.getDate() + batchSize - 1);

		if (batchEndDate > endDate) {
			batchEndDate.setTime(endDate.getTime());
		}

		logger.info(
			`Processing batch from ${currentDate.toISOString()} to ${batchEndDate.toISOString()}`
		);
		const batchResult = await processDateBatch(
			roomCategory,
			jobData.roomNo,
			new Date(currentDate),
			batchEndDate,
			jobData.priceOverride
		);

		totalRoomsCreated += batchResult.roomsCreated;
		totalDatesProcessed += batchResult.datesProcessed;

		currentDate.setDate(batchEndDate.getDate() + 1);
	}
    
	return {
		totalRoomsCreated,
		totalDatesProcessed,
	};
}

export async function processDateBatch(
	roomCategory: RoomCategory,
	roomNo: number,
	startDate: Date,
	endDate: Date,
	priceOverride?: number
) {
	let roomsCreated = 0;
	let datesProcessed = 0;
	const roomsToCreate: CreationAttributes<Room>[] = [];

	const currentDate = new Date(startDate);

	// SELECT * FROM ROOM_CATEGORY WHERE ID = ? AND DATE_OF_AVAILABILITY BETWEEN ? and ?
	const existingRooms = await roomRepository.findByRoomCategoryIdAndRoomNoAndDateRange(
		roomCategory.id,
		roomNo,
		startDate,
		endDate
	);
	const existingDatesSet = new Set(
		existingRooms.map((room) => getDateStringWithoutTimeStamp(room.dateOfAvailability))
	);

	while (currentDate <= endDate) {
		if (!existingDatesSet.has(getDateStringWithoutTimeStamp(currentDate))) {
			roomsToCreate.push({
				hotelId: roomCategory.hotelId,
				roomCategoryId: roomCategory.id,
				dateOfAvailability: new Date(currentDate), // clone the time
				price: priceOverride || roomCategory.price,
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
				roomNo,
			});
		}

		currentDate.setDate(currentDate.getDate() + 1);
		datesProcessed++;
	}

	if (roomsToCreate.length > 0) {
		await roomRepository.bulkCreate(roomsToCreate);
		roomsCreated += roomsToCreate.length;
	}

	return {
		roomsCreated,
		datesProcessed,
	};
}

export async function createRoomGenerationJob(jobData: RoomGenerationJobReq) {
	try {
		// TODO: Add in Job Table and return the jobId
		addRoomGenPayloadToJobQueue(jobData);
		// TODO: if above does not throw error then commit the first transaction
	} catch (err) {
		// TODO: on failure rollback
		logger.error(`Error creating room generation job: ${err}`);
		throw new BadRequestError(`Error creating room generation job: ${err}`);
	}
}
