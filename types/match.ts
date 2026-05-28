export type MatchStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "completed";

export type MatchGarment = {
  id: string;
  title: string;
  description: string | null;
  size: string;
  brand: string | null;
  condition: string;
  style_id: string | null;
  styles:
    | {
        id: string;
        name: string;
      }
    | {
        id: string;
        name: string;
      }[]
    | null;
};

export type SwapMatch = {
  id: string;
  user_a_id: string;
  user_b_id: string;
  user_a_garment_id: string;
  user_b_garment_id: string;
  status: MatchStatus;
  created_at: string;
  updated_at: string | null;
};

export type SwapMatchWithGarments = SwapMatch & {
  user_a_garment: MatchGarment | null;
  user_b_garment: MatchGarment | null;
};

export type UpdateMatchStatusPayload = {
  status: MatchStatus;
};