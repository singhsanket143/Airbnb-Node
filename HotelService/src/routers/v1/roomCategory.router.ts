import express from "express";
import {
	createRoomCategoryHandler,
	deleteRoomCategoryHandler as deleteRoomCategoryByIdHandler,
	getAllRoomCategoriesForHotelHandler,
	getRoomCategoryByIdHandler,
} from "../../controllers/roomCategorty.controller";
import { validateRequestBody } from "../../validators";
import { roomCategorySchema } from "../../validators/roomCategory.validator";

const roomCategoryRouter = express.Router();

roomCategoryRouter.post("/", validateRequestBody(roomCategorySchema), createRoomCategoryHandler);

roomCategoryRouter.get("/:id", getRoomCategoryByIdHandler);

roomCategoryRouter.get("/hotel/:hotelId", getAllRoomCategoriesForHotelHandler);

roomCategoryRouter.delete("/:id", deleteRoomCategoryByIdHandler);

export default roomCategoryRouter;
