"use strict";

import { DataTypes, QueryInterface } from "sequelize";

const tableName = "hotels";
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn(tableName, "host_id", {
      type: DataTypes.INTEGER,
      allowNull: false,
    });
    await queryInterface.addColumn(tableName, "pincode", {
      type: DataTypes.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn(tableName, "city_id", {
      type: DataTypes.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn(tableName, "deleted_at", {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn(tableName, "host_id");
    await queryInterface.removeColumn(tableName, "pincode");
    await queryInterface.removeColumn(tableName, "city_id");
    await queryInterface.removeColumn(tableName, "deleted_at");
  },
};
