import { createClient } from "@/lib/supabase/server";

export async function getProfileById(id: string) {
  const supabase = await createClient();

  return supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
}