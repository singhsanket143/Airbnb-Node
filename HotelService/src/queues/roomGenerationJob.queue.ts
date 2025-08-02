import { Queue } from "bullmq";
import { getRedisConnObject } from "../config/redis.config";

export const ROOM_GEN_JOB_QUEUE_NAME = "room-gen-job-queue";

export const roomGenJobQueue = new Queue(ROOM_GEN_JOB_QUEUE_NAME, {
	connection: getRedisConnObject(),
});
