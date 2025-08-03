const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/v1';

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function testBookingService() {
    console.log('🧪 Comprehensive Booking Service Testing...\n');
    
    let testCount = 0;
    let passedTests = 0;
    
    const assert = (condition, testName) => {
        testCount++;
        if (condition) {
            console.log(`✅ ${testName}`);
            passedTests++;
        } else {
            console.log(`❌ ${testName}`);
        }
    };

    try {
        // Test 1: Check availability for all room types
        console.log('1. Testing availability check for all room types...');
        const availabilityResponse = await axios.get(`${BASE_URL}/bookings/availability`, {
            params: {
                hotelId: 1,
                checkInDate: '2026-10-15',
                checkOutDate: '2026-10-20',
                roomType: 'SINGLE'
            }
        });
        assert(availabilityResponse.data.availableRooms.length > 0, 'SINGLE room availability check');
        assert(availabilityResponse.data.availableRooms[0].roomType === 'SINGLE', 'Correct room type returned');
        console.log('');

        // Test 2: Check availability without room type filter
        console.log('2. Testing availability check without room type filter...');
        const allRoomsResponse = await axios.get(`${BASE_URL}/bookings/availability`, {
            params: {
                hotelId: 1,
                checkInDate: '2026-10-15',
                checkOutDate: '2026-10-20'
            }
        });
        assert(allRoomsResponse.data.availableRooms.length >= 5, 'All room types returned');
        assert(allRoomsResponse.data.totalAvailable >= 5, 'Correct total count');
        console.log('');

        // Test 3: Create a booking
        console.log('3. Testing booking creation...');
        const bookingData = {
            userId: 5,
            hotelId: 1,
            roomId: 1,
            checkInDate: '2026-10-15',
            checkOutDate: '2026-10-20',
            totalGuests: 2
        };
        
        const createResponse = await axios.post(`${BASE_URL}/bookings`, bookingData);
        assert(createResponse.data.bookingId, 'Booking ID returned');
        assert(createResponse.data.idempotencyKey, 'Idempotency key returned');
        assert(createResponse.data.totalAmount === 500, 'Correct total amount (5 nights * 100)');
        assert(createResponse.data.totalNights === 5, 'Correct total nights');
        assert(createResponse.data.pricePerNight === 100, 'Correct price per night');
        console.log('');

        // Test 4: Confirm booking
        console.log('4. Testing booking confirmation...');
        const idempotencyKey = createResponse.data.idempotencyKey;
        const confirmResponse = await axios.post(`${BASE_URL}/bookings/confirm/${idempotencyKey}`);
        assert(confirmResponse.data.status === 'CONFIRMED', 'Booking status confirmed');
        assert(confirmResponse.data.bookingId === createResponse.data.bookingId, 'Same booking ID');
        console.log('');

        // Test 5: Test room availability after booking
        console.log('5. Testing room availability after booking...');
        const availabilityAfterBooking = await axios.get(`${BASE_URL}/bookings/availability`, {
            params: {
                hotelId: 1,
                checkInDate: '2026-10-15',
                checkOutDate: '2026-10-20',
                roomType: 'SINGLE'
            }
        });
        assert(availabilityAfterBooking.data.availableRooms.length === 0, 'Room no longer available');
        console.log('');

        // Test 6: Test validation - past date
        console.log('6. Testing validation - past date...');
        try {
            await axios.post(`${BASE_URL}/bookings`, {
                ...bookingData,
                checkInDate: '2020-01-01'
            });
            assert(false, 'Should have failed for past date');
        } catch (error) {
            assert(error.response.data.error.issues.some(i => i.message.includes('future date')), 'Correct error for past date');
        }
        console.log('');

        // Test 7: Test validation - invalid date range
        console.log('7. Testing validation - invalid date range...');
        try {
            await axios.post(`${BASE_URL}/bookings`, {
                ...bookingData,
                checkInDate: '2026-10-20',
                checkOutDate: '2026-10-15'
            });
            assert(false, 'Should have failed for invalid date range');
        } catch (error) {
            assert(error.response.data.error.issues.some(i => i.message.includes('after check-in')), 'Correct error for invalid date range');
        }
        console.log('');

        // Test 8: Test validation - invalid guests
        console.log('8. Testing validation - invalid guests...');
        try {
            await axios.post(`${BASE_URL}/bookings`, {
                ...bookingData,
                totalGuests: 0
            });
            assert(false, 'Should have failed for invalid guests');
        } catch (error) {
            assert(error.response.data.error.issues.some(i => i.message.includes('at least 1')), 'Correct error for invalid guests');
        }
        console.log('');

        // Test 9: Test booking conflict
        console.log('9. Testing booking conflict...');
        try {
            await axios.post(`${BASE_URL}/bookings`, {
                userId: 6,
                hotelId: 1,
                roomId: 1,
                checkInDate: '2026-10-16',
                checkOutDate: '2026-10-18',
                totalGuests: 2
            });
            assert(false, 'Should have failed for room conflict');
        } catch (error) {
            assert(error.response.data.error.includes('Failed to create booking'), 'Correct error for room conflict');
        }
        console.log('');

        // Test 10: Test idempotency
        console.log('10. Testing idempotency...');
        try {
            await axios.post(`${BASE_URL}/bookings/confirm/${idempotencyKey}`);
            assert(false, 'Should have failed for duplicate confirmation');
        } catch (error) {
            assert(error.response.data.error.includes('Failed to confirm booking'), 'Correct error for duplicate confirmation');
        }
        console.log('');

        // Test 11: Test different room types and pricing
        console.log('11. Testing different room types and pricing...');
        const suiteBooking = await axios.post(`${BASE_URL}/bookings`, {
            userId: 7,
            hotelId: 1,
            roomId: 5,
            checkInDate: '2026-11-01',
            checkOutDate: '2026-11-03',
            totalGuests: 2
        });
        assert(suiteBooking.data.pricePerNight === 500, 'Correct suite pricing');
        assert(suiteBooking.data.totalAmount === 1000, 'Correct suite total (2 nights * 500)');
        console.log('');

        // Test 12: Test availability with guests parameter
        console.log('12. Testing availability with guests parameter...');
        const availabilityWithGuests = await axios.get(`${BASE_URL}/bookings/availability`, {
            params: {
                hotelId: 1,
                checkInDate: '2026-12-01',
                checkOutDate: '2026-12-05',
                guests: 4
            }
        });
        assert(availabilityWithGuests.data.availableRooms.length > 0, 'Availability check with guests parameter');
        console.log('');

        console.log(`\n🎉 Test Results: ${passedTests}/${testCount} tests passed!`);
        
        if (passedTests === testCount) {
            console.log('🎊 All tests passed! The booking service is working perfectly!');
        } else {
            console.log('⚠️  Some tests failed. Please check the implementation.');
        }

    } catch (error) {
        console.error('❌ Test suite failed:', error.response?.data || error.message);
    }
}

// Run the comprehensive test
testBookingService(); 