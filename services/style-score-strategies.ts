export type StyleScoreBreakdownKey =
  | "wardrobeScore"
  | "styleIdentityScore"
  | "heritageScore"
  | "exchangeScore";

export type StyleScoreContext = {
  totalGarments: number;
  dominantStyleName: string | null;
  dominantStyleCount: number;
  heritageEventsCount: number;
  activeMatches: number;
  completedExchanges: number;
};

export type StyleScoreStrategy = {
  key: StyleScoreBreakdownKey;
  name: string;
  maxScore: number;
  calculate: (context: StyleScoreContext) => number;
};

export const wardrobeScoreStrategy: StyleScoreStrategy = {
  key: "wardrobeScore",
  name: "Wardrobe Score",
  maxScore: 35,
  calculate: (context) => {
    if (context.totalGarments === 0) {
      return 0;
    }

    return Math.min(context.totalGarments * 7, 35);
  },
};

export const styleIdentityScoreStrategy: StyleScoreStrategy = {
  key: "styleIdentityScore",
  name: "Style Identity Score",
  maxScore: 25,
  calculate: (context) => {
    if (!context.dominantStyleName || context.totalGarments === 0) {
      return 0;
    }

    const dominanceRatio =
      context.dominantStyleCount / context.totalGarments;

    if (dominanceRatio >= 0.6) {
      return 25;
    }

    if (dominanceRatio >= 0.35) {
      return 18;
    }

    return 10;
  },
};

export const heritageScoreStrategy: StyleScoreStrategy = {
  key: "heritageScore",
  name: "Heritage Score",
  maxScore: 20,
  calculate: (context) => {
    return Math.min(context.heritageEventsCount * 4, 20);
  },
};

export const exchangeScoreStrategy: StyleScoreStrategy = {
  key: "exchangeScore",
  name: "Exchange Score",
  maxScore: 20,
  calculate: (context) => {
    return Math.min(
      context.activeMatches * 5 + context.completedExchanges * 10,
      20
    );
  },
};

export const STYLE_SCORE_STRATEGIES: StyleScoreStrategy[] = [
  wardrobeScoreStrategy,
  styleIdentityScoreStrategy,
  heritageScoreStrategy,
  exchangeScoreStrategy,
];