// This file contains all the basic configuration logic for the app server to work
import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number,
    REDIS_PORT?: number,
    REDIS_HOST?: string,
}

function loadEnv() {
    dotenv.config();
    console.log(`Environment variables loaded`);
}

loadEnv();

export const serverConfig: ServerConfig = {
    PORT: Number(process.env.PORT) || 3001,
    REDIS_PORT: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
};