import { createClient } from "@/lib/supabase/server";
import { MatchStatus } from "@/types/match";

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

export async function getSwapMatchById(matchId: string) {
  const supabase = await createClient();

  return supabase
    .from("swap_matches")
    .select("*")
    .eq("id", matchId)
    .single();
}

export async function updateSwapMatchStatus(
  matchId: string,
  status: MatchStatus
) {
  const supabase = await createClient();

  return supabase
    .from("swap_matches")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", matchId)
    .select("*")
    .single();
}
export async function getSwapMatchesByStatuses(statuses: MatchStatus[]) {
  const supabase = await createClient();

  return supabase
    .from("swap_matches")
    .select(`
      id,
      status,
      user_a_garment_id,
      user_b_garment_id
    `)
    .in("status", statuses);
}

export async function getSwapMatchesByGarmentIdsAndStatuses(
  garmentIds: string[],
  statuses: MatchStatus[]
) {
  const supabase = await createClient();

  if (garmentIds.length === 0) {
    return {
      data: [],
      error: null,
    };
  }

  const inFilter = `(${garmentIds.join(",")})`;

  return supabase
    .from("swap_matches")
    .select(`
      id,
      status,
      user_a_garment_id,
      user_b_garment_id
    `)
    .in("status", statuses)
    .or(
      `user_a_garment_id.in.${inFilter},user_b_garment_id.in.${inFilter}`
    );
}

export async function updateGarmentsAvailability(
  garmentIds: string[],
  isAvailable: boolean
) {
  const supabase = await createClient();

  if (garmentIds.length === 0) {
    return {
      data: [],
      error: null,
    };
  }

  return supabase
    .from("garments")
    .update({
      is_available: isAvailable,
      updated_at: new Date().toISOString(),
    })
    .in("id", garmentIds)
    .select("id, title, is_available");
}