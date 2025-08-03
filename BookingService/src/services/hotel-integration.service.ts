import axios from 'axios';
import { serverConfig } from '../config';

interface RoomInfo {
    id: number;
    hotelId: number;
    roomType: string;
    pricePerNight: number;
    roomCount: number;
}

interface HotelServiceResponse {
    success: boolean;
    data: RoomInfo[];
}

export class HotelIntegrationService {
    private static instance: HotelIntegrationService;
    private hotelServiceUrl: string;

    private constructor() {
        this.hotelServiceUrl = serverConfig.HOTEL_SERVICE_URL || 'http://localhost:3002';
    }

    public static getInstance(): HotelIntegrationService {
        if (!HotelIntegrationService.instance) {
            HotelIntegrationService.instance = new HotelIntegrationService();
        }
        return HotelIntegrationService.instance;
    }

    async getRoomInfo(roomId: number): Promise<RoomInfo | null> {
        try {
            const response = await axios.get<HotelServiceResponse>(
                `${this.hotelServiceUrl}/api/v1/hotels/rooms/${roomId}`
            );

            if (response.data.success && response.data.data.length > 0) {
                return response.data.data[0];
            }
            return null;
        } catch (error) {
            console.error('Failed to fetch room info from HotelService:', error);
            // Return mock data for now
            return this.getMockRoomInfo(roomId);
        }
    }

    async getAvailableRooms(hotelId: number, checkInDate: string, checkOutDate: string, roomType?: string): Promise<RoomInfo[]> {
        try {
            const params = new URLSearchParams({
                hotelId: hotelId.toString(),
                checkInDate,
                checkOutDate,
                ...(roomType && { roomType })
            });

            const response = await axios.get<HotelServiceResponse>(
                `${this.hotelServiceUrl}/api/v1/hotels/${hotelId}/rooms/available?${params}`
            );

            if (response.data.success) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error('Failed to fetch available rooms from HotelService:', error);
            // Return mock data for now
            return this.getMockAvailableRooms(hotelId, roomType);
        }
    }

    private getMockRoomInfo(roomId: number): RoomInfo {
        const mockRooms: { [key: number]: RoomInfo } = {
            1: { id: 1, hotelId: 1, roomType: 'SINGLE', pricePerNight: 100, roomCount: 1 },
            2: { id: 2, hotelId: 1, roomType: 'DOUBLE', pricePerNight: 150, roomCount: 1 },
            3: { id: 3, hotelId: 1, roomType: 'FAMILY', pricePerNight: 200, roomCount: 1 },
            4: { id: 4, hotelId: 1, roomType: 'DELUXE', pricePerNight: 300, roomCount: 1 },
            5: { id: 5, hotelId: 1, roomType: 'SUITE', pricePerNight: 500, roomCount: 1 }
        };

        return mockRooms[roomId] || { id: roomId, hotelId: 1, roomType: 'STANDARD', pricePerNight: 150, roomCount: 1 };
    }

    private getMockAvailableRooms(hotelId: number, roomType?: string): RoomInfo[] {
        const mockRooms: RoomInfo[] = [
            { id: 1, hotelId, roomType: 'SINGLE', pricePerNight: 100, roomCount: 1 },
            { id: 2, hotelId, roomType: 'DOUBLE', pricePerNight: 150, roomCount: 1 },
            { id: 3, hotelId, roomType: 'FAMILY', pricePerNight: 200, roomCount: 1 },
            { id: 4, hotelId, roomType: 'DELUXE', pricePerNight: 300, roomCount: 1 },
            { id: 5, hotelId, roomType: 'SUITE', pricePerNight: 500, roomCount: 1 }
        ];

        if (roomType) {
            return mockRooms.filter(room => room.roomType === roomType);
        }

        return mockRooms;
    }
} 