import {
  StyleProfile,
  StyleProfileGarment,
  StyleProfileItem,
  StyleRelation,
} from "@/types/style-profile";

function getStyleRelation(
  garment: StyleProfileGarment
): StyleRelation | null {
  if (!garment.styles) {
    return null;
  }

  if (Array.isArray(garment.styles)) {
    return garment.styles[0] ?? null;
  }

  return garment.styles;
}

export function buildStyleProfile(
  garments: StyleProfileGarment[]
): StyleProfile {
  const totalGarments = garments.length;

  if (totalGarments === 0) {
    return {
      totalGarments: 0,
      dominantStyle: null,
      distribution: [],
      generatedAt: new Date().toISOString(),
    };
  }

  const styleCounter = new Map<
    string,
    {
      styleName: string;
      count: number;
    }
  >();

  garments.forEach((garment) => {
    const style = getStyleRelation(garment);

    if (!style) {
      return;
    }

    const currentStyle = styleCounter.get(style.id);

    if (!currentStyle) {
      styleCounter.set(style.id, {
        styleName: style.name,
        count: 1,
      });

      return;
    }

    styleCounter.set(style.id, {
      styleName: currentStyle.styleName,
      count: currentStyle.count + 1,
    });
  });

  const distribution: StyleProfileItem[] = Array.from(styleCounter.entries())
    .map(([styleId, value]) => ({
      styleId,
      styleName: value.styleName,
      count: value.count,
      percentage: Math.round((value.count / totalGarments) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  return {
    totalGarments,
    dominantStyle: distribution[0] ?? null,
    distribution,
    generatedAt: new Date().toISOString(),
  };
}