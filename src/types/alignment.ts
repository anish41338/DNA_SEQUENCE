export interface AlignmentResult {
  score: number;
  alignedSeq1: string;
  alignedSeq2: string;
  similarity: number;
  mutations: Mutation[];
}

export interface Mutation {
  type: 'match' | 'substitution' | 'insertion' | 'deletion';
  position: number;
  from?: string;
  to?: string;
  description: string;
}

export interface MutationStats {
  matches: number;
  substitutions: number;
  insertions: number;
  deletions: number;
  total: number;
  similarity: number;
}

export interface AlignmentParams {
  match: number;
  mismatch: number;
  gap: number;
}