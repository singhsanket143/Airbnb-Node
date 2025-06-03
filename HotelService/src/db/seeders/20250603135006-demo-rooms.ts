import { QueryInterface } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(`
      INSERT INTO rooms (roomTypeId, hotelId, DOA, booking_id, price, room_no, createdAt, updatedAt)
      VALUES 
        (1, 1, '2025-06-01', NULL, 100.00, '101', NOW(), NOW()); `);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(`
      DELETE FROM rooms
      WHERE roomTypeId = 1 AND hotelId = 1 AND DOA = '2025-06-01';
    `);
  }
};
