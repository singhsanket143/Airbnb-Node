import express from 'express';
import { validateRequestBody } from '../../validators';
import { RoomGenerationJobSchema } from '../../dto/roomGeneration.dto';
import { generateRoomsHandler } from '../../controllers/roomGeneration.controller';

const roomGenerationHandler = express.Router();

roomGenerationHandler.post(
    '/', 
    validateRequestBody(RoomGenerationJobSchema),
    generateRoomsHandler);

export default roomGenerationHandler;