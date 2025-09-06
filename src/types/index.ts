export interface Fact {
  value: string;
  document_title: string;
  fact_name: string;
  source_sentence: string;
  context: string;
  reference: string;
}

export interface FactGroup {
  key: string;
  facts: Fact[];
  isInconsistent: boolean;
  factName: string;
}

export interface FactData {
  [key: string]: Fact[];
}

export interface DashboardStats {
  totalFacts: number;
  inconsistentFacts: number;
  consistentFacts: number;
  consistencyRate: number;
}

export type FilterType = 'all' | 'inconsistent' | 'consistent';

export interface DocumentHighlight {
  document: string;
  sentence: string;
  reference: string;
}
