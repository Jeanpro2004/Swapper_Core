import { createClient } from "@/lib/supabase/server";

export async function getDiscoverableGarments(currentUserId: string) {
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
    .order("created_at", { ascending: false });
}