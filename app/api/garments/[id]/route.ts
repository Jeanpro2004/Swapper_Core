import { NextRequest } from "next/server";
import {
  destroyGarmentController,
  showGarmentController,
  updateGarmentController,
} from "@/controllers/garment.controller";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;

  return showGarmentController(req, id);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;

  return updateGarmentController(req, id);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;

  return destroyGarmentController(req, id);
}