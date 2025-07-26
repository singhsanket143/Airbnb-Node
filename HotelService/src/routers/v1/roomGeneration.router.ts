import { Router } from 'express';
import roomGenerationController from '../../controllers/roomGeneration.controller';
import { validateRequest } from '../../middlewares/validator.middleware';
import { RoomGenerationRequestSchema } from '../../dto/roomGeneration.dto';

const router = Router();

/**
 * @route POST /api/v1/room-generation
 * @desc Generate rooms for a room category and date range
 * @access Private
 */
router.post(
  '/',
  validateRequest(RoomGenerationRequestSchema),
  roomGenerationController.generateRooms
);

/**
 * @route GET /api/v1/room-generation/job/:jobId
 * @desc Get job status by job ID
 * @access Private
 */
router.get('/job/:jobId', roomGenerationController.getJobStatus);

/**
 * @route GET /api/v1/room-generation/queue/stats
 * @desc Get queue statistics
 * @access Private
 */
router.get('/queue/stats', roomGenerationController.getQueueStats);

/**
 * @route GET /api/v1/room-generation/stats/:roomCategoryId
 * @desc Get room generation statistics for a room category
 * @access Private
 */
router.get('/stats/:roomCategoryId', roomGenerationController.getRoomStats);

export default router; 