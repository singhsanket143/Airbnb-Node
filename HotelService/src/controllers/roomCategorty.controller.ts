import { Request, Response, NextFunction } from "express";
import {
	createRoomCategoryService,
	deleteRoomCategoryService,
	getAllRoomCategoriesForHotelService,
	getRoomCategoryByIdService,
} from "../services/roomCategory.service";
import { StatusCodes } from "http-status-codes";

export async function createRoomCategoryHandler(req: Request, res: Response, next: NextFunction) {
	const categoryResponse = await createRoomCategoryService(req.body);
	res.status(StatusCodes.CREATED).json({
		message: "RoomCategory created successfully",
		data: categoryResponse,
		success: true,
	});
}

export async function getRoomCategoryByIdHandler(req: Request, res: Response, next: NextFunction) {
	const categoryResponse = await getRoomCategoryByIdService(Number(req.params.id));
	res.status(StatusCodes.OK).json({
		message: "RoomCategory found successfully",
		data: categoryResponse,
		success: true,
	});
}

export async function getAllRoomCategoriesForHotelHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const hotelId = Number(req.params.hotelId);
	const categoriesResponse = await getAllRoomCategoriesForHotelService(hotelId);
	res.status(StatusCodes.OK).json({
		message: "RoomCategorys found successfully",
		data: categoriesResponse,
		success: true,
	});
}

export async function deleteRoomCategoryHandler(req: Request, res: Response, next: NextFunction) {
	const categoryId = Number(req.params.id);
	const response = await deleteRoomCategoryService(categoryId);
	res.status(StatusCodes.OK).json({
		message: "RoomCategory deleted successfully",
		data: response,
		success: true,
	});
}

export async function updateRoomCategoryHandler(req: Request, res: Response, next: NextFunction) {
	res.status(StatusCodes.NOT_IMPLEMENTED);
}
