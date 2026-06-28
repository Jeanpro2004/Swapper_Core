import {
  CoreDashboardGarment,
  CoreDashboardHeritageEvent,
  CoreDashboardMatch,
  CoreDashboardStyle,
  CoreDashboardSummary,
} from "@/types/core-dashboard";

import { buildStyleScore } from "@/services/style-score.service";

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
  };
}

function countActiveMatches(matches: CoreDashboardMatch[]) {
  return matches.filter(
    (match) => match.status === "pending" || match.status === "accepted"
  ).length;
}

function countCompletedExchanges(matches: CoreDashboardMatch[]) {
  return matches.filter((match) => match.status === "completed").length;
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

  const activeMatches = countActiveMatches(matches);
  const completedExchanges = countCompletedExchanges(matches);

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