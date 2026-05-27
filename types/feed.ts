export type FeedStyle = {
  id: string;
  name: string;
};

export type FeedGarment = {
  id: string;
  title: string;
  description: string | null;
  size: string;
  brand: string | null;
  condition: string;
  owner_id: string | null;
  style_id: string | null;
  created_at: string;
  styles: FeedStyle | FeedStyle[] | null;
  hasInterest?: boolean;
};