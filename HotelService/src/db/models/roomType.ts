import { InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "./sequelize";

class RoomType extends Model<InferAttributes<RoomType>, InferCreationAttributes<RoomType>> {
  declare id: number;
  declare hotelId: number;
  declare price: number;
  declare roomCategory: 'STANDARD' | 'DELUXE' | 'SUITE' | 'PREMIUM' | 'EXECUTIVE';
  declare numberOfRooms: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

RoomType.init({
  id: {
    type: "INTEGER",
    autoIncrement: true,
    primaryKey: true,
  },
  hotelId: {
    type: "INTEGER",
    allowNull: false,
  },
  price: {
    type: "DECIMAL(10, 2)",
    allowNull: false,
  },
  roomCategory: {
    type: "ENUM('STANDARD', 'DELUXE', 'SUITE', 'PREMIUM', 'EXECUTIVE')",
    allowNull: false,
  },
  numberOfRooms: {
    type: "INTEGER",
    allowNull: false,
  },
  createdAt: {
    type: "DATE",
    allowNull: false,
    defaultValue: new Date(),
  },
  updatedAt: {
    type: "DATE",
    allowNull: false,
    defaultValue: new Date(),
  },
}, {
  modelName: 'RoomType',
  sequelize: sequelize,
  underscored: true,
  timestamps: true,
});

export default RoomType;
