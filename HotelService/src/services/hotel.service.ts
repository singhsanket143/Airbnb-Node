import { createHotelDTO } from "../dto/hotel.dto";
import { createHotel, deleteHotelById, getAllHotels, getHotelById, updateHotelById } from "../repositories/hotel.repository";

export async function createHotelService(hotelData: createHotelDTO) {
    const hotel = await createHotel(hotelData);
    return hotel;
}

export async function getHotelByIdService(id: number) {
    const hotel = await getHotelById(id);
    return hotel;
}

export async function getAllHotelsService() {
    const hotel = await getAllHotels();
    return hotel;
}

export async function deleteHotelByIdService(id: number) {
    const hotel = await deleteHotelById(id);
    return hotel;
}

export async function updateHotelByIdService(id: number, data:object) {
    const hotel = await updateHotelById(id, data);
    return hotel;
}