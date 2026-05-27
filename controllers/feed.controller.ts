import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import { getDiscoverableGarments } from "@/models/feed.model";
import { getInterestGarmentIdsByUser } from "@/models/garment-interest.model";

export async function indexFeedController(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no autenticado." },
      { status: 401 }
    );
  }

  const { data: garments, error: garmentsError } =
    await getDiscoverableGarments(user.id);

  if (garmentsError) {
    return NextResponse.json(
      { error: "No se pudo cargar el feed de prendas." },
      { status: 400 }
    );
  }

  const { data: interests, error: interestsError } =
    await getInterestGarmentIdsByUser(user.id);

  if (interestsError) {
    return NextResponse.json(
      { error: "No se pudo cargar el estado de intereses." },
      { status: 400 }
    );
  }

  const interestedGarmentIds = new Set(
    (interests ?? []).map((interest) => interest.garment_id)
  );

  const feed = (garments ?? []).map((garment) => ({
    ...garment,
    hasInterest: interestedGarmentIds.has(garment.id),
  }));

  return NextResponse.json(feed, { status: 200 });
}