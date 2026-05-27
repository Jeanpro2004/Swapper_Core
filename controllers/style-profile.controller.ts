import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import { getGarmentsForStyleProfile } from "@/models/style-profile.model";
import { buildStyleProfile } from "@/services/style-profile.service";
import { StyleProfileGarment } from "@/types/style-profile";

export async function showStyleProfileController(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no autenticado." },
      { status: 401 }
    );
  }

  const { data, error } = await getGarmentsForStyleProfile(user.id);

  if (error) {
    return NextResponse.json(
      { error: "No se pudo generar el perfil de estilo." },
      { status: 400 }
    );
  }

  const profile = buildStyleProfile(
    (data ?? []) as StyleProfileGarment[]
  );

  return NextResponse.json(profile, { status: 200 });
}