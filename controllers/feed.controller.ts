import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import { getDiscoverableGarments } from "@/models/feed.model";

export async function indexFeedController(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no autenticado." },
      { status: 401 }
    );
  }

  const { data, error } = await getDiscoverableGarments(user.id);

  if (error) {
    return NextResponse.json(
      { error: "No se pudo cargar el feed de prendas." },
      { status: 400 }
    );
  }

  return NextResponse.json(data ?? [], { status: 200 });
}