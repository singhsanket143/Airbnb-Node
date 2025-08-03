import { CreateBookingDTO, BookingAvailabilityDTO, RoomAvailabilityDTO, BookingResponseDTO } from '../dto/booking.dto';
import { 
    confirmBooking, 
    createBooking, 
    createIdempotencyKey, 
    finalizeIdempotencyKey, 
    getIdempotencyKeyWithLock,
    checkRoomAvailability,
    getAvailableRooms,
    calculateBookingPrice
} from '../repositories/booking.repository';
import { BadRequestError, InternalServerError, NotFoundError } from '../utils/errors/app.error';
import { generateIdempotencyKey } from '../utils/generateIdempotencyKey';

import prismaClient from '../prisma/client';
import { redlock } from '../config/redis.config';
import { serverConfig } from '../config';

export async function createBookingService(createBookingDTO: CreateBookingDTO): Promise<BookingResponseDTO> {
    const ttl = serverConfig.LOCK_TTL;
    const bookingResource = `hotel:${createBookingDTO.hotelId}:room:${createBookingDTO.roomId}`;

    try {
        await redlock.acquire([bookingResource], ttl);
        
        // Parse dates
        const checkInDate = new Date(createBookingDTO.checkInDate);
        const checkOutDate = new Date(createBookingDTO.checkOutDate);
        
        // Validate dates
        if (checkInDate >= checkOutDate) {
            throw new BadRequestError('Check-out date must be after check-in date');
        }
        
        if (checkInDate < new Date()) {
            throw new BadRequestError('Check-in date cannot be in the past');
        }
        
        // Check room availability
        const isAvailable = await checkRoomAvailability(createBookingDTO.roomId, checkInDate, checkOutDate);
        if (!isAvailable) {
            throw new BadRequestError('Room is not available for the selected dates');
        }
        
        // Calculate pricing
        const pricing = await calculateBookingPrice(createBookingDTO.roomId, checkInDate, checkOutDate);
        
        const booking = await createBooking({
            userId: createBookingDTO.userId,
            hotelId: createBookingDTO.hotelId,
            roomId: createBookingDTO.roomId,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            totalNights: pricing.totalNights,
            pricePerNight: pricing.pricePerNight,
            totalAmount: pricing.totalAmount,
            totalGuests: createBookingDTO.totalGuests,
        });

        const idempotencyKey = generateIdempotencyKey();

        await createIdempotencyKey(idempotencyKey, booking.id);

        return {
            bookingId: booking.id,
            idempotencyKey: idempotencyKey,
            totalAmount: booking.totalAmount,
            totalNights: booking.totalNights,
            pricePerNight: booking.pricePerNight,
        };
    } catch (error) {
        if (error instanceof BadRequestError) {
            throw error;
        }
        throw new InternalServerError('Failed to create booking');
    }
}

export async function checkAvailabilityService(availabilityDTO: BookingAvailabilityDTO): Promise<RoomAvailabilityDTO[]> {
    try {
        const checkInDate = new Date(availabilityDTO.checkInDate);
        const checkOutDate = new Date(availabilityDTO.checkOutDate);
        
        // Validate dates
        if (checkInDate >= checkOutDate) {
            throw new BadRequestError('Check-out date must be after check-in date');
        }
        
        if (checkInDate < new Date()) {
            throw new BadRequestError('Check-in date cannot be in the past');
        }
        
        const availableRooms = await getAvailableRooms(
            availabilityDTO.hotelId, 
            checkInDate, 
            checkOutDate, 
            availabilityDTO.roomType
        );
        
        return availableRooms.map(room => ({
            roomId: room.id,
            hotelId: room.hotelId,
            roomType: room.roomType,
            pricePerNight: room.pricePerNight,
            available: true,
            availableDates: [availabilityDTO.checkInDate, availabilityDTO.checkOutDate]
        }));
    } catch (error) {
        if (error instanceof BadRequestError) {
            throw error;
        }
        throw new InternalServerError('Failed to check availability');
    }
}

// Todo: explore the function for potential issues and improvements
export async function confirmBookingService(idempotencyKey: string) {

    return await prismaClient.$transaction(async (tx) => {

        const idempotencyKeyData = await getIdempotencyKeyWithLock(tx, idempotencyKey);

        if(!idempotencyKeyData || !idempotencyKeyData.bookingId) {
            throw new NotFoundError('Idempotency key not found');
        }

        if(idempotencyKeyData.finalized) {
            throw new BadRequestError('Idempotency key already finalized');
        }

        const booking = await confirmBooking(tx, idempotencyKeyData.bookingId);
        await finalizeIdempotencyKey(tx, idempotencyKey);

        return booking;

    }); 
}