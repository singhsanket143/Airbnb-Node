import express from "express";
import pingRouter from "./ping.router";
import hotelRouter from "./hotel.router";
import roomCategoryRouter from "./roomCategory.router";

const v1Router = express.Router();

v1Router.use("/ping", pingRouter);

v1Router.use("/hotels", hotelRouter);

v1Router.use("/roomCategories", roomCategoryRouter);

export default v1Router;
