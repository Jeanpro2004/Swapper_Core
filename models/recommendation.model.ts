import { createClient } from "@/lib/supabase/server";

export async function getUserGarmentsForRecommendations(ownerId: string) {
  const supabase = await createClient();

  return supabase
    .from("garments")
    .select(`
      id,
      title,
      size,
      style_id,
      styles (
        id,
        name
      )
    `)
    .eq("owner_id", ownerId)
    .not("style_id", "is", null);
}

export async function getAvailableRecommendationCandidates(currentUserId: string) {
  const supabase = await createClient();

  return supabase
    .from("garments")
    .select(`
      id,
      title,
      description,
      size,
      brand,
      condition,
      owner_id,
      style_id,
      is_available,
      created_at,
      styles (
        id,
        name
      )
    `)
    .neq("owner_id", currentUserId)
    .eq("is_available", true)
    .not("style_id", "is", null)
    .order("created_at", { ascending: false });
}