"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import GarmentForm from "@/components/garments/GarmentForm";
import { Garment } from "@/types/garment";
import { Style } from "@/types/style";
import { createClient } from "@/lib/supabase/browser";

export default function EditGarmentPage() {
  const params = useParams<{ id: string }>();
  const supabase = createClient();

  const [garment, setGarment] = useState<Garment | null>(null);
  const [styles, setStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setLoading(false);
        return;
      }

      const [garmentResponse, stylesResponse] = await Promise.all([
        fetch(`/api/garments/${params.id}`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }),
        fetch("/api/styles"),
      ]);

      if (garmentResponse.ok) {
        const garmentData = await garmentResponse.json();
        setGarment(garmentData);
      }

      if (stylesResponse.ok) {
        const stylesData = await stylesResponse.json();
        setStyles(stylesData);
      }

      setLoading(false);
    }

    loadData();
  }, [params.id, supabase]);

  if (loading) {
    return (
      <section className="page-section">
        <div className="container">
          <h1>Cargando prenda...</h1>
        </div>
      </section>
    );
  }

  if (!garment) {
    return (
      <section className="page-section">
        <div className="container">
          <h1>Prenda no encontrada</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="container">
        <h1>Editar prenda</h1>
        <GarmentForm initialData={garment} mode="edit" styles={styles} />
      </div>
    </section>
  );
}