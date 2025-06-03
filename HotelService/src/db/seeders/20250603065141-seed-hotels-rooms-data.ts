import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert('hotels', [
      {
        id: 1,
        name: 'Ocean View Hotel',
        address: '123 Beachside Lane',
        location: 'Goa',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        id: 2,
        name: 'Mountain Retreat',
        address: '456 Hilltop Road',
        location: 'Manali',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    ]);

    await queryInterface.bulkInsert('room_categories', [
      {
        hotel_id: 1,
        price: 3000,
        room_type: 'SINGLE',
        room_count: 10,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        hotel_id: 1,
        price: 5000,
        room_type: 'DOUBLE',
        room_count: 8,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        hotel_id: 2,
        price: 8000,
        room_type: 'DELUXE',
        room_count: 5,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        hotel_id: 2,
        price: 12000,
        room_type: 'SUITE',
        room_count: 2,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    ]);

    await queryInterface.bulkInsert('rooms', [
      {
        id: 1,
        hotel_id: 1,
        room_category_id: 1,
        date_of_availability: '2025-06-03',
        room_no: 1,
        booking_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        id: 2,
        hotel_id: 1,
        room_category_id: 2,
        room_no: 1,
        date_of_availability: '2025-06-04',
        booking_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        id: 3,
        hotel_id: 1,
        room_category_id: 1,
        room_no: 1,
        date_of_availability: '2025-06-05',
        booking_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        id: 4,
        hotel_id: 2,
        room_category_id: 3,
        date_of_availability: '2025-06-03',
        room_no: 1,
        booking_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        id: 5,
        hotel_id: 2,
        room_category_id: 1,
        room_no: 1,
        date_of_availability: '2025-06-04',
        booking_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        id: 6,
        hotel_id: 2,
        room_category_id: 2,
        room_no: 1,
        date_of_availability: '2025-06-05',
        booking_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('rooms', {}, {});
    await queryInterface.bulkDelete('hotels', {}, {});
    await queryInterface.bulkDelete('room_categories', {}, {});
  },
};
