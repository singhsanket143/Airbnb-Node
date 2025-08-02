import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { addRoomGenerationJobToQueue } from "../producers/roomGeneration.producer";

export async function generateRoomHandler(req: Request, res: Response) {


    await addRoomGenerationJobToQueue(req.body);

    res.status(StatusCodes.OK).json({
        message: "Room generation job added to queue",
        success: true,
        data: {},
    })
}