import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  async up (queryInterface: QueryInterface) {
    await queryInterface.createTable('roomtypes', {
      id: {
        type: 'INTEGER',
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      hotelId: {
        type: 'INTEGER',
        allowNull: false,
        references: {
          model: 'hotels',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      roomCategory: {
        type: DataTypes.ENUM('STANDARD', 'DELUXE', 'SUITE', 'PREMIUM', 'EXECUTIVE'),
        allowNull: false
      },
      numberOfRooms: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    });
  },

  async down (queryInterface: QueryInterface) {
    await queryInterface.dropTable('roomtypes');
  }
};
