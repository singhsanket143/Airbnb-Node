import { roomGenJobQueue } from "../queues/roomGenerationJob.queue";
import { RoomGenerationJobReq } from "./../dto/roomGeneration.dto";

export const ROOM_GENERATION_PAYLOAD_NAME = "payload:room-gen";

export const addRoomGenPayloadToJobQueue = async (payload: RoomGenerationJobReq, jobId?: string) => {
	await roomGenJobQueue.add(ROOM_GENERATION_PAYLOAD_NAME, payload, {
        jobId // this Id can be accessed during processing
    });
	console.log(
		`Job of type "${ROOM_GENERATION_PAYLOAD_NAME}" added to queue: ${JSON.stringify(payload)}`
	);
};
