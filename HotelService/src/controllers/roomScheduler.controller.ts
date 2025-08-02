import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { startScheduler, stopScheduler, getSchedulerStatus, manualExtendAvailability } from "../scheduler/roomScheduler";
import logger from "../config/logger.config";

/**
 * Start the room availability extension scheduler
 */
export async function startSchedulerHandler(req: Request, res: Response) {
    try {
        startScheduler();
        
        res.status(StatusCodes.OK).json({
            message: "Room availability extension scheduler started successfully",
            success: true,
            data: {
                status: "started"
            }
        });
    } catch (error) {
        logger.error('Error starting scheduler:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Failed to start room availability extension scheduler",
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}

/**
 * Stop the room availability extension scheduler
 */
export async function stopSchedulerHandler(req: Request, res: Response) {
    try {
        stopScheduler();
        
        res.status(StatusCodes.OK).json({
            message: "Room availability extension scheduler stopped successfully",
            success: true,
            data: {
                status: "stopped"
            }
        });
    } catch (error) {
        logger.error('Error stopping scheduler:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Failed to stop room availability extension scheduler",
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}

/**
 * Get the current status of the room availability extension scheduler
 */
export async function getSchedulerStatusHandler(req: Request, res: Response) {
    try {
        const status = getSchedulerStatus();
        
        res.status(StatusCodes.OK).json({
            message: "Scheduler status retrieved successfully",
            success: true,
            data: status
        });
    } catch (error) {
        logger.error('Error getting scheduler status:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Failed to get scheduler status",
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}

/**
 * Manually trigger room availability extension
 */
export async function manualExtendAvailabilityHandler(req: Request, res: Response) {
    try {
        await manualExtendAvailability();
        
        res.status(StatusCodes.OK).json({
            message: "Manual room availability extension completed successfully",
            success: true,
            data: {
                action: "manual_extension_completed"
            }
        });
    } catch (error) {
        logger.error('Error in manual room availability extension:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Failed to perform manual room availability extension",
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
} 