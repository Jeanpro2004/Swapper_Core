"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { FeedGarment, FeedStyle } from "@/types/feed";
import GarmentInterestButton from "@/components/core/GarmentInterestButton";

function getStyleName(styles: FeedStyle | FeedStyle[] | null) {
  if (!styles) {
    return "Sin estilo";
  }

  if (Array.isArray(styles)) {
    return styles[0]?.name ?? "Sin estilo";
  }

  return styles.name;
}

function formatCondition(condition: string) {
  const labels: Record<string, string> = {
    new: "Nuevo",
    almost_new: "Casi nuevo",
    used: "Usado",
  };

  return labels[condition] ?? condition;
}

export default function DiscoveryFeed() {
  const supabase = createClient();

  const [garments, setGarments] = useState<FeedGarment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeed() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setLoading(false);
        return;
      }

      const response = await fetch("/api/core/feed", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        setLoading(false);
        return;
      }

      const data = await response.json();

      setGarments(data);
      setLoading(false);
    }

    loadFeed();
  }, [supabase]);

  if (loading) {
    return <p>Cargando prendas disponibles...</p>;
  }

  if (garments.length === 0) {
    return (
      <section className="info-card" aria-label="Feed vacío">
        <h2>No hay prendas disponibles todavía</h2>
        <p>
          Cuando otros usuarios registren prendas, aparecerán aquí para que
          puedas descubrir oportunidades de intercambio.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Feed de prendas disponibles">
      <div className="card-grid">
        {garments.map((garment) => (
          <article className="garment-card" key={garment.id}>
            <header>
                <h3>{garment.title}</h3>
                <p>{garment.description || "Sin descripción"}</p>
            </header>

            <dl>
                <div>
                <dt>Talla</dt>
                <dd>{garment.size}</dd>
                </div>

                <div>
                <dt>Marca</dt>
                <dd>{garment.brand || "No especificada"}</dd>
                </div>

                <div>
                <dt>Estado</dt>
                <dd>{formatCondition(garment.condition)}</dd>
                </div>

                <div>
                <dt>Estilo</dt>
                <dd>{getStyleName(garment.styles)}</dd>
                </div>
            </dl>

            <footer className="card-actions">
                <GarmentInterestButton
                garmentId={garment.id}
                initialHasInterest={garment.hasInterest}
                />
            </footer>
            </article>
        ))}
      </div>
    </section>
  );
}