import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import {
  getCoreDashboardGarments,
  getCoreDashboardHeritageEvents,
  getCoreDashboardMatches,
} from "@/models/core-dashboard.model";
import { buildCoreDashboardSummary } from "@/services/core-dashboard.service";
import {
  CoreDashboardGarment,
  CoreDashboardHeritageEvent,
  CoreDashboardMatch,
} from "@/types/core-dashboard";

export async function showCoreDashboardController(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no autenticado." },
      { status: 401 }
    );
  }

  const { data: garments, error: garmentsError } =
    await getCoreDashboardGarments(user.id);

  if (garmentsError) {
    return NextResponse.json(
      { error: "No se pudieron cargar las prendas del dashboard." },
      { status: 400 }
    );
  }

  const { data: matches, error: matchesError } =
    await getCoreDashboardMatches(user.id);

  if (matchesError) {
    return NextResponse.json(
      { error: "No se pudieron cargar los matches del dashboard." },
      { status: 400 }
    );
  }

  const garmentIds = (garments ?? []).map((garment) => garment.id);

  const { data: heritageEvents, error: heritageError } =
    await getCoreDashboardHeritageEvents(garmentIds, 50);

  if (heritageError) {
    return NextResponse.json(
      { error: "No se pudo cargar el historial reciente." },
      { status: 400 }
    );
  }

  const dashboard = buildCoreDashboardSummary({
    garments: (garments ?? []) as CoreDashboardGarment[],
    matches: (matches ?? []) as CoreDashboardMatch[],
    heritageEvents: (heritageEvents ?? []) as CoreDashboardHeritageEvent[],
  });

  return NextResponse.json(dashboard, { status: 200 });
}