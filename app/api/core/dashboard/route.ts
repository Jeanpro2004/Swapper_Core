import { NextRequest } from "next/server";
import { showCoreDashboardController } from "@/controllers/core-dashboard.controller";

export async function GET(request: NextRequest) {
  return showCoreDashboardController(request);
}