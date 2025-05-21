// This file contains all the basic configuration logic for the app server to work
import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number
}

function loadEnv() {
    dotenv.config();
    console.log(`Environment variables loaded`);
}

loadEnv();

export const serverConfig: ServerConfig = {
    PORT: Number(process.env.PORT) || 3001
};