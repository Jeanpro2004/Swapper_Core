import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import { getSwapMatchesByUser } from "@/models/match.model";

export async function indexMatchesController(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no autenticado." },
      { status: 401 }
    );
  }

  const { data, error } = await getSwapMatchesByUser(user.id);

  if (error) {
    return NextResponse.json(
      { error: "No se pudieron cargar los matches." },
      { status: 400 }
    );
  }

  return NextResponse.json(data ?? [], { status: 200 });
}