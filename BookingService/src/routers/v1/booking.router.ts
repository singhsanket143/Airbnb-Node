import express from 'express';
import {  validateRequestBody, validateQueryParams } from '../../validators';
import { createBookingSchema, availabilityQuerySchema } from '../../validators/booking.validator';
import { confirmBookingHandler, createBookingHandler, checkAvailabilityHandler } from '../../controllers/booking.controller';

const bookingRouter = express.Router();

bookingRouter.get('/availability', validateQueryParams(availabilityQuerySchema), checkAvailabilityHandler);
bookingRouter.post('/', validateRequestBody(createBookingSchema), createBookingHandler);
bookingRouter.post('/confirm/:idempotencyKey', confirmBookingHandler); 


export default bookingRouter;