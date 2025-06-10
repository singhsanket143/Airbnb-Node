import { QueryInterface } from 'sequelize';
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addConstraint('rooms', {
      type: 'foreign key',
      name: 'room_categories_fkey_constraint',
      fields: ['room_category_id'],
      references: {
        table: 'room_categories',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeConstraint(
      'rooms',
      'room_categories_fkey_constraint'
    );
  },
};
