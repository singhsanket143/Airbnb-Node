import { QueryInterface } from "sequelize";

module.exports = {
  async up (queryInterface: QueryInterface) {
    await queryInterface.addConstraint('rooms', {
      fields: ['roomTypeId'],
      type: 'foreign key',
      name: 'fk_rooms_room_types',
      references: {
        table: 'roomtypes',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });

    await queryInterface.addConstraint('rooms', {
      fields: ['hotelId'],
      type: 'foreign key',
      name: 'fk_rooms_hotels',
      references: {
        table: 'hotels',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  async down (queryInterface: QueryInterface) {
    await queryInterface.removeConstraint('rooms', 'fk_rooms_room_types');
    await queryInterface.removeConstraint('rooms', 'fk_rooms_hotels');
  }
};
