"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { GarmentHeritageEvent } from "@/types/heritage";

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

export default function HeritageTimeline() {
  const supabase = createClient();

  const [events, setEvents] = useState<GarmentHeritageEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHeritageEvents() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setLoading(false);
        return;
      }

      const response = await fetch("/api/core/heritage", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        setLoading(false);
        return;
      }

      const data = await response.json();

      setEvents(data);
      setLoading(false);
    }

    loadHeritageEvents();
  }, [supabase]);

  if (loading) {
    return <p>Cargando historial de prendas...</p>;
  }

  if (events.length === 0) {
    return (
      <section className="info-card" aria-label="Historial vacío">
        <h2>Aún no existe historial</h2>
        <p>
          Registra prendas, genera matches o completa intercambios para empezar
          a construir el heritage de tu armario.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Línea de tiempo de prendas">
      <div className="card-grid">
        {events.map((event) => (
          <article className="info-card" key={event.id}>
            <header>
              <h2>{formatEventType(event.event_type)}</h2>
              <p>{formatDate(event.created_at)}</p>
            </header>

            <p>{event.description}</p>

            <dl>
              <div>
                <dt>Prenda</dt>
                <dd>{event.garments?.title ?? "Prenda no disponible"}</dd>
              </div>

              <div>
                <dt>Marca</dt>
                <dd>{event.garments?.brand ?? "No especificada"}</dd>
              </div>

              <div>
                <dt>Talla</dt>
                <dd>{event.garments?.size ?? "No disponible"}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}