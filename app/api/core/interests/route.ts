import { NextRequest } from "next/server";
import { storeGarmentInterestController } from "@/controllers/garment-interest.controller";

export async function POST(request: NextRequest) {
  return storeGarmentInterestController(request);
}