import { Request, Response } from 'express';
import { confirmBookingService, createBookingService, checkAvailabilityService } from '../services/booking.service';
import { CreateBookingDTO, BookingAvailabilityDTO } from '../dto/booking.dto';

export const createBookingHandler = async (req: Request, res: Response) => {
    try {
        const booking = await createBookingService(req.body as CreateBookingDTO);

        res.status(201).json({
            bookingId: booking.bookingId,
            idempotencyKey: booking.idempotencyKey,
            totalAmount: booking.totalAmount,
            totalNights: booking.totalNights,
            pricePerNight: booking.pricePerNight,
        });
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Failed to create booking'
        });
    }
}

export const checkAvailabilityHandler = async (req: Request, res: Response) => {
    try {
        const availabilityDTO: BookingAvailabilityDTO = {
            hotelId: parseInt(req.query.hotelId as string),
            checkInDate: req.query.checkInDate as string,
            checkOutDate: req.query.checkOutDate as string,
            roomType: req.query.roomType as string,
            guests: req.query.guests ? parseInt(req.query.guests as string) : undefined
        };

        const availableRooms = await checkAvailabilityService(availabilityDTO);

        res.status(200).json({
            availableRooms,
            totalAvailable: availableRooms.length
        });
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Failed to check availability'
        });
    }
}

export const confirmBookingHandler = async (req: Request, res: Response) => {
    try {
        const booking = await confirmBookingService(req.params.idempotencyKey);

        res.status(200).json({
            bookingId: booking.id,
            status: booking.status,
            totalAmount: booking.totalAmount,
            totalNights: booking.totalNights,
            pricePerNight: booking.pricePerNight,
        });
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Failed to confirm booking'
        });
    }
}