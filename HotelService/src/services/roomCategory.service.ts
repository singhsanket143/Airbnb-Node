import RoomCategory from "../db/models/roomCategory";
import { CreateRoomCategoryDTO } from "../dto/roomCategory.dto";
import { hotelRepository } from "../repositories/hotel.repository";
import { roomCategoryRepository } from "../repositories/roomCatergory.repository";
import { NotFoundError } from "../utils/errors/app.error";

export async function createRoomCategoryService(
	hotelData: CreateRoomCategoryDTO
): Promise<RoomCategory> {
	const roomCategory = await roomCategoryRepository.create(hotelData);
	return roomCategory;
}

export async function getRoomCategoryByIdService(id: number): Promise<RoomCategory> {
	const roomCategory = await roomCategoryRepository.findById(id);
	if (!roomCategory) {
		throw new NotFoundError(`RoomCategory with id ${id} not found`);
	}
	return roomCategory;
}

export async function getAllRoomCategoriesForHotelService(
	hotelId: number
): Promise<RoomCategory[]> {
	const hotel = await hotelRepository.findById(hotelId);
	if (!hotel) {
		throw new NotFoundError(`Hotel with id ${hotelId} not found`);
	}
	const categories = await roomCategoryRepository.findAll({ hotelId });
	return categories;
}

export async function deleteRoomCategoryService(id: number): Promise<void> {
	const roomCategory = await roomCategoryRepository.findById(id);
	if (!roomCategory) {
		throw new NotFoundError(`RoomCategory with id ${id} not found`);
	}
	await roomCategoryRepository.delete({ id });
}
