import logger from "../config/logger.config";
import Hotel from "../db/models/hotel";
import { createHotelDTO } from "../dto/hotel.dto";
import { InternalServerError, NotFoundError } from "../utils/errors/app.error";

export async function createHotel(hotelData: createHotelDTO) {
    const hotel = await Hotel.create({
        name: hotelData.name,
        address: hotelData.address,
        location: hotelData.location,
        rating: hotelData.rating,
        ratingCount: hotelData.ratingCount,
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
    const hotel = await Hotel.findAll();

    if (!hotel) {
        logger.error(`Could not found hotels in DB`);
        throw new InternalServerError(`Could not found hotels in DB`);
    }

    return hotel;
}

export async function deleteHotelById(id: number) {

    const existingHotel = await Hotel.findByPk(id);
    
    if (!existingHotel) {
        logger.error(`Hotel not found: ${id}`);
        throw new NotFoundError(`Hotel with id ${id} not found`);
    }

    const hotel = await Hotel.destroy({
    where:{
        id
    }
    });

    if (!hotel) {
        logger.error(`Cannot delete Hotel with id ${id}`);
        throw new InternalServerError(`Cannot delete Hotel with id ${id}`);
    }

    logger.info(`Hotel with id ${id} deleted!`);

    return hotel;
}

export async function updateHotelById(id: number, data: object) {

    const existingHotel = await Hotel.findByPk(id);

    if (!existingHotel) {
        logger.error(`Hotel not found: ${id}`);
        throw new NotFoundError(`Hotel with id ${id} not found`);
    }

    const hotel = await Hotel.update(data, {
        where: {
            id
        }
    });

    if (hotel[0] === 0) {
        logger.info(`Hotel with id ${id} exists but no fields were updated!`);
    }

    logger.info(`Hotel with id ${id} was updated successfully`);

    const updatedHotel = await Hotel.findByPk(id);

    return updatedHotel;
}