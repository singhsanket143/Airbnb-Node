const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/v1';

async function testBookingService() {
    try {
        console.log('🧪 Testing Booking Service...\n');

        // Test 1: Check availability
        console.log('1. Testing availability check...');
        const availabilityResponse = await axios.get(`${BASE_URL}/bookings/availability`, {
            params: {
                hotelId: 1,
                checkInDate: '2026-04-15',
                checkOutDate: '2026-04-17',
                roomType: 'DOUBLE'
            }
        });
        console.log('✅ Availability check successful:', availabilityResponse.data);
        console.log('');

        // Test 2: Create booking
        console.log('2. Testing booking creation...');
        const bookingData = {
            userId: 1,
            hotelId: 1,
            roomId: 2,
            checkInDate: '2026-04-15',
            checkOutDate: '2026-04-17',
            totalGuests: 2
        };
        
        const createResponse = await axios.post(`${BASE_URL}/bookings`, bookingData);
        console.log('✅ Booking creation successful:', createResponse.data);
        console.log('');

        // Test 3: Confirm booking
        console.log('3. Testing booking confirmation...');
        const idempotencyKey = createResponse.data.idempotencyKey;
        const confirmResponse = await axios.post(`${BASE_URL}/bookings/confirm/${idempotencyKey}`);
        console.log('✅ Booking confirmation successful:', confirmResponse.data);
        console.log('');

        console.log('🎉 All tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

// Run the test
testBookingService(); 