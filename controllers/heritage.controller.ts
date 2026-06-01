import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import {
  getGarmentIdsByOwner,
  getHeritageEventsByGarmentIds,
} from "@/models/heritage.model";

export async function indexHeritageController(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no autenticado." },
      { status: 401 }
    );
  }

  const { data: garments, error: garmentsError } =
    await getGarmentIdsByOwner(user.id);

  if (garmentsError) {
    return NextResponse.json(
      { error: "No se pudieron cargar las prendas del usuario." },
      { status: 400 }
    );
  }

  const garmentIds = (garments ?? []).map((garment) => garment.id);

  const { data: events, error: eventsError } =
    await getHeritageEventsByGarmentIds(garmentIds);

  if (eventsError) {
    return NextResponse.json(
      { error: "No se pudo cargar el historial de prendas." },
      { status: 400 }
    );
  }

  return NextResponse.json(events ?? [], { status: 200 });
}