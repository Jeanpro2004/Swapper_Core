"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { SwapMatchWithGarments } from "@/types/match";

function getStyleName(
  styles:
    | { id: string; name: string }
    | { id: string; name: string }[]
    | null
) {
  if (!styles) {
    return "Sin estilo";
  }

  if (Array.isArray(styles)) {
    return styles[0]?.name ?? "Sin estilo";
  }

  return styles.name;
}

export default function MatchesList() {
  const supabase = createClient();

  const [matches, setMatches] = useState<SwapMatchWithGarments[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setLoading(false);
        return;
      }

      const response = await fetch("/api/core/matches", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        setLoading(false);
        return;
      }

      const data = await response.json();

      setMatches(data);
      setLoading(false);
    }

    loadMatches();
  }, [supabase]);

  if (loading) {
    return <p>Cargando matches...</p>;
  }

  if (matches.length === 0) {
    return (
      <section className="info-card" aria-label="Sin matches">
        <h2>Aún no tienes matches</h2>
        <p>
          Cuando exista interés mutuo entre tú y otro usuario, aparecerá aquí
          una oportunidad de intercambio.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Listado de matches">
      <div className="card-grid">
        {matches.map((match) => (
          <article className="info-card" key={match.id}>
            <header>
              <h2>Match pendiente</h2>
              <p>Se detectó interés mutuo entre dos prendas.</p>
            </header>

            <section aria-label="Prenda A">
              <h3>{match.user_a_garment?.title ?? "Prenda no disponible"}</h3>
              <p>
                <strong>Marca:</strong>{" "}
                {match.user_a_garment?.brand ?? "No especificada"}
              </p>
              <p>
                <strong>Talla:</strong>{" "}
                {match.user_a_garment?.size ?? "No disponible"}
              </p>
              <p>
                <strong>Estilo:</strong>{" "}
                {getStyleName(match.user_a_garment?.styles ?? null)}
              </p>
            </section>

            <hr />

            <section aria-label="Prenda B">
              <h3>{match.user_b_garment?.title ?? "Prenda no disponible"}</h3>
              <p>
                <strong>Marca:</strong>{" "}
                {match.user_b_garment?.brand ?? "No especificada"}
              </p>
              <p>
                <strong>Talla:</strong>{" "}
                {match.user_b_garment?.size ?? "No disponible"}
              </p>
              <p>
                <strong>Estilo:</strong>{" "}
                {getStyleName(match.user_b_garment?.styles ?? null)}
              </p>
            </section>

            <footer className="card-actions">
              <p>
                <strong>Estado:</strong> {match.status}
              </p>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}