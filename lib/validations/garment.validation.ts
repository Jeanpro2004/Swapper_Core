import { GarmentPayload } from "@/types/garment";

const VALID_CONDITIONS = ["new", "almost_new", "used"];
const VALID_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export function validateGarmentPayload(payload: GarmentPayload) {
  if (!payload.title || payload.title.trim().length < 3) {
    return "El nombre de la prenda debe tener al menos 3 caracteres.";
  }

  if (!payload.size || !VALID_SIZES.includes(payload.size)) {
    return "La talla seleccionada no es válida.";
  }

  if (!payload.condition || !VALID_CONDITIONS.includes(payload.condition)) {
    return "El estado de la prenda no es válido.";
  }

  if (!payload.style_id) {
    return "Debe seleccionar un estilo válido para la prenda.";
  }

  return null;
}