import { NextRequest } from "next/server";
import { destroyGarmentInterestController } from "@/controllers/garment-interest.controller";

type RouteContext = {
  params: Promise<{ garmentId: string }>;
};

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const { garmentId } = await context.params;

  return destroyGarmentInterestController(request, garmentId);
}