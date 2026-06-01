"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import {
  RecommendedGarment,
  RecommendationStyle,
  StyleRecommendationProfile,
} from "@/types/recommendation";

function getStyleName(
  styles: RecommendationStyle | RecommendationStyle[] | null
) {
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

export default function StyleRecommendations() {
  const supabase = createClient();

  const [profile, setProfile] =
    useState<StyleRecommendationProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecommendations() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setLoading(false);
        return;
      }

      const response = await fetch("/api/core/recommendations", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        setLoading(false);
        return;
      }

      const data = await response.json();

      setProfile(data);
      setLoading(false);
    }

    loadRecommendations();
  }, [supabase]);

  if (loading) {
    return <p>Cargando recomendaciones...</p>;
  }

  if (!profile || profile.totalUserGarments === 0) {
    return (
      <section className="info-card" aria-label="Sin recomendaciones">
        <h2>No hay suficientes datos para recomendar</h2>
        <p>
          Registra prendas en tu armario para que Swapper pueda entender tu
          estilo y generar recomendaciones.
        </p>
      </section>
    );
  }

  if (profile.recommendations.length === 0) {
    return (
      <section className="info-card" aria-label="Sin prendas recomendadas">
        <h2>No hay prendas disponibles para recomendar</h2>
        <p>
          Cuando otros usuarios registren prendas disponibles, Swapper podrá
          sugerirte opciones compatibles con tu estilo.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Recomendaciones de estilo">
      <article className="info-card">
        <h2>Resumen de recomendación</h2>
        <p>
          Tu estilo dominante actual es{" "}
          <strong>{profile.dominantStyleName ?? "No definido"}</strong>.
        </p>
        <p>
          Tallas frecuentes:{" "}
          <strong>{profile.frequentSizes.join(", ") || "No definidas"}</strong>
        </p>
      </article>

      <div className="card-grid">
        {profile.recommendations.map((garment: RecommendedGarment) => (
          <article className="garment-card" key={garment.id}>
            <header>
              <h3>{garment.title}</h3>
              <p>{garment.description || "Sin descripción"}</p>
            </header>

            <dl>
              <div>
                <dt>Marca</dt>
                <dd>{garment.brand || "No especificada"}</dd>
              </div>

              <div>
                <dt>Talla</dt>
                <dd>{garment.size}</dd>
              </div>

              <div>
                <dt>Estado</dt>
                <dd>{formatCondition(garment.condition)}</dd>
              </div>

              <div>
                <dt>Estilo</dt>
                <dd>{getStyleName(garment.styles)}</dd>
              </div>

              <div>
                <dt>Score</dt>
                <dd>{garment.recommendationScore}</dd>
              </div>
            </dl>

            <section aria-label="Razones de recomendación">
              <h4>Por qué te recomendamos esta prenda</h4>
              <ul>
                {garment.recommendationReasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </section>
          </article>
        ))}
      </div>
    </section>
  );
}