import { NextRequest } from "next/server";
import { indexMatchesController } from "@/controllers/match.controller";

export async function GET(request: NextRequest) {
  return indexMatchesController(request);
}