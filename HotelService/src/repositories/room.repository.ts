import { CreationAttributes, Op } from "sequelize";
import Room from "../db/models/room";
import BaseRepository from "./base.repository";

export class RoomRepository extends BaseRepository<Room> {
	constructor() {
		super(Room);
	}

	async findByRoomCategoryIdAndDate(roomCategoryId: number, currentDate: Date) {
		return await this.model.findOne({
			where: {
				roomCategoryId,
				dateOfAvailability: currentDate,
				deletedAt: null,
			},
		});
	}

	async findByRoomCategoryIdAndRoomNoAndDateRange(
		roomCategoryId: number,
		roomNo: number,
		startDate: Date,
		endDate: Date
	) {
		return await this.model.findAll({
			where: {
				roomCategoryId,
				dateOfAvailability: {
					[Op.between]: [startDate, endDate],
				},
				roomNo,
			},
		});
	}

	async bulkCreate(rooms: CreationAttributes<Room>[]) {
		return await this.model.bulkCreate(rooms);
	}
}
