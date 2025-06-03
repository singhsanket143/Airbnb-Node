import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "./sequelize";


class Room extends Model<InferAttributes<Room>, InferCreationAttributes<Room>> {
    declare id: CreationOptional<number>;
    declare roomTypeId: number;
    declare hotelId: number;
    declare DOA: Date;
    declare booking_id: CreationOptional<number>;
    declare price: number;
    declare room_no: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Room.init({
    id: {
        type: "INTEGER",
        autoIncrement: true,
        primaryKey: true,
    },
    roomTypeId: {
        type: "INTEGER",
        allowNull: false,
        references: {
            model: 'roomtypes',
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    hotelId: {
        type: "INTEGER",
        allowNull: false,
        references: {
            model: 'hotels',
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    DOA: {
        type: "DATE",
        allowNull: false,
    },
    booking_id: {
        type: "INTEGER",
        allowNull: true,
    },
    price: {
        type: "DECIMAL(10, 2)",
        allowNull: false,
    },
    room_no: {
        type: "STRING(50)",
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
    modelName: 'Rooms',
    sequelize: sequelize,
    underscored: true,
    timestamps: true,
});

export default Room;