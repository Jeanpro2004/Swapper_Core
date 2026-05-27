"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Garment } from "@/types/garment";
import { createClient } from "@/lib/supabase/browser";

type GarmentCardProps = {
  garment: Garment;
};

export default function GarmentCard({ garment }: GarmentCardProps) {
  const router = useRouter();
  const supabase = createClient();

  async function handleDelete() {
    const confirmDelete = confirm("¿Seguro que deseas eliminar esta prenda?");
    if (!confirmDelete) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      alert("Usuario no autenticado.");
      return;
    }

    const response = await fetch(`/api/garments/${garment.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();

      try {
        const errorData = JSON.parse(text);
        alert(errorData.error || "No se pudo eliminar.");
      } catch {
        alert(text || "No se pudo eliminar.");
      }

      return;
    }

    alert("Prenda eliminada correctamente.");
    router.refresh();
    window.location.href = "/wardrobe";
  }

  return (
    <article className="garment-card">
      <h3>{garment.title}</h3>

      <p>{garment.description || "Sin descripción"}</p>

      <p>
        <strong>Talla:</strong> {garment.size}
      </p>

      <p>
        <strong>Marca:</strong> {garment.brand || "No especificada"}
      </p>

      <p>
        <strong>Estado:</strong> {garment.condition}
      </p>

      <div className="card-actions">
        <Link href={`/wardrobe/${garment.id}/edit`} className="primary-btn">
          Editar
        </Link>

        <button type="button" className="text-btn" onClick={handleDelete}>
          Eliminar
        </button>
      </div>
    </article>
  );
}