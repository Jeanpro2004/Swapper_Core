import { createClient } from "@/lib/supabase/server";

export async function getCoreDashboardGarments(ownerId: string) {
  const supabase = await createClient();

  return supabase
    .from("garments")
    .select(`
      id,
      title,
      size,
      style_id,
      is_available,
      created_at,
      styles (
        id,
        name
      )
    `)
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });
}

export async function getCoreDashboardMatches(userId: string) {
  const supabase = await createClient();

  return supabase
    .from("swap_matches")
    .select(`
      id,
      status,
      created_at
    `)
    .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
    .order("created_at", { ascending: false });
}

export async function getCoreDashboardHeritageEvents(
  garmentIds: string[],
  limit = 5
) {
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
      event_type,
      description,
      created_at,
      garments (
        id,
        title
      )
    `)
    .in("garment_id", garmentIds)
    .order("created_at", { ascending: false })
    .limit(limit);
}