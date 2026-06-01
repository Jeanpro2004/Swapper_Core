export type GarmentHeritageEventType =
  | "garment_registered"
  | "match_created"
  | "match_accepted"
  | "match_rejected"
  | "match_cancelled"
  | "exchange_completed";

export type HeritageGarment = {
  id: string;
  title: string;
  brand: string | null;
  size: string;
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

export type GarmentHeritageEvent = {
  id: string;
  garment_id: string;
  actor_user_id: string;
  related_user_id: string | null;
  match_id: string | null;
  event_type: GarmentHeritageEventType;
  description: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  garments?: HeritageGarment | null;
};

export type CreateGarmentHeritageEventData = {
  garment_id: string;
  actor_user_id: string;
  related_user_id?: string | null;
  match_id?: string | null;
  event_type: GarmentHeritageEventType;
  description: string;
  metadata?: Record<string, unknown>;
};