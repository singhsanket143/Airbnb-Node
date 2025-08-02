import express from "express";
import { validateRequestBody } from "../../validators";
import { RoomGenerationJobReqSchema } from "../../dto/roomGeneration.dto";
import { generateRoomsJobHandler } from "../../controllers/roomGeneration.controller";

const roomGenerationHandler = express.Router();

roomGenerationHandler.post(
	"/",
	validateRequestBody(RoomGenerationJobReqSchema),
	generateRoomsJobHandler
);

export default roomGenerationHandler;
