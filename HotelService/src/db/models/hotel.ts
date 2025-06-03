import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "./sequelize";

class Hotel extends Model<InferAttributes<Hotel>, InferCreationAttributes<Hotel> > {
    declare id: CreationOptional<number>;
    declare name: string;
    declare description: string;
    declare hostId?: CreationOptional<number>;
    declare cityId?: CreationOptional<number>;
    declare stateId?: CreationOptional<number>;
    declare pincode: string;
    declare address: string;
    declare averageRating?: number;
    declare numberOfRatings?: number;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;
}

Hotel.init({
    id: {
        type: "INTEGER",
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: "STRING",
        allowNull: false,
    },
    description: {
        type: "TEXT",
        allowNull: false,
    },
    hostId: {
        type: "INTEGER",
        allowNull: true,
    },
    cityId: {
        type: "INTEGER",
        allowNull: true,
    },
    stateId: {
        type: "INTEGER",
        allowNull: true,
    },
    pincode: {
        type: "STRING",
        allowNull: false,
    },
    address: {
        type: "STRING",
        allowNull: false,
    },
    averageRating: {
        type: "FLOAT",
        allowNull: true,
    },
    numberOfRatings: {
        type: "INTEGER",
        allowNull: true,
    },
    createdAt: {
        type: "DATE",
        defaultValue: new Date(),
    },
    updatedAt: {
        type: "DATE",
        defaultValue: new Date(),
    },
    deletedAt: {
        type: "DATE",
        defaultValue: null,
    },
}, {
    tableName: "hotels",
    sequelize: sequelize,
    underscored: true, // createdAt --> created_at
    timestamps: true, // createdAt, updatedAt
});

export default Hotel;
