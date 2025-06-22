import { createHotelDTO } from "../dto/hotel.dto";
import { hotelRepository } from "../repositories/hotel.repository";

export async function createHotelService(hotelData: createHotelDTO) {
	const hotel = await hotelRepository.create(hotelData);
	return hotel;
}

export async function getHotelByIdService(id: number) {
	const hotel = await hotelRepository.findById(id);
	return hotel;
}

export async function getAllHotelsService() {
	const hotels = await hotelRepository.findAll();
	return hotels;
}

export async function deleteHotelService(id: number) {
	const response = await hotelRepository.softDelete(id);
	return response;
}
