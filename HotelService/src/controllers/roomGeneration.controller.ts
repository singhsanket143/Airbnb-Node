import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { RoomGenerationJobReq } from "../dto/roomGeneration.dto";
import { createRoomGenerationJob } from "../services/roomGeneration.service";

export async function generateRoomsJobHandler(
	req: Request<any, any, RoomGenerationJobReq>,
	res: Response,
	next: NextFunction
) {
	const jobReqPayload: RoomGenerationJobReq = req.body;
	await createRoomGenerationJob(jobReqPayload);
	res.status(StatusCodes.OK).json({
		message: "Request added to job queue successfully",
		success: true,
	});
}
