import { Request, Response, NextFunction } from "express";
import { createHotelService, deleteHotelByIdService, getAllHotelsService, getHotelByIdService, updateHotelByIdService } from "../services/hotel.service";

export async function createHotelHandler(req: Request, res: Response, next: NextFunction) {
    // 1. Call the service layer

    const hotelResponse = await createHotelService(req.body);

    // 2. Send the response

    res.status(201).json({
        message: "Hotel created successfully",
        data: hotelResponse,
        success: true,
    })
}

export async function getHotelByIdHandler(req: Request, res: Response, next: NextFunction) {
    // 1. Call the service layer

    const hotelResponse = await getHotelByIdService(Number(req.params.id));

    // 2. Send the response

    res.status(200).json({
        message: "Hotel found successfully",
        data: hotelResponse,
        success: true,
    })
}

export async function getAllHotelsHandler(req: Request, res: Response, next: NextFunction) {

    const hotelResponse = await getAllHotelsService();

    res.status(200).json({
        message: "Hotels found successfully",
        data: hotelResponse,
        success: true,
    })

}

export async function deleteHotelHandler(req: Request, res: Response, next: NextFunction) {
    await deleteHotelByIdService(Number(req.params.id));

    res.status(200).json({
        message: "Hotel deleted successfully",
        success: true,
    })
    
}

export async function updateHotelHandler(req: Request, res: Response, next: NextFunction) {
    const hotelResponse = await updateHotelByIdService(Number(req.params.id), req.body);

    res.status(200).json({
        message: "Hotel updated successfully",
        data: hotelResponse,
        success: true,
    })
    
}