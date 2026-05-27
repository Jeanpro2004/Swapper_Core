"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

type GarmentInterestButtonProps = {
  garmentId: string;
  initialHasInterest?: boolean;
};

export default function GarmentInterestButton({
  garmentId,
  initialHasInterest = false,
}: GarmentInterestButtonProps) {
  const [hasInterest, setHasInterest] = useState(initialHasInterest);
  const [loading, setLoading] = useState(false);

  async function handleToggleInterest() {
    setLoading(true);

    const supabase = createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      alert("Usuario no autenticado.");
      setLoading(false);
      return;
    }

    const endpoint = hasInterest
      ? `/api/core/interests/${garmentId}`
      : "/api/core/interests";

    const method = hasInterest ? "DELETE" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: hasInterest
        ? undefined
        : JSON.stringify({
            garment_id: garmentId,
          }),
    });

    setLoading(false);

    if (!response.ok) {
      const text = await response.text();

      try {
        const errorData = JSON.parse(text);
        alert(errorData.error || "No se pudo actualizar el interés.");
      } catch {
        alert("No se pudo actualizar el interés.");
      }

      return;
    }

    setHasInterest((currentValue) => !currentValue);
  }

  return (
    <button
      type="button"
      className={hasInterest ? "secondary-btn" : "primary-btn"}
      onClick={handleToggleInterest}
      disabled={loading}
      aria-pressed={hasInterest}
    >
      {loading
        ? "Procesando..."
        : hasInterest
        ? "Quitar interés"
        : "Me interesa"}
    </button>
  );
}