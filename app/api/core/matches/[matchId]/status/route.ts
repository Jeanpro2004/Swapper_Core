import { NextRequest } from "next/server";
import { updateMatchStatusController } from "@/controllers/match.controller";

type RouteContext = {
  params: Promise<{ matchId: string }>;
};

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const { matchId } = await context.params;

  return updateMatchStatusController(request, matchId);
}