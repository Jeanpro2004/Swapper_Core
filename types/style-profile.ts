export type StyleRelation = {
  id: string;
  name: string;
};

export type StyleProfileGarment = {
  id: string;
  title: string;
  style_id: string | null;
  styles: StyleRelation | StyleRelation[] | null;
};

export type StyleProfileItem = {
  styleId: string;
  styleName: string;
  count: number;
  percentage: number;
};

export type StyleProfile = {
  totalGarments: number;
  dominantStyle: StyleProfileItem | null;
  distribution: StyleProfileItem[];
  generatedAt: string;
};