import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import {
  getAvailableRecommendationCandidates,
  getUserGarmentsForRecommendations,
} from "@/models/recommendation.model";
import { buildStyleRecommendations } from "@/services/style-recommendation.service";
import {
  RecommendationGarment,
  UserStyleSignal,
} from "@/types/recommendation";

export async function indexRecommendationsController(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no autenticado." },
      { status: 401 }
    );
  }

  const { data: userGarments, error: userGarmentsError } =
    await getUserGarmentsForRecommendations(user.id);

  if (userGarmentsError) {
    return NextResponse.json(
      { error: "No se pudo analizar el armario del usuario." },
      { status: 400 }
    );
  }

  const { data: candidates, error: candidatesError } =
    await getAvailableRecommendationCandidates(user.id);

  if (candidatesError) {
    return NextResponse.json(
      { error: "No se pudieron cargar prendas recomendables." },
      { status: 400 }
    );
  }

  const recommendations = buildStyleRecommendations(
    (userGarments ?? []) as UserStyleSignal[],
    (candidates ?? []) as RecommendationGarment[]
  );

  return NextResponse.json(recommendations, { status: 200 });
}