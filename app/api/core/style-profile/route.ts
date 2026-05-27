import { NextRequest } from "next/server";
import { showStyleProfileController } from "@/controllers/style-profile.controller";

export async function GET(request: NextRequest) {
  return showStyleProfileController(request);
}