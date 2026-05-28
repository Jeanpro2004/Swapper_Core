import { MatchStatus } from "@/types/match";

const VALID_MATCH_STATUSES: MatchStatus[] = [
  "pending",
  "accepted",
  "rejected",
  "cancelled",
  "completed",
];

const ALLOWED_TRANSITIONS: Record<MatchStatus, MatchStatus[]> = {
  pending: ["accepted", "rejected", "cancelled"],
  accepted: ["completed", "cancelled"],
  rejected: [],
  cancelled: [],
  completed: [],
};

export function isValidMatchStatus(value: unknown): value is MatchStatus {
  return (
    typeof value === "string" &&
    VALID_MATCH_STATUSES.includes(value as MatchStatus)
  );
}

export function validateMatchStatusPayload(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return "El cuerpo de la petición es inválido.";
  }

  const body = payload as { status?: unknown };

  if (!isValidMatchStatus(body.status)) {
    return "El estado enviado no es válido.";
  }

  return null;
}

export function canTransitionMatchStatus(
  currentStatus: MatchStatus,
  nextStatus: MatchStatus
) {
  return ALLOWED_TRANSITIONS[currentStatus].includes(nextStatus);
}