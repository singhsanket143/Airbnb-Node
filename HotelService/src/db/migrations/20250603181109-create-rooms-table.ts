"use strict";

import { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXIST rooms
   (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT NOT NULL,
    date_of_available TIMESTAMP NOT NULL,
    room_type_id INT NOT NULL,
    booking_id INT DEFAULT NULL,
    room_number VARCHAR(255),
    price INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    deleted_at TIMESTAMP DEFAULT NULL
    );

    `);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXIST rooms;
      `);
  },
};
