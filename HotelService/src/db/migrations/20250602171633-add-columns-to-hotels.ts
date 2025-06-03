import { QueryInterface } from "sequelize";

module.exports = {
  async up (queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE hotels 
      ADD COLUMN description TEXT NOT NULL,
      ADD COLUMN host_id INTEGER NULL,
      ADD COLUMN city_id INTEGER NULL,
      ADD COLUMN state_id INTEGER NULL,
      ADD COLUMN pincode VARCHAR(255) NOT NULL DEFAULT '',
      ADD COLUMN average_rating FLOAT NULL,
      ADD COLUMN number_of_ratings INTEGER NULL;
    `);
  },

  async down (queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE hotels 
      DROP COLUMN description,
      DROP COLUMN host_id,
      DROP COLUMN city_id,
      DROP COLUMN state_id,
      DROP COLUMN pincode,
      DROP COLUMN average_rating,
      DROP COLUMN number_of_ratings;
    `);
  }
};
