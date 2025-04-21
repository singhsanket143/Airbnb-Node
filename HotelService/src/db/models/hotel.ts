import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "./sequelize";

class Hotel extends Model<InferAttributes<Hotel>, InferCreationAttributes<Hotel> > {
    declare id: CreationOptional<number>;
    declare name: string;
    declare address: string;
    declare location: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare rating?: number;
    declare ratingCount?: number;
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
    address: {
        type: "STRING",
        allowNull: false,
    },
    location: {
        type: "STRING",
        allowNull: false,
    },
    createdAt: {
        type: "DATE",
        defaultValue: new Date(),
    },
    updatedAt: {
        type: "DATE",
        defaultValue: new Date(),
    },
    rating: {
        type: "FLOAT",
        defaultValue: null,
    },
    ratingCount: {
        type: "INTEGER",
        defaultValue: null,
    }
}, {
    tableName: "hotels",
    sequelize: sequelize,
    underscored: true, // createdAt --> created_at
    timestamps: true, // createdAt, updatedAt
});

export default Hotel;

// Hotel.create({ name: "", address: "", location: "" })