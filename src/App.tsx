import React, { useState } from 'react';
import { Header } from './components/Header';
import { SequenceInput } from './components/SequenceInput';
import { AlignmentResults } from './components/AlignmentResults';
import { MutationChart } from './components/MutationChart';
import { DNAAligner } from './utils/alignmentAlgorithm';
import { AlignmentResult, MutationStats } from './types/alignment';

function App() {
  const [result, setResult] = useState<AlignmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAlign = async (seq1: string, seq2: string) => {
    setIsLoading(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const aligner = new DNAAligner();
      const alignmentResult = aligner.needlemanWunsch(seq1, seq2);
      setResult(alignmentResult);
    } catch (error) {
      console.error('Alignment failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMutationStats = (result: AlignmentResult): MutationStats => {
    const stats = result.mutations.reduce(
      (acc, mutation) => {
        acc[mutation.type]++;
        return acc;
      },
      { match: 0, substitution: 0, insertion: 0, deletion: 0 }
    );

    return {
      matches: stats.match,
      substitutions: stats.substitution,
      insertions: stats.insertion,
      deletions: stats.deletion,
      total: result.mutations.length,
      similarity: result.similarity,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-accent-50 bg-dna-pattern">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-primary rounded-full mb-6 animate-float">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-full animate-pulse-slow"></div>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-neutral-700 mb-4 leading-tight">
            Analyze DNA Sequences with
            <span className="block text-transparent bg-gradient-primary bg-clip-text">
              Scientific Precision
            </span>
          </h2>
          <p className="text-neutral-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Upload two DNA sequences to perform global alignment using the Needleman-Wunsch algorithm. 
            Get detailed mutation analysis with visual representations and exportable results for your research.
          </p>
        </div>

        <SequenceInput onAlign={handleAlign} isLoading={isLoading} />
        
        {result && (
          <div className="space-y-8">
            <AlignmentResults result={result} />
            <MutationChart stats={getMutationStats(result)} />
          </div>
        )}

        {!result && !isLoading && (
          <div className="text-center py-20">
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-secondary rounded-full flex items-center justify-center shadow-soft">
                <div className="w-20 h-20 bg-gradient-primary rounded-full animate-glow flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full animate-pulse-slow"></div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-xl opacity-20 animate-pulse-slow"></div>
            </div>
            <h3 className="text-2xl font-semibold text-neutral-700 mb-3">Ready for Analysis</h3>
            <p className="text-neutral-600 text-lg">Enter your DNA sequences above to begin the alignment analysis.</p>
          </div>
        )}
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-neutral-200 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <p className="text-neutral-500 mt-1">
              For bioinformatics research and educational purposes
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;