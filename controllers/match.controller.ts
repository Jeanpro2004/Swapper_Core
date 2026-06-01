import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import {
  getSwapMatchesByUser,
  getSwapMatchById,
  updateSwapMatchStatus,
  updateGarmentsAvailability,
} from "@/models/match.model";
import {
  canTransitionMatchStatus,
  validateMatchStatusPayload,
} from "@/lib/validations/match-status.validation";
import { MatchStatus } from "@/types/match";
import { recordMatchStatusEvents } from "@/services/garment-heritage.service";

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

export async function updateMatchStatusController(
  request: NextRequest,
  matchId: string
) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no autenticado." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);

  const validationError = validateMatchStatusPayload(body);

  if (validationError) {
    return NextResponse.json(
      { error: validationError },
      { status: 400 }
    );
  }

  const nextStatus = body.status as MatchStatus;

  const { data: match, error: matchError } = await getSwapMatchById(matchId);

  if (matchError || !match) {
    return NextResponse.json(
      { error: "Match no encontrado." },
      { status: 404 }
    );
  }

  const isParticipant =
    match.user_a_id === user.id || match.user_b_id === user.id;

  if (!isParticipant) {
    return NextResponse.json(
      { error: "No tienes permiso para modificar este match." },
      { status: 403 }
    );
  }

  const currentStatus = match.status as MatchStatus;

  if (!canTransitionMatchStatus(currentStatus, nextStatus)) {
    return NextResponse.json(
      {
        error: `No se puede cambiar el estado de ${currentStatus} a ${nextStatus}.`,
      },
      { status: 409 }
    );
  }

  const { data, error } = await updateSwapMatchStatus(matchId, nextStatus);

  if (error) {
    return NextResponse.json(
      { error: "No se pudo actualizar el estado del match." },
      { status: 400 }
    );
  }

  const matchGarmentIds = [
    match.user_a_garment_id,
    match.user_b_garment_id,
  ];

  if (nextStatus === "rejected" || nextStatus === "cancelled") {
    await updateGarmentsAvailability(matchGarmentIds, true);
  }

  if (
    nextStatus === "accepted" ||
    nextStatus === "completed" ||
    nextStatus === "pending"
  ) {
    await updateGarmentsAvailability(matchGarmentIds, false);
  }

  await recordMatchStatusEvents({
  matchId: match.id,
  actorUserId: user.id,
  userAId: match.user_a_id,
  userBId: match.user_b_id,
  userAGarmentId: match.user_a_garment_id,
  userBGarmentId: match.user_b_garment_id,
  nextStatus,
});

  return NextResponse.json(data, { status: 200 });
}