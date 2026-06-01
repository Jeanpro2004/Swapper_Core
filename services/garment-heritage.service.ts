import { createGarmentHeritageEvent } from "@/models/heritage.model";
import { MatchStatus } from "@/types/match";

type RecordGarmentRegisteredInput = {
  garmentId: string;
  actorUserId: string;
  garmentTitle: string;
};

type RecordMatchCreatedInput = {
  matchId: string;
  userAId: string;
  userBId: string;
  userAGarmentId: string;
  userBGarmentId: string;
};

type RecordMatchStatusInput = {
  matchId: string;
  actorUserId: string;
  userAId: string;
  userBId: string;
  userAGarmentId: string;
  userBGarmentId: string;
  nextStatus: MatchStatus;
};

function getMatchStatusEventType(status: MatchStatus) {
  if (status === "accepted") {
    return "match_accepted" as const;
  }

  if (status === "rejected") {
    return "match_rejected" as const;
  }

  if (status === "cancelled") {
    return "match_cancelled" as const;
  }

  if (status === "completed") {
    return "exchange_completed" as const;
  }

  return null;
}

function getMatchStatusDescription(status: MatchStatus) {
  const descriptions: Record<MatchStatus, string> = {
    pending: "El match se mantiene pendiente.",
    accepted: "El intercambio fue aceptado.",
    rejected: "El intercambio fue rechazado.",
    cancelled: "El intercambio fue cancelado.",
    completed: "El intercambio fue completado.",
  };

  return descriptions[status];
}

export async function recordGarmentRegisteredEvent({
  garmentId,
  actorUserId,
  garmentTitle,
}: RecordGarmentRegisteredInput) {
  return createGarmentHeritageEvent({
    garment_id: garmentId,
    actor_user_id: actorUserId,
    event_type: "garment_registered",
    description: `La prenda "${garmentTitle}" fue registrada en el armario.`,
    metadata: {
      garmentTitle,
    },
  });
}

export async function recordMatchCreatedEvents({
  matchId,
  userAId,
  userBId,
  userAGarmentId,
  userBGarmentId,
}: RecordMatchCreatedInput) {
  await createGarmentHeritageEvent({
    garment_id: userAGarmentId,
    actor_user_id: userAId,
    related_user_id: userBId,
    match_id: matchId,
    event_type: "match_created",
    description: "Esta prenda generó un match de intercambio.",
    metadata: {
      pairedGarmentId: userBGarmentId,
    },
  });

  await createGarmentHeritageEvent({
    garment_id: userBGarmentId,
    actor_user_id: userBId,
    related_user_id: userAId,
    match_id: matchId,
    event_type: "match_created",
    description: "Esta prenda generó un match de intercambio.",
    metadata: {
      pairedGarmentId: userAGarmentId,
    },
  });
}

export async function recordMatchStatusEvents({
  matchId,
  actorUserId,
  userAId,
  userBId,
  userAGarmentId,
  userBGarmentId,
  nextStatus,
}: RecordMatchStatusInput) {
  const eventType = getMatchStatusEventType(nextStatus);

  if (!eventType) {
    return;
  }

  const description = getMatchStatusDescription(nextStatus);

  await createGarmentHeritageEvent({
    garment_id: userAGarmentId,
    actor_user_id: actorUserId,
    related_user_id: userBId,
    match_id: matchId,
    event_type: eventType,
    description,
    metadata: {
      nextStatus,
      pairedGarmentId: userBGarmentId,
    },
  });

  await createGarmentHeritageEvent({
    garment_id: userBGarmentId,
    actor_user_id: actorUserId,
    related_user_id: userAId,
    match_id: matchId,
    event_type: eventType,
    description,
    metadata: {
      nextStatus,
      pairedGarmentId: userAGarmentId,
    },
  });
}