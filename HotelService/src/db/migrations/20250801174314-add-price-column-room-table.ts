"use strict";

import { QueryInterface, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
		await queryInterface.sequelize.query(
			`ALTER TABLE rooms 
            ADD COLUMN price INTEGER NOT NULL DEFAULT 10000;`
		);
	},

	async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
		await queryInterface.sequelize.query(`
            ALTER TABLE rooms 
            DROP COLUMN price;`);
	},
};
