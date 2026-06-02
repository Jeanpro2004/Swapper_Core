import {
  CoreDashboardGarment,
  CoreDashboardHeritageEvent,
  CoreDashboardMatch,
  CoreDashboardStyle,
  CoreDashboardStyleScore,
  CoreDashboardSummary,
} from "@/types/core-dashboard";

function getStyleName(
  styles: CoreDashboardStyle | CoreDashboardStyle[] | null
) {
  if (!styles) {
    return null;
  }

  if (Array.isArray(styles)) {
    return styles[0]?.name ?? null;
  }

  return styles.name;
}

function calculateDominantStyle(garments: CoreDashboardGarment[]) {
  const styleCounter = new Map<string, number>();

  garments.forEach((garment) => {
    const styleName = getStyleName(garment.styles);

    if (!styleName) {
      return;
    }

    const currentCount = styleCounter.get(styleName) ?? 0;
    styleCounter.set(styleName, currentCount + 1);
  });

  const sortedStyles = Array.from(styleCounter.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  const dominantStyle = sortedStyles[0];

  return {
    dominantStyleName: dominantStyle?.[0] ?? null,
    dominantStyleCount: dominantStyle?.[1] ?? 0,
    totalDetectedStyles: sortedStyles.length,
  };
}

function calculateWardrobeScore(totalGarments: number) {
  if (totalGarments === 0) {
    return 0;
  }

  return Math.min(totalGarments * 7, 35);
}

function calculateStyleIdentityScore({
  dominantStyleName,
  dominantStyleCount,
  totalGarments,
}: {
  dominantStyleName: string | null;
  dominantStyleCount: number;
  totalGarments: number;
}) {
  if (!dominantStyleName || totalGarments === 0) {
    return 0;
  }

  const dominanceRatio = dominantStyleCount / totalGarments;

  if (dominanceRatio >= 0.6) {
    return 25;
  }

  if (dominanceRatio >= 0.35) {
    return 18;
  }

  return 10;
}

function calculateHeritageScore(events: CoreDashboardHeritageEvent[]) {
  return Math.min(events.length * 4, 20);
}

function calculateExchangeScore(matches: CoreDashboardMatch[]) {
  const activeMatches = matches.filter(
    (match) => match.status === "pending" || match.status === "accepted"
  ).length;

  const completedExchanges = matches.filter(
    (match) => match.status === "completed"
  ).length;

  return Math.min(activeMatches * 5 + completedExchanges * 10, 20);
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

function buildStyleScore({
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

  const wardrobeScore = calculateWardrobeScore(totalGarments);

  const styleIdentityScore = calculateStyleIdentityScore({
    dominantStyleName,
    dominantStyleCount,
    totalGarments,
  });

  const heritageScore = calculateHeritageScore(heritageEvents);

  const exchangeScore = calculateExchangeScore(matches);

  const score = Math.min(
    wardrobeScore + styleIdentityScore + heritageScore + exchangeScore,
    100
  );

  const completedExchanges = matches.filter(
    (match) => match.status === "completed"
  ).length;

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
    breakdown: {
      wardrobeScore,
      styleIdentityScore,
      heritageScore,
      exchangeScore,
    },
  };
}

export function buildCoreDashboardSummary({
  garments,
  matches,
  heritageEvents,
}: {
  garments: CoreDashboardGarment[];
  matches: CoreDashboardMatch[];
  heritageEvents: CoreDashboardHeritageEvent[];
}): CoreDashboardSummary {
  const totalGarments = garments.length;

  const availableGarments = garments.filter(
    (garment) => garment.is_available
  ).length;

  const lockedGarments = garments.filter(
    (garment) => !garment.is_available
  ).length;

  const activeMatches = matches.filter(
    (match) => match.status === "pending" || match.status === "accepted"
  ).length;

  const completedExchanges = matches.filter(
    (match) => match.status === "completed"
  ).length;

  const { dominantStyleName, dominantStyleCount } =
    calculateDominantStyle(garments);

  const styleScore = buildStyleScore({
    garments,
    matches,
    heritageEvents,
    dominantStyleName,
    dominantStyleCount,
  });

  return {
    totalGarments,
    availableGarments,
    lockedGarments,
    dominantStyleName,
    activeMatches,
    completedExchanges,
    styleScore,
    recentHeritageEvents: heritageEvents.slice(0, 5),
    generatedAt: new Date().toISOString(),
  };
}