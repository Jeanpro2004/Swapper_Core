export type Garment = {
  id: string;
  owner_id?: string | null;
  title: string;
  description?: string | null;
  size: string;
  brand?: string | null;
  condition: string;
  style_id?: string | null;
  is_available?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type GarmentPayload = {
  title: string;
  description?: string;
  size: string;
  brand?: string;
  condition: string;
  style_id: string;
};