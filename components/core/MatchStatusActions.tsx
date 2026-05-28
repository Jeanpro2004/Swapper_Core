"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { MatchStatus } from "@/types/match";

type MatchStatusActionsProps = {
  matchId: string;
  currentStatus: MatchStatus;
  onStatusChange: (nextStatus: MatchStatus) => void;
};

function getAvailableActions(status: MatchStatus): MatchStatus[] {
  if (status === "pending") {
    return ["accepted", "rejected", "cancelled"];
  }

  if (status === "accepted") {
    return ["completed", "cancelled"];
  }

  return [];
}

function getActionLabel(status: MatchStatus) {
  const labels: Record<MatchStatus, string> = {
    pending: "Pendiente",
    accepted: "Aceptar intercambio",
    rejected: "Rechazar",
    cancelled: "Cancelar",
    completed: "Completar intercambio",
  };

  return labels[status];
}

export default function MatchStatusActions({
  matchId,
  currentStatus,
  onStatusChange,
}: MatchStatusActionsProps) {
  const [loadingStatus, setLoadingStatus] = useState<MatchStatus | null>(null);

  const availableActions = getAvailableActions(currentStatus);

  async function handleUpdateStatus(nextStatus: MatchStatus) {
    setLoadingStatus(nextStatus);

    const supabase = createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      alert("Usuario no autenticado.");
      setLoadingStatus(null);
      return;
    }

    const response = await fetch(`/api/core/matches/${matchId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        status: nextStatus,
      }),
    });

    setLoadingStatus(null);

    if (!response.ok) {
      const text = await response.text();

      try {
        const errorData = JSON.parse(text);
        alert(errorData.error || "No se pudo actualizar el match.");
      } catch {
        alert("No se pudo actualizar el match.");
      }

      return;
    }

    onStatusChange(nextStatus);
  }

  if (availableActions.length === 0) {
    return (
      <p>
        <strong>Este intercambio ya no admite acciones.</strong>
      </p>
    );
  }

  return (
    <div className="card-actions">
      {availableActions.map((status) => (
        <button
          key={status}
          type="button"
          className={status === "accepted" || status === "completed" ? "primary-btn" : "text-btn"}
          onClick={() => handleUpdateStatus(status)}
          disabled={loadingStatus !== null}
        >
          {loadingStatus === status
            ? "Procesando..."
            : getActionLabel(status)}
        </button>
      ))}
    </div>
  );
}