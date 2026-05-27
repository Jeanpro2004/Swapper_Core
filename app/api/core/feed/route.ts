import { NextRequest } from "next/server";
import { indexFeedController } from "@/controllers/feed.controller";

export async function GET(request: NextRequest) {
  return indexFeedController(request);
}