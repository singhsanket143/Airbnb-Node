import { QueryInterface } from "sequelize";

module.exports = {
  async up (queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(`
      INSERT INTO roomtypes (hotelId, price, roomCategory, numberOfRooms, createdAt, updatedAt)
      VALUES 
        (1, 100.00, 'STANDARD', 10, NOW(), NOW());
    `);
  },

  async down (queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(`
      DELETE FROM roomtypes
      WHERE hotelId = 1 AND roomCategory = 'STANDARD';
    `);
  }
};
