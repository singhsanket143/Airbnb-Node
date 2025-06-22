import { RoomType } from "../db/models/roomCategory";

export interface CreateRoomCategoryDTO {
	hotelId: number;
	price: number;
	roomType: RoomType;
	roomCount: number;
}
