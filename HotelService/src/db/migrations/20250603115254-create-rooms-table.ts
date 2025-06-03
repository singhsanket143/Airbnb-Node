import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  async up (queryInterface: QueryInterface) {
    await queryInterface.createTable('rooms', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      roomTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hotelId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      DOA: {
        type: DataTypes.DATE,
        allowNull: false
      },
      booking_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      room_no: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
  });
  },

  async down (queryInterface: QueryInterface) {
    await queryInterface.dropTable('rooms');
  }
};
