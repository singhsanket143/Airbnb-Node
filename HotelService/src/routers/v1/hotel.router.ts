import express from 'express';
import { createHotelHandler, deleteHotelHandler, getAllHotelsHandler, getHotelByIdHandler, updateHotelHandler } from '../../controllers/hotel.controller';
import { validateRequestBody } from '../../validators';
import { hotelSchema } from '../../validators/hotel.validator';

const hotelRouter = express.Router();

hotelRouter.post(
    '/', 
    validateRequestBody(hotelSchema),
    createHotelHandler); // TODO: Resolve this TS compilation issue

hotelRouter.get('/:id', getHotelByIdHandler); // TODO: Resolve this TS compilation issue

hotelRouter.get('/', getAllHotelsHandler);

hotelRouter.delete('/:id', deleteHotelHandler);

hotelRouter.patch('/:id',validateRequestBody(hotelSchema), updateHotelHandler);




export default hotelRouter;