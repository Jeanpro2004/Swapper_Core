import { createClient } from "@/lib/supabase/server";

export async function getGarmentsForStyleProfile(ownerId: string) {
  const supabase = await createClient();

  return supabase
    .from("garments")
    .select(`
      id,
      title,
      style_id,
      styles (
        id,
        name
      )
    `)
    .eq("owner_id", ownerId)
    .not("style_id", "is", null);
}