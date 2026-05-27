export type GarmentInterest = {
  id: string;
  interested_user_id: string;
  garment_id: string;
  garment_owner_id: string;
  created_at: string;
};

export type CreateGarmentInterestPayload = {
  garment_id: string;
};

export type GarmentInterestResponse = {
  interested: boolean;
  garment_id: string;
};