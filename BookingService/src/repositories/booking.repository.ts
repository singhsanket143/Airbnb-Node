import { Prisma, IdempotencyKey } from "@prisma/client";

import { validate as isValidUUID } from "uuid";

import prismaClient from "../prisma/client";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { HotelIntegrationService } from "../services/hotel-integration.service";

export async function createBooking(bookingInput: Prisma.BookingCreateInput) {
    const booking = await prismaClient.booking.create({
        data: bookingInput
    });

    return booking;
}

export async function checkRoomAvailability(roomId: number, checkInDate: Date, checkOutDate: Date) {
    // Check if the room is available for the given date range
    const conflictingBookings = await prismaClient.booking.findMany({
        where: {
            roomId: roomId,
            status: {
                in: ['PENDING', 'CONFIRMED']
            },
            OR: [
                {
                    AND: [
                        { checkInDate: { lte: checkInDate } },
                        { checkOutDate: { gt: checkInDate } }
                    ]
                },
                {
                    AND: [
                        { checkInDate: { lt: checkOutDate } },
                        { checkOutDate: { gte: checkOutDate } }
                    ]
                },
                {
                    AND: [
                        { checkInDate: { gte: checkInDate } },
                        { checkOutDate: { lte: checkOutDate } }
                    ]
                }
            ]
        }
    });

    return conflictingBookings.length === 0;
}

export async function getAvailableRooms(hotelId: number, checkInDate: Date, checkOutDate: Date, roomType?: string) {
    const hotelService = HotelIntegrationService.getInstance();
    
    // Get available rooms from HotelService
    const availableRooms = await hotelService.getAvailableRooms(
        hotelId,
        checkInDate.toISOString().split('T')[0],
        checkOutDate.toISOString().split('T')[0],
        roomType
    );

    // Filter out rooms that are already booked in our booking service
    const conflictingBookings = await prismaClient.booking.findMany({
        where: {
            hotelId: hotelId,
            status: {
                in: ['PENDING', 'CONFIRMED']
            },
            OR: [
                {
                    AND: [
                        { checkInDate: { lte: checkInDate } },
                        { checkOutDate: { gt: checkInDate } }
                    ]
                },
                {
                    AND: [
                        { checkInDate: { lt: checkOutDate } },
                        { checkOutDate: { gte: checkOutDate } }
                    ]
                },
                {
                    AND: [
                        { checkInDate: { gte: checkInDate } },
                        { checkOutDate: { lte: checkOutDate } }
                    ]
                }
            ]
        },
        select: {
            roomId: true
        }
    });

    const bookedRoomIds = conflictingBookings.map(booking => booking.roomId);
    
    return availableRooms.filter(room => !bookedRoomIds.includes(room.id));
}

export async function calculateBookingPrice(roomId: number, checkInDate: Date, checkOutDate: Date) {
    // Calculate total nights
    const totalNights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Get room price from HotelService
    const hotelService = HotelIntegrationService.getInstance();
    const roomInfo = await hotelService.getRoomInfo(roomId);
    
    if (!roomInfo) {
        throw new NotFoundError('Room not found');
    }
    
    const pricePerNight = roomInfo.pricePerNight;
    const totalAmount = pricePerNight * totalNights;
    
    return {
        pricePerNight,
        totalNights,
        totalAmount
    };
}

export async function createIdempotencyKey(key: string, bookingId: number) {
    const idempotencyKey = await prismaClient.idempotencyKey.create({
        data: {
            idemKey: key,
            booking: {
                connect: {
                    id: bookingId
                }
            }
        }
    });

    return idempotencyKey;
}

export async function getIdempotencyKeyWithLock(tx: Prisma.TransactionClient, key: string,) {
    if(!isValidUUID(key)) {
        throw new BadRequestError("Invalid idempotency key format");
    }

    const idempotencyKey: Array<IdempotencyKey> = await tx.$queryRaw(
        Prisma.raw(`SELECT * FROM IdempotencyKey WHERE idemKey = '${key}' FOR UPDATE;`)
    )

    if(!idempotencyKey || idempotencyKey.length === 0) {
        throw new NotFoundError("Idempotency key not found");
    }

    return idempotencyKey[0];
}

export async function getBookingById(bookingId: number) {
    const booking = await prismaClient.booking.findUnique({
        where: {
            id: bookingId
        }
    });

    return booking;
}

export async function confirmBooking(tx: Prisma.TransactionClient, bookingId: number) {
    const booking = await tx.booking.update({
        where: {
            id: bookingId
        },
        data: {
            status: "CONFIRMED"
        }
    });
    return booking;
} 

export async function cancelBooking(bookingId: number) {
    const booking = await prismaClient.booking.update({
        where: {
            id: bookingId
        },
        data: {
            status: "CANCELLED"
        }
    });
    return booking;
}

export async function finalizeIdempotencyKey(tx: Prisma.TransactionClient, key: string) {
    const idempotencyKey = await tx.idempotencyKey.update({
        where: {
            idemKey: key
        },
        data: {
            finalized: true
        }
    });

    return idempotencyKey;
}