import express from 'express';
import pingRouter from './ping.router';
import hotelRouter from './hotel.router';
import roomGenerationRouter from './roomGeneration.router';
import cronRoomGenerationRouter from './cronRoomGeneration.router';

const v1Router = express.Router();

v1Router.use('/ping',  pingRouter);

v1Router.use('/hotels', hotelRouter);

v1Router.use('/room-generation', roomGenerationRouter);

v1Router.use('/cron-room-generation', cronRoomGenerationRouter);

export default v1Router;