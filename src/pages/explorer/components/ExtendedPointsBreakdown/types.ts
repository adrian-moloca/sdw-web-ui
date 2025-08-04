export interface CodeNameDefinition {
  title: string;
  code: string;
}
export interface PointPropertyDefinition {
  title: string;
  field: string;
}
export interface BreakdownItem {
  category?: string;
  round?: string;
  points?: string;
  rank?: string;
  sortOrder: number;
  difficulty?: string;
  difficultyApparatus?: string;
  difficultyBody?: string;
  execution?: string;
  artistic?: string;
}
export interface PointBreakdownData {
  type: string;
  properties: PointPropertyDefinition[];
  categories: CodeNameDefinition[];
  rounds: CodeNameDefinition[];
  breakdown: BreakdownItem[];
  $schema: string; // The schema URL
}
