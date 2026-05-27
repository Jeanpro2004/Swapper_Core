import { indexStylesController } from "@/controllers/style.controller";

export async function GET() {
  return indexStylesController();
}