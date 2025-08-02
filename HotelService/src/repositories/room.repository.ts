import { CreationAttributes } from "sequelize";
import Room from "../db/models/room";
import BaseRepository from "./base.repository";

export class RoomRepository extends BaseRepository<Room> {
    constructor() {
        super(Room);
    }

    async findByRoomCategoryIdAndDate(
        roomCategoryId: number,
        currentDate: Date
    ) {
        return await this.model.findOne({
            where: {
                roomCategoryId,
                dateOfAvailability: currentDate,
                deletedAt: null
            }
        })
    }

    async bulkCreate(rooms: CreationAttributes<Room>[]) {
        return await this.model.bulkCreate(rooms);
    }

    async findLatestDateByRoomCategoryId(roomCategoryId: number): Promise<Date | null> {
        const result = await this.model.findOne({
            where: {
                roomCategoryId,
                deletedAt: null
            },
            attributes: ['dateOfAvailability'],
            order: [['dateOfAvailability', 'DESC']]
        });
        
        return result ? result.dateOfAvailability : null;
    }

    async findLatestDatesForAllCategories(): Promise<Array<{roomCategoryId: number, latestDate: Date}>> {
        const results = await this.model.findAll({
            where: {
                deletedAt: null
            },
            attributes: [
                'roomCategoryId',
                [this.model.sequelize!.fn('MAX', this.model.sequelize!.col('date_of_availability')), 'latestDate']
            ],
            group: ['roomCategoryId'],
            raw: true
        });
        
        return results.map((result: any) => ({
            roomCategoryId: result.roomCategoryId,
            latestDate: new Date(result.latestDate)
        }));
    }
}