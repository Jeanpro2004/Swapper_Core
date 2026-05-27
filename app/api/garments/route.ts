import { NextRequest } from "next/server";
import {
  indexGarmentsController,
  storeGarmentController,
} from "@/controllers/garment.controller";

export async function GET(request: NextRequest) {
  return indexGarmentsController(request);
}

export async function POST(request: NextRequest) {
  return storeGarmentController(request);
}