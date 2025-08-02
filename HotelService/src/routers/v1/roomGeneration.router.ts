import express from 'express';
import { validateRequestBody } from '../../validators';
import { RoomGenerationJobSchema } from '../../dto/roomGeneration.dto';
import { generateRoomHandler } from '../../controllers/roomGeneration.controller';

const roomGenerationRouter = express.Router();

roomGenerationRouter.post(
    '/', 
    validateRequestBody(RoomGenerationJobSchema),
    generateRoomHandler); 

export default roomGenerationRouter;