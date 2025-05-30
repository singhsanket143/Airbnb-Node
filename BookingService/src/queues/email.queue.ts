import { Queue } from 'bullmq';
import { getRedisConnObject } from '../config/redis.config';

export const MAILER_QUEUE = "queue-mailer";

export const mailerQueue = new Queue(MAILER_QUEUE, {
    connection: getRedisConnObject(),
});

