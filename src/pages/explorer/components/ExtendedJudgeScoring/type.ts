export interface CodeNameType {
  code: string;
  title: string;
  score?: string;
  averageScore?: string;
  arrive?: string;
  goe?: string;
  rank?: string;
}

export interface CriteriaItem {
  category?: string;
  judge: string;
  round: string;
  score?: string;
  discarded?: string;
  sortOrder: number;
  rank?: string;
}

export interface JudgeCriteriaData {
  type: string;
  judges: CodeNameType[];
  rounds: CodeNameType[];
  categories?: CodeNameType[];
  criteria: CriteriaItem[];
  $schema: string; // The schema URL
}
