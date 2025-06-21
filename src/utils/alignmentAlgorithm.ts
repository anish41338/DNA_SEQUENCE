import { AlignmentResult, Mutation, AlignmentParams } from '../types/alignment';

const DEFAULT_PARAMS: AlignmentParams = {
  match: 1,
  mismatch: -1,
  gap: -2,
};

export class DNAAligner {
  private params: AlignmentParams;

  constructor(params: AlignmentParams = DEFAULT_PARAMS) {
    this.params = params;
  }

  private createMatrix(rows: number, cols: number): number[][] {
    return Array(rows).fill(null).map(() => Array(cols).fill(0));
  }

  private max3(a: number, b: number, c: number): number {
    return Math.max(a, Math.max(b, c));
  }

  needlemanWunsch(seq1: string, seq2: string): AlignmentResult {
    const len1 = seq1.length;
    const len2 = seq2.length;
    
    // Create DP matrix
    const dp = this.createMatrix(len1 + 1, len2 + 1);
    
    // Initialize first row and column
    for (let i = 0; i <= len1; i++) {
      dp[i][0] = i * this.params.gap;
    }
    for (let j = 0; j <= len2; j++) {
      dp[0][j] = j * this.params.gap;
    }
    
    // Fill DP matrix
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const match = dp[i-1][j-1] + (seq1[i-1] === seq2[j-1] ? this.params.match : this.params.mismatch);
        const deletion = dp[i-1][j] + this.params.gap;
        const insertion = dp[i][j-1] + this.params.gap;
        dp[i][j] = this.max3(match, deletion, insertion);
      }
    }
    
    // Traceback
    const aligned1: string[] = [];
    const aligned2: string[] = [];
    let i = len1, j = len2;
    
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && dp[i][j] === dp[i-1][j-1] + (seq1[i-1] === seq2[j-1] ? this.params.match : this.params.mismatch)) {
        aligned1.unshift(seq1[i-1]);
        aligned2.unshift(seq2[j-1]);
        i--; j--;
      } else if (i > 0 && dp[i][j] === dp[i-1][j] + this.params.gap) {
        aligned1.unshift(seq1[i-1]);
        aligned2.unshift('-');
        i--;
      } else {
        aligned1.unshift('-');
        aligned2.unshift(seq2[j-1]);
        j--;
      }
    }
    
    const alignedSeq1 = aligned1.join('');
    const alignedSeq2 = aligned2.join('');
    const mutations = this.detectMutations(alignedSeq1, alignedSeq2);
    const similarity = this.calculateSimilarity(mutations);
    
    return {
      score: dp[len1][len2],
      alignedSeq1,
      alignedSeq2,
      similarity,
      mutations,
    };
  }

  private detectMutations(aligned1: string, aligned2: string): Mutation[] {
    const mutations: Mutation[] = [];
    
    for (let i = 0; i < Math.min(aligned1.length, aligned2.length); i++) {
      const char1 = aligned1[i];
      const char2 = aligned2[i];
      
      if (char1 === char2) {
        mutations.push({
          type: 'match',
          position: i + 1,
          description: `Match at position ${i + 1}: ${char1}`,
        });
      } else if (char1 === '-') {
        mutations.push({
          type: 'insertion',
          position: i + 1,
          to: char2,
          description: `Insertion at position ${i + 1}: ${char2} inserted`,
        });
      } else if (char2 === '-') {
        mutations.push({
          type: 'deletion',
          position: i + 1,
          from: char1,
          description: `Deletion at position ${i + 1}: ${char1} deleted`,
        });
      } else {
        mutations.push({
          type: 'substitution',
          position: i + 1,
          from: char1,
          to: char2,
          description: `Substitution at position ${i + 1}: ${char1} → ${char2}`,
        });
      }
    }
    
    return mutations;
  }

  private calculateSimilarity(mutations: Mutation[]): number {
    const matches = mutations.filter(m => m.type === 'match').length;
    const total = mutations.length;
    return total > 0 ? (matches / total) * 100 : 0;
  }
}

export const validateDNASequence = (sequence: string): { isValid: boolean; error?: string } => {
  if (!sequence.trim()) {
    return { isValid: false, error: 'Sequence cannot be empty' };
  }
  
  const validChars = /^[ATCG]+$/i;
  if (!validChars.test(sequence.trim())) {
    return { isValid: false, error: 'Sequence must contain only A, T, C, G characters' };
  }
  
  if (sequence.length > 1000) {
    return { isValid: false, error: 'Sequence too long (max 1000 characters)' };
  }
  
  return { isValid: true };
};