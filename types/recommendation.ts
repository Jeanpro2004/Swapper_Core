export type RecommendationStyle = {
  id: string;
  name: string;
};

export type RecommendationGarment = {
  id: string;
  title: string;
  description: string | null;
  size: string;
  brand: string | null;
  condition: string;
  owner_id: string | null;
  style_id: string | null;
  is_available: boolean;
  created_at: string;
  styles: RecommendationStyle | RecommendationStyle[] | null;
};

export type UserStyleSignal = {
  id: string;
  title: string;
  size: string;
  style_id: string | null;
  styles: RecommendationStyle | RecommendationStyle[] | null;
};

export type RecommendedGarment = RecommendationGarment & {
  recommendationScore: number;
  recommendationReasons: string[];
};

export type StyleRecommendationProfile = {
  totalUserGarments: number;
  dominantStyleId: string | null;
  dominantStyleName: string | null;
  frequentSizes: string[];
  recommendations: RecommendedGarment[];
  generatedAt: string;
};