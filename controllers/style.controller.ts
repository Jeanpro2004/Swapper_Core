import { NextResponse } from "next/server";
import { getAllStyles } from "@/models/style.model";

export async function indexStylesController() {
  const { data, error } = await getAllStyles();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json(data, { status: 200 });
}