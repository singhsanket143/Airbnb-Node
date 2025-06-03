import logger from "../config/logger.config";
import Hotel from "../db/models/hotel";
import { createHotelDTO } from "../dto/hotel.dto";
import { NotFoundError } from "../utils/errors/app.error";

export async function createHotel(hotelData: createHotelDTO) {
    const hotel = await Hotel.create({
        name: hotelData.name,
        description: hotelData.description,
        hostId: hotelData.hostId,
        cityId: hotelData.cityId,
        stateId: hotelData.stateId,
        pincode: hotelData.pincode,
        address: hotelData.address,
        averageRating: hotelData.averageRating || 0, // Default to 0 if not provided
        numberOfRatings: hotelData.numberOfRatings || 0 // Default to 0 if not provided
    });

    logger.info(`Hotel created: ${hotel.id}`);

    return hotel;
}

export async function getHotelById(id: number) {
    const hotel = await Hotel.findByPk(id);

    if (!hotel) {
        logger.error(`Hotel not found: ${id}`);
        throw new NotFoundError(`Hotel with id ${id} not found`);
    }

    logger.info(`Hotel found: ${hotel.id}`);

    return hotel;
}

export async function getAllHotels() {
    const hotels = await Hotel.findAll({
        where: {
            deletedAt: null
        }
    });

    if(!hotels) {
        logger.error(`No hotels found`);
        throw new NotFoundError(`No hotels found`);
    }

    logger.info(`Hotels found: ${hotels.length}`);
    return hotels;
}

export async function softDeleteHotel(id: number) {
    const hotel = await Hotel.findByPk(id);

    if(!hotel) {
        logger.error(`Hotel not found: ${id}`);
        throw new NotFoundError(`Hotel with id ${id} not found`);
    }

    hotel.deletedAt = new Date();
    await hotel.save(); // Save the changes to the database
    logger.info(`Hotel soft deleted: ${hotel.id}`);
    return true;
}