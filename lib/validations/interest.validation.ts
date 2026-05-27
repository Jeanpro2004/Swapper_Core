import { CreateGarmentInterestPayload } from "@/types/interest";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_REGEX.test(value);
}

export function validateCreateInterestPayload(
  payload: unknown
): string | null {
  if (!payload || typeof payload !== "object") {
    return "El cuerpo de la petición es inválido.";
  }

  const body = payload as Partial<CreateGarmentInterestPayload>;

  if (!isValidUuid(body.garment_id)) {
    return "La prenda seleccionada no es válida.";
  }

  return null;
}