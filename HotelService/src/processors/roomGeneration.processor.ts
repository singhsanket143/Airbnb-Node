import { Worker } from "bullmq";
import logger from "../config/logger.config";
import { RoomGenerationJobReq } from "../dto/roomGeneration.dto";
import { ROOM_GEN_JOB_QUEUE_NAME } from "../queues/roomGenerationJob.queue";
import { ROOM_GENERATION_PAYLOAD_NAME } from "../producers/roomGeneration.producer";
import { getRedisConnObject } from "../config/redis.config";
import { generateRooms } from "../services/roomGeneration.service";

export const setupMailerWorker = () => {
	const roomGenerationProcessor = new Worker<RoomGenerationJobReq>(
		ROOM_GEN_JOB_QUEUE_NAME, // Name of the queue
		async (job) => {
			if (job.name !== ROOM_GENERATION_PAYLOAD_NAME) {
				throw new Error(`Invalid job payload name: ${job.name}`);
			}
			// call the service layer from here.
			const payload = job.data;
			logger.info(
				`Processing job with ID: ${job.id} and payload: ${JSON.stringify(payload)}`
			);
			try {
				const response = await generateRooms(payload);
				if (response.totalRoomsCreated > 0) {
					logger.info(`${response.totalRoomsCreated} rooms created`);
				} else {
					logger.warn(`No rooms created for the given parameters`);
				}
			} catch (error) {
				logger.error(
					`Error processing job with ID: ${job.id} : ${(error as Error).message}`,
					(error as Error).stack || error
				);
				throw error; // Re-throw the error to mark the job as failed
			}
			logger.info(`Job with ID: ${job.id} processed successfully`);
		}, // Process function
		{
			connection: getRedisConnObject(),
		}
	);

	roomGenerationProcessor.on("failed", (job) => {
		console.error("Room Gen Job pocessing failed");
		//TODO: Set Job Status to failed in DB
	});

	roomGenerationProcessor.on("completed", () => {
		console.log("Room Gen Job processing completed successfully");
		//TODO: Set Job Status to success in DB
	});
};
