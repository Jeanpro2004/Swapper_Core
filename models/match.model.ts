import { createClient } from "@/lib/supabase/server";

type CreateSwapMatchData = {
  user_a_id: string;
  user_b_id: string;
  user_a_garment_id: string;
  user_b_garment_id: string;
};

export async function getExistingSwapMatch(
  userAId: string,
  userBId: string,
  userAGarmentId: string,
  userBGarmentId: string
) {
  const supabase = await createClient();

  const directMatch = await supabase
    .from("swap_matches")
    .select("*")
    .eq("user_a_id", userAId)
    .eq("user_b_id", userBId)
    .eq("user_a_garment_id", userAGarmentId)
    .eq("user_b_garment_id", userBGarmentId)
    .maybeSingle();

  if (directMatch.data) {
    return directMatch;
  }

  return supabase
    .from("swap_matches")
    .select("*")
    .eq("user_a_id", userBId)
    .eq("user_b_id", userAId)
    .eq("user_a_garment_id", userBGarmentId)
    .eq("user_b_garment_id", userAGarmentId)
    .maybeSingle();
}

export async function createSwapMatch(data: CreateSwapMatchData) {
  const supabase = await createClient();

  return supabase
    .from("swap_matches")
    .insert({
      user_a_id: data.user_a_id,
      user_b_id: data.user_b_id,
      user_a_garment_id: data.user_a_garment_id,
      user_b_garment_id: data.user_b_garment_id,
      status: "pending",
    })
    .select("*")
    .single();
}

export async function getSwapMatchesByUser(userId: string) {
  const supabase = await createClient();

  return supabase
    .from("swap_matches")
    .select(`
      id,
      user_a_id,
      user_b_id,
      user_a_garment_id,
      user_b_garment_id,
      status,
      created_at,
      updated_at,
      user_a_garment:garments!swap_matches_user_a_garment_id_fkey (
        id,
        title,
        description,
        size,
        brand,
        condition,
        style_id,
        styles (
          id,
          name
        )
      ),
      user_b_garment:garments!swap_matches_user_b_garment_id_fkey (
        id,
        title,
        description,
        size,
        brand,
        condition,
        style_id,
        styles (
          id,
          name
        )
      )
    `)
    .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
    .order("created_at", { ascending: false });
}