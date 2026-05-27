import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function getAuthenticatedUser(request: NextRequest) {
  const supabase = await createClient();

  const token = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  return user;
}