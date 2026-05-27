import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import { tryCreateMatchFromInterest } from "@/services/match-engine.service";
import {
  createGarmentInterest,
  deleteGarmentInterest,
  getGarmentInterestByUserAndGarment,
  getGarmentOwnerSnapshot,
} from "@/models/garment-interest.model";
import {
  isValidUuid,
  validateCreateInterestPayload,
} from "@/lib/validations/interest.validation";

export async function storeGarmentInterestController(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no autenticado." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);

  const validationError = validateCreateInterestPayload(body);

  if (validationError) {
    return NextResponse.json(
      { error: validationError },
      { status: 400 }
    );
  }

  const garmentId = body.garment_id;

  const { data: garment, error: garmentError } =
    await getGarmentOwnerSnapshot(garmentId);

  if (garmentError || !garment || !garment.owner_id) {
    return NextResponse.json(
      { error: "La prenda seleccionada no existe." },
      { status: 404 }
    );
  }

  if (garment.owner_id === user.id) {
    return NextResponse.json(
      { error: "No puedes marcar interés en tu propia prenda." },
      { status: 409 }
    );
  }

  const { data: existingInterest } =
    await getGarmentInterestByUserAndGarment(user.id, garmentId);

  if (existingInterest) {
    return NextResponse.json(
      { error: "Ya registraste interés en esta prenda." },
      { status: 409 }
    );
  }

  const { data, error } = await createGarmentInterest({
  interested_user_id: user.id,
  garment_id: garmentId,
  garment_owner_id: garment.owner_id,
});

if (error) {
  return NextResponse.json(
    { error: "No se pudo registrar el interés." },
    { status: 400 }
  );
}

const matchResult = await tryCreateMatchFromInterest({
  interestedUserId: user.id,
  targetGarmentId: garmentId,
  targetGarmentOwnerId: garment.owner_id,
});

return NextResponse.json(
  {
    interest: data,
    matchCreated: matchResult.matchCreated,
    match: matchResult.match,
  },
  { status: 201 }
);

}

export async function destroyGarmentInterestController(
  request: NextRequest,
  garmentId: string
) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no autenticado." },
      { status: 401 }
    );
  }

  if (!isValidUuid(garmentId)) {
    return NextResponse.json(
      { error: "La prenda seleccionada no es válida." },
      { status: 400 }
    );
  }

  const { data: existingInterest } =
    await getGarmentInterestByUserAndGarment(user.id, garmentId);

  if (!existingInterest) {
    return NextResponse.json(
      { error: "No existe un interés registrado para esta prenda." },
      { status: 404 }
    );
  }

  const { error } = await deleteGarmentInterest(user.id, garmentId);

  if (error) {
    return NextResponse.json(
      { error: "No se pudo eliminar el interés." },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      interested: false,
      garment_id: garmentId,
    },
    { status: 200 }
  );
}