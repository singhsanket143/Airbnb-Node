export type createHotelDTO = {
  name: string;
  description: string;
  hostId?: number;
  cityId?: number;
  stateId?: number;
  pincode: string;
  address: string
  averageRating?: number;
  numberOfRatings?: number;
};
