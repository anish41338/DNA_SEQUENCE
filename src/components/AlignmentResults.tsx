import React from 'react';
import { AlignmentResult } from '../types/alignment';
import { Trophy, Target, Activity, Download, Dna, AlertCircle } from 'lucide-react';

interface AlignmentResultsProps {
  result: AlignmentResult;
}

export const AlignmentResults: React.FC<AlignmentResultsProps> = ({ result }) => {
  const renderSequence = (sequence: string, isReference: boolean = false) => {
    return sequence.split('').map((char, index) => {
      const otherChar = isReference ? result.alignedSeq2[index] : result.alignedSeq1[index];
      let className = 'inline-block w-7 h-9 text-center text-sm font-mono font-bold border-r border-neutral-200 leading-9 transition-all duration-200 hover:scale-110 ';
      
      if (char === '-') {
        className += 'bg-gradient-to-br from-dna-gap to-orange-300 text-orange-900 shadow-soft'; // Gap
      } else if (char === otherChar) {
        className += 'bg-gradient-to-br from-accent-100 to-accent-200 text-accent-800 shadow-soft'; // Match
      } else {
        className += 'bg-gradient-to-br from-red-100 to-red-200 text-red-800 shadow-soft'; // Mismatch
      }
      
      return (
        <span key={index} className={className} title={`Position ${index + 1}: ${char}`}>
          {char}
        </span>
      );
    });
  };

  const renderMatchLine = () => {
    return result.alignedSeq1.split('').map((char, index) => {
      const char2 = result.alignedSeq2[index];
      const symbol = char === char2 ? '|' : ' ';
      return (
        <span key={index} className="inline-block w-7 text-center text-sm font-mono text-primary-600 font-bold">
          {symbol}
        </span>
      );
    });
  };

  const mutationStats = result.mutations.reduce(
    (acc, mutation) => {
      acc[mutation.type]++;
      return acc;
    },
    { match: 0, substitution: 0, insertion: 0, deletion: 0 }
  );

  const exportResults = () => {
    const data = `DNA Sequence Alignment Results
=====================================

Reference Sequence: ${result.alignedSeq1}
Query Sequence:     ${result.alignedSeq2}
Match Indicators:   ${result.alignedSeq1.split('').map((char, i) => char === result.alignedSeq2[i] ? '|' : ' ').join('')}

Alignment Score: ${result.score}
Similarity: ${result.similarity.toFixed(2)}%

Mutation Statistics:
- Matches: ${mutationStats.match}
- Substitutions: ${mutationStats.substitution}
- Insertions: ${mutationStats.insertion}
- Deletions: ${mutationStats.deletion}

Detailed Mutations:
${result.mutations.filter(m => m.type !== 'match').map(m => `- ${m.description}`).join('\n')}
`;

    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dna_alignment_results.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Summary Stats */}
      <div className="bg-gradient-card rounded-2xl shadow-medium border border-neutral-200/50 p-8 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-700">Alignment Results</h2>
              <p className="text-neutral-600">Comprehensive sequence analysis</p>
            </div>
          </div>
          <button
            onClick={exportResults}
            className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-neutral-700 hover:bg-neutral-100 rounded-xl transition-all duration-200 shadow-soft hover:shadow-medium"
          >
            <Download className="w-4 h-4" />
            <span className="font-medium">Export</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-xl shadow-soft border border-primary-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-semibold text-primary-800">Alignment Score</span>
            </div>
            <div className="text-3xl font-bold text-primary-900">{result.score}</div>
          </div>
          
          <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-6 rounded-xl shadow-soft border border-accent-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-accent-600" />
              <span className="text-sm font-semibold text-accent-800">Similarity</span>
            </div>
            <div className="text-3xl font-bold text-accent-900">{result.similarity.toFixed(1)}%</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-soft border border-blue-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Dna className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">Matches</span>
            </div>
            <div className="text-3xl font-bold text-blue-900">{mutationStats.match}</div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-soft border border-red-200/50">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-semibold text-red-800">Mutations</span>
            </div>
            <div className="text-3xl font-bold text-red-900">
              {mutationStats.substitution + mutationStats.insertion + mutationStats.deletion}
            </div>
          </div>
        </div>

        {/* Visual Alignment */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-neutral-700 flex items-center gap-2">
            <Dna className="w-6 h-6 text-primary-500" />
            Visual Alignment
          </h3>
          <div className="bg-gradient-secondary p-6 rounded-xl overflow-x-auto border border-primary-200/30 shadow-soft">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-20 text-right font-bold text-neutral-700">Reference:</span>
                <div className="flex border-2 border-primary-300 rounded-lg overflow-hidden shadow-soft">
                  {renderSequence(result.alignedSeq1, true)}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20 text-right font-bold text-neutral-700"></span>
                <div className="flex">
                  {renderMatchLine()}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20 text-right font-bold text-neutral-700">Query:</span>
                <div className="flex border-2 border-accent-300 rounded-lg overflow-hidden shadow-soft">
                  {renderSequence(result.alignedSeq2)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-6 text-sm bg-white/80 p-4 rounded-xl border border-neutral-200/50 shadow-soft">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-accent-100 to-accent-200 border border-accent-300 rounded shadow-soft"></div>
              <span className="text-neutral-700 font-medium">Perfect Match</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-red-100 to-red-200 border border-red-300 rounded shadow-soft"></div>
              <span className="text-neutral-700 font-medium">Mismatch</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-dna-gap to-orange-300 border border-orange-300 rounded shadow-soft"></div>
              <span className="text-neutral-700 font-medium">Gap/Indel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Mutations */}
      <div className="bg-gradient-card rounded-2xl shadow-medium border border-neutral-200/50 p-8 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-neutral-700 mb-6 flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary-500" />
          Mutation Analysis
        </h3>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-soft border border-red-200/50">
            <div className="text-sm font-semibold text-red-800 mb-2">Substitutions</div>
            <div className="text-2xl font-bold text-red-900">{mutationStats.substitution}</div>
            <div className="text-xs text-red-700 mt-1">Base changes</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-soft border border-blue-200/50">
            <div className="text-sm font-semibold text-blue-800 mb-2">Insertions</div>
            <div className="text-2xl font-bold text-blue-900">{mutationStats.insertion}</div>
            <div className="text-xs text-blue-700 mt-1">Added bases</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-soft border border-purple-200/50">
            <div className="text-sm font-semibold text-purple-800 mb-2">Deletions</div>
            <div className="text-2xl font-bold text-purple-900">{mutationStats.deletion}</div>
            <div className="text-xs text-purple-700 mt-1">Missing bases</div>
          </div>
        </div>
        
        {result.mutations.filter(m => m.type !== 'match').length > 0 ? (
          <div className="max-h-72 overflow-y-auto bg-gradient-secondary rounded-xl p-4 border border-primary-200/30">
            <div className="space-y-3">
              {result.mutations
                .filter(m => m.type !== 'match')
                .map((mutation, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-white/80 shadow-soft border border-neutral-200/50">
                    <div className={`w-3 h-3 rounded-full shadow-soft ${
                      mutation.type === 'substitution' ? 'bg-red-500' :
                      mutation.type === 'insertion' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}></div>
                    <span className="text-sm text-neutral-700 font-mono font-medium">{mutation.description}</span>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl border border-accent-200/50">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-accent-500" />
            <h4 className="text-xl font-bold text-accent-800 mb-2">Perfect Alignment!</h4>
            <p className="text-accent-700">No mutations detected between sequences.</p>
          </div>
        )}
      </div>
    </div>
  );
};