import {
  RecommendedGarment,
  RecommendationGarment,
  RecommendationStyle,
  StyleRecommendationProfile,
  UserStyleSignal,
} from "@/types/recommendation";

function getStyle(
  styles: RecommendationStyle | RecommendationStyle[] | null
): RecommendationStyle | null {
  if (!styles) {
    return null;
  }

  if (Array.isArray(styles)) {
    return styles[0] ?? null;
  }

  return styles;
}

function getDominantStyle(userGarments: UserStyleSignal[]) {
  const styleCounter = new Map<
    string,
    {
      styleName: string;
      count: number;
    }
  >();

  userGarments.forEach((garment) => {
    const style = getStyle(garment.styles);

    if (!style) {
      return;
    }

    const current = styleCounter.get(style.id);

    if (!current) {
      styleCounter.set(style.id, {
        styleName: style.name,
        count: 1,
      });

      return;
    }

    styleCounter.set(style.id, {
      styleName: current.styleName,
      count: current.count + 1,
    });
  });

  const sortedStyles = Array.from(styleCounter.entries()).sort(
    (a, b) => b[1].count - a[1].count
  );

  const dominant = sortedStyles[0];

  if (!dominant) {
    return {
      dominantStyleId: null,
      dominantStyleName: null,
      styleIds: [],
    };
  }

  return {
    dominantStyleId: dominant[0],
    dominantStyleName: dominant[1].styleName,
    styleIds: sortedStyles.map(([styleId]) => styleId),
  };
}

function getFrequentSizes(userGarments: UserStyleSignal[]) {
  const sizeCounter = new Map<string, number>();

  userGarments.forEach((garment) => {
    const current = sizeCounter.get(garment.size) ?? 0;
    sizeCounter.set(garment.size, current + 1);
  });

  return Array.from(sizeCounter.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([size]) => size);
}

function scoreCandidate(
  candidate: RecommendationGarment,
  dominantStyleId: string | null,
  userStyleIds: string[],
  frequentSizes: string[]
): RecommendedGarment {
  let score = 0;
  const reasons: string[] = [];

  const candidateStyle = getStyle(candidate.styles);

  if (candidateStyle && candidateStyle.id === dominantStyleId) {
    score += 60;
    reasons.push(`Coincide con tu estilo dominante: ${candidateStyle.name}.`);
  } else if (candidateStyle && userStyleIds.includes(candidateStyle.id)) {
    score += 35;
    reasons.push(`Coincide con uno de tus estilos frecuentes: ${candidateStyle.name}.`);
  }

  if (frequentSizes.includes(candidate.size)) {
    score += 20;
    reasons.push(`Coincide con una talla frecuente en tu armario: ${candidate.size}.`);
  }

  if (candidate.condition === "new") {
    score += 15;
    reasons.push("La prenda está en estado nuevo.");
  }

  if (candidate.condition === "almost_new") {
    score += 10;
    reasons.push("La prenda está casi nueva.");
  }

  if (score === 0) {
    score = 5;
    reasons.push("Prenda disponible para descubrir nuevos estilos.");
  }

  return {
    ...candidate,
    recommendationScore: score,
    recommendationReasons: reasons,
  };
}

export function buildStyleRecommendations(
  userGarments: UserStyleSignal[],
  candidates: RecommendationGarment[]
): StyleRecommendationProfile {
  const totalUserGarments = userGarments.length;

  const { dominantStyleId, dominantStyleName, styleIds } =
    getDominantStyle(userGarments);

  const frequentSizes = getFrequentSizes(userGarments);

  const recommendations = candidates
    .map((candidate) =>
      scoreCandidate(candidate, dominantStyleId, styleIds, frequentSizes)
    )
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 10);

  return {
    totalUserGarments,
    dominantStyleId,
    dominantStyleName,
    frequentSizes,
    recommendations,
    generatedAt: new Date().toISOString(),
  };
}