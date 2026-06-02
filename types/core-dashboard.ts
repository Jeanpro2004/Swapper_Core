export type CoreDashboardStyle = {
  id: string;
  name: string;
};

export type CoreDashboardGarment = {
  id: string;
  title: string;
  size: string;
  style_id: string | null;
  is_available: boolean;
  created_at: string;
  styles: CoreDashboardStyle | CoreDashboardStyle[] | null;
};

export type CoreDashboardMatchStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "completed";

export type CoreDashboardMatch = {
  id: string;
  status: CoreDashboardMatchStatus;
  created_at: string;
};

export type CoreDashboardHeritageEvent = {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
  garments:
    | {
        id: string;
        title: string;
      }
    | {
        id: string;
        title: string;
      }[]
    | null;
};

export type CoreDashboardStyleScoreBreakdown = {
  wardrobeScore: number;
  styleIdentityScore: number;
  heritageScore: number;
  exchangeScore: number;
};

export type CoreDashboardStyleScore = {
  score: number;
  label: string;
  dominantStyleName: string | null;
  confidence: "low" | "medium" | "high";
  description: string;
  breakdown: CoreDashboardStyleScoreBreakdown;
};

export type CoreDashboardSummary = {
  totalGarments: number;
  availableGarments: number;
  lockedGarments: number;
  dominantStyleName: string | null;
  activeMatches: number;
  completedExchanges: number;
  styleScore: CoreDashboardStyleScore;
  recentHeritageEvents: CoreDashboardHeritageEvent[];
  generatedAt: string;
};