import { createClient } from "@/lib/supabase/server";

type CreateGarmentInterestData = {
  interested_user_id: string;
  garment_id: string;
  garment_owner_id: string;
};

export async function getGarmentOwnerSnapshot(garmentId: string) {
  const supabase = await createClient();

  return supabase
    .from("garments")
    .select("id, owner_id")
    .eq("id", garmentId)
    .single();
}

export async function getGarmentInterestByUserAndGarment(
  interestedUserId: string,
  garmentId: string
) {
  const supabase = await createClient();

  return supabase
    .from("garment_interests")
    .select("*")
    .eq("interested_user_id", interestedUserId)
    .eq("garment_id", garmentId)
    .maybeSingle();
}

export async function createGarmentInterest(
  data: CreateGarmentInterestData
) {
  const supabase = await createClient();

  return supabase
    .from("garment_interests")
    .insert({
      interested_user_id: data.interested_user_id,
      garment_id: data.garment_id,
      garment_owner_id: data.garment_owner_id,
    })
    .select()
    .single();
}

export async function deleteGarmentInterest(
  interestedUserId: string,
  garmentId: string
) {
  const supabase = await createClient();

  return supabase
    .from("garment_interests")
    .delete()
    .eq("interested_user_id", interestedUserId)
    .eq("garment_id", garmentId);
}

export async function getInterestGarmentIdsByUser(userId: string) {
  const supabase = await createClient();

  return supabase
    .from("garment_interests")
    .select("garment_id")
    .eq("interested_user_id", userId);
}