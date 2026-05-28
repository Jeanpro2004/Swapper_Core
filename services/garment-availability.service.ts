import { getSwapMatchesByStatuses } from "@/models/match.model";
import { MatchStatus } from "@/types/match";

const LOCKED_MATCH_STATUSES: MatchStatus[] = [
  "pending",
  "accepted",
  "completed",
];

type LockedMatchRow = {
  user_a_garment_id: string | null;
  user_b_garment_id: string | null;
};

function extractLockedGarmentIds(matches: LockedMatchRow[]) {
  const lockedGarmentIds = new Set<string>();

  matches.forEach((match) => {
    if (match.user_a_garment_id) {
      lockedGarmentIds.add(match.user_a_garment_id);
    }

    if (match.user_b_garment_id) {
      lockedGarmentIds.add(match.user_b_garment_id);
    }
  });

  return Array.from(lockedGarmentIds);
}

export async function getLockedGarmentIdsForExchange() {
  const { data, error } = await getSwapMatchesByStatuses(
    LOCKED_MATCH_STATUSES
  );

  if (error) {
    return {
      lockedGarmentIds: [],
      error,
    };
  }

  const lockedGarmentIds = extractLockedGarmentIds(data ?? []);

  return {
    lockedGarmentIds,
    error: null,
  };
}

export async function isGarmentAvailableForExchange(garmentId: string) {
  const { lockedGarmentIds, error } = await getLockedGarmentIdsForExchange();

  if (error) {
    return {
      available: false,
      error,
    };
  }

  return {
    available: !lockedGarmentIds.includes(garmentId),
    error: null,
  };
}

export async function areGarmentsAvailableForExchange(garmentIds: string[]) {
  const { lockedGarmentIds, error } = await getLockedGarmentIdsForExchange();

  if (error) {
    return {
      available: false,
      lockedGarmentIds: [],
      error,
    };
  }

  const hasLockedGarment = garmentIds.some((garmentId) =>
    lockedGarmentIds.includes(garmentId)
  );

  return {
    available: !hasLockedGarment,
    lockedGarmentIds,
    error: null,
  };
}