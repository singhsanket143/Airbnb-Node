import Redis from 'ioredis';
import { serverConfig } from '.';

// Singleton pattern to connect to Redis
function connectToRedis() {
    try {

        let connection: Redis;

        const redisConfig = {
            port: serverConfig.REDIS_PORT,
            host: serverConfig.REDIS_HOST,
            maxRetriesPerRequest: null, // Disable automatic reconnection
        }

        return () => {
            if (!connection) {
                connection = new Redis(redisConfig);
                return connection;
            }

            return connection;
        }
        

    } catch (error) {
        console.error('Error connecting to Redis:', error);
        throw error;
    }
}

export const getRedisConnObject = connectToRedis();