"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { CoreDashboardSummary } from "@/types/core-dashboard";

const STYLE_SUGGESTIONS: Record<string, string[]> = {
  Minimalista: ["Vintage", "Y2K"],
  Vintage: ["Minimalista", "Grunge"],
  Streetwear: ["Y2K", "Grunge"],
  Grunge: ["Streetwear", "Vintage"],
  Y2K: ["Streetwear", "Vintage"],
};

function getSuggestedStyles(
  dominantStyleName: string | null,
  styleScore: number
) {
  if (!dominantStyleName) {
    return ["Minimalista", "Vintage", "Streetwear"];
  }

  const suggestions =
    STYLE_SUGGESTIONS[dominantStyleName] ?? [
      "Minimalista",
      "Vintage",
      "Streetwear",
    ];

  if (styleScore >= 75) {
    return suggestions.slice(0, 2);
  }

  if (styleScore >= 45) {
    return suggestions;
  }



  return ["Minimalista", "Vintage", "Streetwear"];
}

function formatEventType(eventType: string) {
  const labels: Record<string, string> = {
    garment_registered: "Prenda registrada",
    match_created: "Match generado",
    match_accepted: "Intercambio aceptado",
    match_rejected: "Intercambio rechazado",
    match_cancelled: "Intercambio cancelado",
    exchange_completed: "Intercambio completado",
  };

  return labels[eventType] ?? eventType;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatConfidence(confidence: string) {
  const labels: Record<string, string> = {
    low: "Baja",
    medium: "Media",
    high: "Alta",
  };

  return labels[confidence] ?? confidence;
}

export default function CoreDashboard() {
  const supabase = createClient();

  const [dashboard, setDashboard] =
    useState<CoreDashboardSummary | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setLoading(false);
        return;
      }

      const response = await fetch("/api/core/dashboard", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        setLoading(false);
        return;
      }

      const data = await response.json();

      setDashboard(data);
      setLoading(false);
    }

    loadDashboard();
  }, [supabase]);

  if (loading) {
    return <p>Cargando dashboard del core...</p>;
  }

  if (!dashboard) {
    return (
      <section className="info-card" aria-label="Dashboard no disponible">
        <h2>No se pudo cargar el dashboard</h2>
        <p>Intenta cerrar sesión e iniciar nuevamente.</p>
      </section>
    );
  }

  const suggestedStyles = getSuggestedStyles(
    dashboard.styleScore.dominantStyleName,
    dashboard.styleScore.score
  );

  return (
    <section aria-label="Dashboard del core">
      <article className="info-card" aria-label="My Style Score">
        <header>
          <h2>My Style Score</h2>
          <p>Identidad dinámica de estilo basada en tu actividad.</p>
        </header>

        <p className="style-score-value">
          <strong>{dashboard.styleScore.score}%</strong>
        </p>

        <h3>{dashboard.styleScore.label}</h3>

        <p>{dashboard.styleScore.description}</p>

        <dl>
          <div>
            <dt>Estilo dominante</dt>
            <dd>{dashboard.styleScore.dominantStyleName ?? "No definido"}</dd>
          </div>

          <div>
            <dt>Confianza del score</dt>
            <dd>{formatConfidence(dashboard.styleScore.confidence)}</dd>
          </div>
        </dl>

        <section aria-label="Detalle del Style Score">
          <h4>Composición del score</h4>

          <ul>
            <li>
              Armario: {dashboard.styleScore.breakdown.wardrobeScore} / 35
            </li>
            <li>
              Identidad de estilo:{" "}
              {dashboard.styleScore.breakdown.styleIdentityScore} / 25
            </li>
            <li>
              Heritage: {dashboard.styleScore.breakdown.heritageScore} / 20
            </li>
            <li>
              Intercambios: {dashboard.styleScore.breakdown.exchangeScore} / 20
            </li>
          </ul>
        </section>
      </article>

      <section className="info-card" aria-label="Sugerencias de estilo">
        <h2>Sugerencias de estilo</h2>

        <p>Tu estilo predominante es:</p>

        <h3>{dashboard.styleScore.dominantStyleName ?? "No definido"}</h3>

        <p className="style-score-value">
          <strong>{dashboard.styleScore.score}%</strong>
        </p>

        <h4>{dashboard.styleScore.label}</h4>

        <p>Te sugerimos probar estos estilos que van con tu vibe:</p>

        <ul>
          {suggestedStyles.map((style) => (
            <li key={style}>{style}</li>
          ))}
        </ul>
      </section>

      <div className="card-grid">
        <article className="info-card">
          <h2>Armario</h2>
          <p>
            <strong>{dashboard.totalGarments}</strong> prendas registradas.
          </p>
          <p>
            Disponibles: <strong>{dashboard.availableGarments}</strong>
          </p>
          <p>
            Comprometidas: <strong>{dashboard.lockedGarments}</strong>
          </p>
        </article>

        <article className="info-card">
          <h2>Estilo dominante</h2>
          <p>
            <strong>{dashboard.dominantStyleName ?? "No definido"}</strong>
          </p>
          <p>
            Este estilo se calcula a partir de las prendas registradas en tu
            armario.
          </p>
        </article>

        <article className="info-card">
          <h2>Matches</h2>
          <p>
            Activos: <strong>{dashboard.activeMatches}</strong>
          </p>
          <p>
            Intercambios completados:{" "}
            <strong>{dashboard.completedExchanges}</strong>
          </p>
        </article>
      </div>

      <section className="info-card" aria-label="Accesos rápidos">
        <h2>Accesos rápidos</h2>

        <nav aria-label="Navegación rápida del core">
          <ul>
            <li>
              <Link href="/wardrobe">Mi armario</Link>
            </li>
            <li>
              <Link href="/feed">Feed</Link>
            </li>
            <li>
              <Link href="/matches">Matches</Link>
            </li>
            <li>
              <Link href="/heritage">Heritage</Link>
            </li>
            <li>
              <Link href="/recommendations">Recomendaciones</Link>
            </li>
          </ul>
        </nav>
      </section>

      <section className="info-card" aria-label="Heritage reciente">
        <h2>Heritage reciente</h2>

        {dashboard.recentHeritageEvents.length === 0 ? (
          <p>Aún no tienes eventos recientes en tu historial.</p>
        ) : (
          <ul>
            {dashboard.recentHeritageEvents.map((event) => (
              <li key={event.id}>
                <strong>{formatEventType(event.event_type)}</strong>
                {" — "}
                {event.description}
                <br />
                <small>{formatDate(event.created_at)}</small>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
