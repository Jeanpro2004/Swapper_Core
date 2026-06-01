import { createClient } from "@/lib/supabase/server";
import { CreateGarmentHeritageEventData } from "@/types/heritage";

export async function createGarmentHeritageEvent(
  data: CreateGarmentHeritageEventData
) {
  const supabase = await createClient();

  return supabase
    .from("garment_heritage_events")
    .insert({
      garment_id: data.garment_id,
      actor_user_id: data.actor_user_id,
      related_user_id: data.related_user_id ?? null,
      match_id: data.match_id ?? null,
      event_type: data.event_type,
      description: data.description,
      metadata: data.metadata ?? {},
    })
    .select("*")
    .single();
}

export async function getGarmentIdsByOwner(ownerId: string) {
  const supabase = await createClient();

  return supabase
    .from("garments")
    .select("id")
    .eq("owner_id", ownerId);
}

export async function getHeritageEventsByGarmentIds(garmentIds: string[]) {
  const supabase = await createClient();

  if (garmentIds.length === 0) {
    return {
      data: [],
      error: null,
    };
  }

  return supabase
    .from("garment_heritage_events")
    .select(`
      id,
      garment_id,
      actor_user_id,
      related_user_id,
      match_id,
      event_type,
      description,
      metadata,
      created_at,
      garments (
        id,
        title,
        brand,
        size,
        condition,
        style_id,
        styles (
          id,
          name
        )
      )
    `)
    .in("garment_id", garmentIds)
    .order("created_at", { ascending: false });
}