import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { RoomGenerationJob, RoomGenerationResponse } from "../dto/roomGeneration.dto";
import { generateRooms } from "../services/roomGeneration.service";

export async function generateRoomsHandler(req: Request, res: Response, next: NextFunction) {
	const { totalDatesProcessed, totalRoomsCreated } = await generateRooms(
		req.body as RoomGenerationJob
	);
	const response: RoomGenerationResponse = {
		success: true,
		totalRoomsCreated: totalRoomsCreated,
		totalDatesProcessed: totalDatesProcessed,
		errors: [],
	};
	res.status(StatusCodes.CREATED).json(response);
}
