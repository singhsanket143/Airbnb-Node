import { Request, Response, NextFunction } from "express";
import { generateRooms } from "../services/roomGeneration.service";
import { StatusCodes } from "http-status-codes";

export async function generateRoomHandler(req: Request, res: Response) {


    const result = await generateRooms(req.body);

    res.status(StatusCodes.OK).json({
        message: "Rooms generated successfully",
        success: true,
        data: result,
    })
}