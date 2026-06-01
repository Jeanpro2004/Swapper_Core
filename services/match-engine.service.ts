import {
  createSwapMatch,
  getExistingSwapMatch,
} from "@/models/match.model";
import { getLatestReciprocalInterest } from "@/models/garment-interest.model";
import { areGarmentsAvailableForExchange } from "@/services/garment-availability.service";
import { updateGarmentsAvailability } from "@/models/match.model";
import { recordMatchCreatedEvents } from "@/services/garment-heritage.service";

type TryCreateMatchInput = {
  interestedUserId: string;
  targetGarmentId: string;
  targetGarmentOwnerId: string;
};

export async function tryCreateMatchFromInterest({
  interestedUserId,
  targetGarmentId,
  targetGarmentOwnerId,
}: TryCreateMatchInput) {
  const { data: reciprocalInterest, error: reciprocalError } =
    await getLatestReciprocalInterest(
      targetGarmentOwnerId,
      interestedUserId
    );

  if (reciprocalError || !reciprocalInterest) {
    return {
      matchCreated: false,
      match: null,
    };
  }

  const currentUserGarmentId = reciprocalInterest.garment_id;

  const { data: existingMatch } = await getExistingSwapMatch(
    interestedUserId,
    targetGarmentOwnerId,
    currentUserGarmentId,
    targetGarmentId
  );

  if (existingMatch) {
    return {
      matchCreated: false,
      match: existingMatch,
    };
  }

  const availability = await areGarmentsAvailableForExchange([
    currentUserGarmentId,
    targetGarmentId,
  ]);

  if (availability.error || !availability.available) {
    return {
      matchCreated: false,
      match: null,
    };
  }

    const { data: match, error: matchError } = await createSwapMatch({
    user_a_id: interestedUserId,
    user_b_id: targetGarmentOwnerId,
    user_a_garment_id: currentUserGarmentId,
    user_b_garment_id: targetGarmentId,
    });

    if (matchError || !match) {
    return {
        matchCreated: false,
        match: null,
    };
    }

    await updateGarmentsAvailability(
    [currentUserGarmentId, targetGarmentId],
    false
    );

    await recordMatchCreatedEvents({
    matchId: match.id,
    userAId: interestedUserId,
    userBId: targetGarmentOwnerId,
    userAGarmentId: currentUserGarmentId,
    userBGarmentId: targetGarmentId,
    });

    return {
    matchCreated: true,
    match,
    };
}