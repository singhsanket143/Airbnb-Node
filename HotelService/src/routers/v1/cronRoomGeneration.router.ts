import { Router } from 'express';
import cronRoomGenerationController from '../../controllers/cronRoomGeneration.controller';

const router = Router();

/**
 * @route POST /api/v1/cron-room-generation/start
 * @desc Start the automatic room generation scheduler
 * @access Private
 */
router.post('/start', cronRoomGenerationController.startScheduler);

/**
 * @route POST /api/v1/cron-room-generation/stop
 * @desc Stop the automatic room generation scheduler
 * @access Private
 */
router.post('/stop', cronRoomGenerationController.stopScheduler);

/**
 * @route GET /api/v1/cron-room-generation/status
 * @desc Get scheduler status
 * @access Private
 */
router.get('/status', cronRoomGenerationController.getSchedulerStatus);

/**
 * @route POST /api/v1/cron-room-generation/execute
 * @desc Execute room generation manually for all categories
 * @access Private
 */
router.post('/execute', cronRoomGenerationController.executeManualGeneration);

/**
 * @route POST /api/v1/cron-room-generation/execute/:roomCategoryId
 * @desc Execute room generation for a specific category
 * @access Private
 */
router.post('/execute/:roomCategoryId', cronRoomGenerationController.executeCategoryGeneration);

/**
 * @route GET /api/v1/cron-room-generation/stats
 * @desc Get cron generation statistics
 * @access Private
 */
router.get('/stats', cronRoomGenerationController.getCronStats);

export default router; 