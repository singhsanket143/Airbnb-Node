import Queue from 'bull';
import { RoomGenerationJob, RoomGenerationResult } from '../dto/roomGeneration.dto';
import roomGenerationService from '../services/roomGeneration.service';
import logger from '../config/logger.config';

// Create the room generation queue
const roomGenerationQueue = new Queue<RoomGenerationJob>('room-generation', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

// Process jobs
roomGenerationQueue.process(async (job) => {
  const { data } = job;
  logger.info(`Processing room generation job ${job.id}`, { data });
  
  try {
    const result = await roomGenerationService.generateRooms(data);
    
    // Update job progress
    await job.progress(100);
    
    logger.info(`Room generation job ${job.id} completed successfully`, result);
    return result;
    
  } catch (error) {
    logger.error(`Room generation job ${job.id} failed`, { error, data });
    throw error;
  }
});

// Job event handlers
roomGenerationQueue.on('completed', (job, result) => {
  logger.info(`Job ${job.id} completed successfully`, {
    jobId: job.id,
    result,
  });
});

roomGenerationQueue.on('failed', (job, err) => {
  logger.error(`Job ${job.id} failed`, {
    jobId: job.id,
    error: err.message,
    data: job.data,
  });
});

roomGenerationQueue.on('stalled', (job) => {
  logger.warn(`Job ${job.id} stalled`, {
    jobId: job.id,
    data: job.data,
  });
});

// Queue management functions
export const addRoomGenerationJob = async (
  jobData: RoomGenerationJob,
  options?: {
    delay?: number;
    priority?: number;
  }
): Promise<Queue.Job<RoomGenerationJob>> => {
  const jobOptions: Queue.JobOptions = {};
  
  if (options?.delay) {
    jobOptions.delay = options.delay;
  }
  
  if (options?.priority) {
    jobOptions.priority = options.priority;
  }

  const job = await roomGenerationQueue.add(jobData, jobOptions);
  logger.info(`Added room generation job to queue`, {
    jobId: job.id,
    data: jobData,
    options: jobOptions,
  });
  
  return job;
};

export const getJobStatus = async (jobId: string | number): Promise<{
  id: string | number;
  status: string;
  progress: number;
  result?: RoomGenerationResult;
  error?: string;
  data: RoomGenerationJob;
}> => {
  const job = await roomGenerationQueue.getJob(jobId);
  
  if (!job) {
    throw new Error(`Job ${jobId} not found`);
  }

  const state = await job.getState();
  const progress = await job.progress();
  const result = job.returnvalue;
  const failedReason = job.failedReason;

  return {
    id: job.id,
    status: state,
    progress,
    result,
    error: failedReason,
    data: job.data,
  };
};

export const getQueueStats = async () => {
  const waiting = await roomGenerationQueue.getWaiting();
  const active = await roomGenerationQueue.getActive();
  const completed = await roomGenerationQueue.getCompleted();
  const failed = await roomGenerationQueue.getFailed();
  const delayed = await roomGenerationQueue.getDelayed();

  return {
    waiting: waiting.length,
    active: active.length,
    completed: completed.length,
    failed: failed.length,
    delayed: delayed.length,
  };
};

export const cleanQueue = async () => {
  await roomGenerationQueue.clean(0, 'completed');
  await roomGenerationQueue.clean(0, 'failed');
  logger.info('Queue cleaned successfully');
};

export default roomGenerationQueue; 