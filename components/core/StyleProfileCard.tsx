"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { StyleProfile } from "@/types/style-profile";

export default function StyleProfileCard() {
  const supabase = createClient();

  const [profile, setProfile] = useState<StyleProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStyleProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setLoading(false);
        return;
      }

      const response = await fetch("/api/core/style-profile", {
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

    loadStyleProfile();
  }, [supabase]);

  if (loading) {
    return (
      <section className="info-card" aria-label="Perfil de estilo">
        <p>Cargando perfil de estilo...</p>
      </section>
    );
  }

  if (!profile || profile.totalGarments === 0) {
    return (
      <section className="info-card" aria-label="Perfil de estilo">
        <h2>Perfil de estilo</h2>
        <p>
          Aún no tienes suficientes prendas registradas para calcular tu estilo.
        </p>
      </section>
    );
  }

  return (
    <section className="info-card" aria-label="Perfil de estilo">
      <header>
        <h2>Perfil de estilo</h2>
        <p>
          Basado en {profile.totalGarments} prendas registradas en tu armario.
        </p>
      </header>

      <div>
        <h3>Estilo dominante</h3>
        <p>
          <strong>{profile.dominantStyle?.styleName}</strong>
        </p>
      </div>

      <div>
        <h3>Distribución por estilo</h3>

        <ul>
          {profile.distribution.map((item) => (
            <li key={item.styleId}>
              <span>{item.styleName}</span>{" "}
              <meter min={0} max={100} value={item.percentage}>
                {item.percentage}%
              </meter>{" "}
              <strong>{item.percentage}%</strong>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}