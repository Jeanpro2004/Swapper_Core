"use client";

import { useEffect, useState } from "react";
import GarmentCard from "@/components/garments/GarmentCard";
import { createClient } from "@/lib/supabase/browser";
import { Garment } from "@/types/garment";

export default function WardrobeList() {
  const supabase = createClient();
  const [garments, setGarments] = useState<Garment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGarments() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setLoading(false);
        return;
      }

      const response = await fetch("/api/garments", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
    const message = await response.text();
    console.error("Error cargando prendas:", message);
    setLoading(false);
    return;
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : [];

setGarments(data);

      setLoading(false);
    }

    loadGarments();
  }, [supabase]);

  if (loading) return <p>Cargando prendas...</p>;

  if (garments.length === 0) {
    return <p>No hay prendas registradas todavía.</p>;
  }

  return (
    <div className="card-grid">
      {garments.map((garment) => (
        <GarmentCard key={garment.id} garment={garment} />
      ))}
    </div>
  );
}