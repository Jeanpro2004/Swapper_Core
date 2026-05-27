import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createGarment,
  deleteGarment,
  getAllGarments,
  getGarmentById,
  getGarmentsByOwner,
  updateGarment,
} from "@/models/garment.model";
import { validateGarmentPayload } from "@/lib/validations/garment.validation";
import { getStyleById } from "@/models/style.model";

async function getAuthenticatedUser(req: NextRequest) {
  const supabase = await createClient();

  const token = req.headers
    .get("authorization")
    ?.replace("Bearer ", "");

  if (!token) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  return user;
}

export async function indexGarmentsController(req: NextRequest) {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no autenticado." },
      { status: 401 }
    );
  }

  const { data, error } = await getGarmentsByOwner(user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function indexAllGarmentsController() {
  const { data, error } = await getAllGarments();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function showGarmentController(req: NextRequest, id: string) {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no autenticado." },
      { status: 401 }
    );
  }

  const { data, error } = await getGarmentById(id);

  if (error || !data) {
    return NextResponse.json(
      { error: "Prenda no encontrada." },
      { status: 404 }
    );
  }

  if (data.owner_id !== user.id) {
    return NextResponse.json(
      { error: "No tienes permiso para ver esta prenda." },
      { status: 403 }
    );
  }

  return NextResponse.json(data, { status: 200 });
}

async function validateStyleExists(styleId: string) {
  const { data: style, error } = await getStyleById(styleId);

  if (error || !style) {
    return false;
  }

  return true;
}

export async function storeGarmentController(req: NextRequest) {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no autenticado." },
      { status: 401 }
    );
  }

  const body = await req.json();

  const validationError = validateGarmentPayload(body);

  if (validationError) {
    return NextResponse.json(
      { error: validationError },
      { status: 400 }
    );
  }

  const styleExists = await validateStyleExists(body.style_id);

  if (!styleExists) {
    return NextResponse.json(
      { error: "El estilo seleccionado no existe en la base de datos." },
      { status: 400 }
    );
  }

  const { data, error } = await createGarment({
    owner_id: user.id,
    title: body.title,
    description: body.description,
    size: body.size,
    brand: body.brand,
    condition: body.condition,
    style_id: body.style_id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function updateGarmentController(
  req: NextRequest,
  id: string
) {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no autenticado." },
      { status: 401 }
    );
  }

  const existingGarment = await getGarmentById(id);

  if (existingGarment.error || !existingGarment.data) {
    return NextResponse.json(
      { error: "Prenda no encontrada." },
      { status: 404 }
    );
  }

  if (existingGarment.data.owner_id !== user.id) {
    return NextResponse.json(
      { error: "No tienes permiso para editar esta prenda." },
      { status: 403 }
    );
  }

  const body = await req.json();

  const validationError = validateGarmentPayload(body);

  if (validationError) {
    return NextResponse.json(
      { error: validationError },
      { status: 400 }
    );
  }

  const styleExists = await validateStyleExists(body.style_id);

  if (!styleExists) {
    return NextResponse.json(
      { error: "El estilo seleccionado no existe en la base de datos." },
      { status: 400 }
    );
  }

  const { data, error } = await updateGarment(id, {
    title: body.title,
    description: body.description,
    size: body.size,
    brand: body.brand,
    condition: body.condition,
    style_id: body.style_id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function destroyGarmentController(
  req: NextRequest,
  id: string
) {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no autenticado." },
      { status: 401 }
    );
  }

  const existingGarment = await getGarmentById(id);

  if (existingGarment.error || !existingGarment.data) {
    return NextResponse.json(
      { error: "Prenda no encontrada." },
      { status: 404 }
    );
  }

  if (existingGarment.data.owner_id !== user.id) {
    return NextResponse.json(
      { error: "No tienes permiso para eliminar esta prenda." },
      { status: 403 }
    );
  }

  const { error } = await deleteGarment(id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(
    { message: "Garment deleted successfully" },
    { status: 200 }
  );
}