import { NextRequest } from "next/server";
import { indexHeritageController } from "@/controllers/heritage.controller";

export async function GET(request: NextRequest) {
  return indexHeritageController(request);
}