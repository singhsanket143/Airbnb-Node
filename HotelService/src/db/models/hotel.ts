import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import sequelize from "./sequelize";

class Hotel extends Model<
  InferAttributes<Hotel>,
  InferCreationAttributes<Hotel>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare address: string;
  declare location: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date | null>;
  declare rating?: number;
  declare ratingCount?: number;
  declare hostId: number;
  declare pincode: string;
  declare cityId: number;
}

Hotel.init(
  {
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
    deletedAt: {
      type: "DATE",
      defaultValue: null,
    },
    rating: {
      type: "FLOAT",
      defaultValue: null,
    },
    ratingCount: {
      type: "INTEGER",
      defaultValue: null,
    },
    hostId: {
      type: "INTEGER",
      allowNull: false,
    },
    pincode: {
      type: "STRING",
      allowNull: false,
    },
    cityId: {
      type: "INTEGER",
      allowNull: false,
    },
  },
  {
    tableName: "hotels",
    sequelize: sequelize,
    underscored: true, // createdAt --> created_at
    timestamps: true, // createdAt, updatedAt
  }
);

export default Hotel;
