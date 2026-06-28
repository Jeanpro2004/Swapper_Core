import {
  CoreDashboardGarment,
  CoreDashboardHeritageEvent,
  CoreDashboardMatch,
  CoreDashboardStyleScore,
  CoreDashboardStyleScoreBreakdown,
} from "@/types/core-dashboard";

import {
  STYLE_SCORE_STRATEGIES,
  StyleScoreContext,
} from "@/services/style-score-strategies";

function countActiveMatches(matches: CoreDashboardMatch[]) {
  return matches.filter(
    (match) => match.status === "pending" || match.status === "accepted"
  ).length;
}

function countCompletedExchanges(matches: CoreDashboardMatch[]) {
  return matches.filter((match) => match.status === "completed").length;
}

function getStyleScoreConfidence(score: number): "low" | "medium" | "high" {
  if (score >= 75) {
    return "high";
  }

  if (score >= 45) {
    return "medium";
  }

  return "low";
}

function getStyleScoreLabel(
  score: number,
  dominantStyleName: string | null
) {
  if (!dominantStyleName) {
    return "Identidad en construcción";
  }

  if (score >= 75) {
    return `${dominantStyleName} Enthusiast`;
  }

  if (score >= 45) {
    return `${dominantStyleName} Explorer`;
  }

  return `${dominantStyleName} Starter`;
}

function getStyleScoreDescription({
  score,
  dominantStyleName,
  totalGarments,
  heritageEvents,
  completedExchanges,
}: {
  score: number;
  dominantStyleName: string | null;
  totalGarments: number;
  heritageEvents: number;
  completedExchanges: number;
}) {
  if (totalGarments === 0) {
    return "Registra prendas en tu armario para que Swapper empiece a construir tu identidad de estilo.";
  }

  if (!dominantStyleName) {
    return "Tu identidad de estilo todavía está en formación. Agrega estilos a tus prendas para mejorar el análisis.";
  }

  if (score >= 75) {
    return `Tu identidad de estilo está fuertemente asociada a ${dominantStyleName}. Tu armario, heritage e intercambios muestran una señal consistente.`;
  }

  if (heritageEvents > 0 || completedExchanges > 0) {
    return `Tu estilo apunta hacia ${dominantStyleName}. A medida que generes más heritage e intercambios, el score será más preciso.`;
  }

  return `Tu estilo inicial apunta hacia ${dominantStyleName}. Swapper seguirá ajustando tu score con base en tu historial e interacciones.`;
}

function buildScoreBreakdown(
  context: StyleScoreContext
): CoreDashboardStyleScoreBreakdown {
  const breakdown: CoreDashboardStyleScoreBreakdown = {
    wardrobeScore: 0,
    styleIdentityScore: 0,
    heritageScore: 0,
    exchangeScore: 0,
  };

  STYLE_SCORE_STRATEGIES.forEach((strategy) => {
    breakdown[strategy.key] = strategy.calculate(context);
  });

  return breakdown;
}

export function buildStyleScore({
  garments,
  matches,
  heritageEvents,
  dominantStyleName,
  dominantStyleCount,
}: {
  garments: CoreDashboardGarment[];
  matches: CoreDashboardMatch[];
  heritageEvents: CoreDashboardHeritageEvent[];
  dominantStyleName: string | null;
  dominantStyleCount: number;
}): CoreDashboardStyleScore {
  const totalGarments = garments.length;
  const activeMatches = countActiveMatches(matches);
  const completedExchanges = countCompletedExchanges(matches);

  const context: StyleScoreContext = {
    totalGarments,
    dominantStyleName,
    dominantStyleCount,
    heritageEventsCount: heritageEvents.length,
    activeMatches,
    completedExchanges,
  };

  const breakdown = buildScoreBreakdown(context);

  const score = Math.min(
    breakdown.wardrobeScore +
      breakdown.styleIdentityScore +
      breakdown.heritageScore +
      breakdown.exchangeScore,
    100
  );

  return {
    score,
    label: getStyleScoreLabel(score, dominantStyleName),
    dominantStyleName,
    confidence: getStyleScoreConfidence(score),
    description: getStyleScoreDescription({
      score,
      dominantStyleName,
      totalGarments,
      heritageEvents: heritageEvents.length,
      completedExchanges,
    }),
    breakdown,
  };
}