import { NextRequest } from "next/server";
import { indexRecommendationsController } from "@/controllers/recommendation.controller";

export async function GET(request: NextRequest) {
  return indexRecommendationsController(request);
}