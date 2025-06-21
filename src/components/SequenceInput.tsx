import React, { useState } from 'react';
import { Play, RotateCcw, FileText, AlertCircle, Dna } from 'lucide-react';
import { validateDNASequence } from '../utils/alignmentAlgorithm';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'; // 👈 Required for Vite

GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const extractTextFromFile = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map((item: any) => item.str).join(' ') + ' ';
  }

  // Match any word that's only A, T, C, G and at least 5 bases long
  const matches = fullText.match(/\b[ATCG]{5,}\b/gi); // 🧬 Smart fix

  if (!matches || matches.length === 0) {
    alert("⚠️ No valid DNA sequence found in the uploaded file.");
    return '';
  }

  return matches.join('');
};




interface SequenceInputProps {
  onAlign: (seq1: string, seq2: string) => void;
  isLoading?: boolean;
}

const EXAMPLE_SEQUENCES = [
  {
    name: 'High Similarity',
    seq1: 'ATCGATCGATCG',
    seq2: 'ATCGATCGATCG',
  },
  {
    name: 'With Mutations',
    seq1: 'ATCGATCGATCG',
    seq2: 'ATCGATGCATCG',
  },
  {
    name: 'With Gaps',
    seq1: 'ATCGATCGATCGATCG',
    seq2: 'ATCGATCGCGATCG',
  },
];

export const SequenceInput: React.FC<SequenceInputProps> = ({ onAlign, isLoading }) => {
  const [seq1, setSeq1] = useState('');
  const [seq2, setSeq2] = useState('');
  const [errors, setErrors] = useState<{ seq1?: string; seq2?: string }>({});
  const handleRefUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const text = await extractTextFromFile(file); // you'll define this soon
  const dnaOnly = text.replace(/[^ATCG]/gi, '');
  setSeq1(dnaOnly);
};

const handleQueryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const text = await extractTextFromFile(file);
  const dnaOnly = text.replace(/[^ATCG]/gi, '');
  setSeq2(dnaOnly);
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation1 = validateDNASequence(seq1);
    const validation2 = validateDNASequence(seq2);
    
    const newErrors: { seq1?: string; seq2?: string } = {};
    if (!validation1.isValid) newErrors.seq1 = validation1.error;
    if (!validation2.isValid) newErrors.seq2 = validation2.error;
    
    setErrors(newErrors);
    
    if (validation1.isValid && validation2.isValid) {
      onAlign(seq1.trim().toUpperCase(), seq2.trim().toUpperCase());
    }
  };

  const handleReset = () => {
    setSeq1('');
    setSeq2('');
    setErrors({});
  };

  const loadExample = (example: typeof EXAMPLE_SEQUENCES[0]) => {
    setSeq1(example.seq1);
    setSeq2(example.seq2);
    setErrors({});
  };

  return (
    <div className="bg-gradient-card rounded-2xl shadow-medium border border-neutral-200/50 p-8 animate-fade-in backdrop-blur-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-700">DNA Sequence Input</h2>
            <p className="text-neutral-600">Enter your sequences for alignment analysis</p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-neutral-700 hover:bg-neutral-100 rounded-xl transition-all duration-200 shadow-soft hover:shadow-medium"
          disabled={isLoading}
        >
          <RotateCcw className="w-4 h-4" />
          <span className="font-medium">Reset</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label htmlFor="seq1" className="block text-lg font-semibold text-neutral-700 flex items-center gap-2">
              <Dna className="w-5 h-5 text-primary-500" />
              Reference Sequence
            </label>
            <div>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleRefUpload}
                className="block w-full text-sm text-neutral-600 border border-neutral-300 rounded-lg cursor-pointer bg-white hover:bg-neutral-100"
                disabled={isLoading}
              />
              <p className="text-xs text-neutral-400 mt-1">Upload PDF or DOCX for Reference Sequence</p>
            </div>

            <textarea
              id="seq1"
              value={seq1}
              onChange={(e) => setSeq1(e.target.value)}
              placeholder="Enter DNA sequence (A, T, C, G only)..."
              className={`w-full px-4 py-4 border-2 rounded-xl font-mono text-sm resize-none h-36 focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 shadow-soft ${
                errors.seq1 ? 'border-red-300 bg-red-50/50' : 'border-neutral-300 bg-white/80'
              }`}
              disabled={isLoading}
            />
            {errors.seq1 && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {errors.seq1}
              </div>
            )}
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-500">Length: {seq1.length} characters</span>
              <div className="flex gap-1">
                {['A', 'T', 'C', 'G'].map((base, i) => (
                  <div key={base} className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      i === 0 ? 'bg-dna-adenine' : 
                      i === 1 ? 'bg-dna-thymine' : 
                      i === 2 ? 'bg-dna-cytosine' : 'bg-dna-guanine'
                    }`}></div>
                    <span className="text-xs text-neutral-500">{base}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="seq2" className="block text-lg font-semibold text-neutral-700 flex items-center gap-2">
              <Dna className="w-5 h-5 text-accent-400" />
              Query Sequence
            </label>
            <div>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleQueryUpload}
              className="block w-full text-sm text-neutral-600 border border-neutral-300 rounded-lg cursor-pointer bg-white hover:bg-neutral-100"
              disabled={isLoading}
            />
            <p className="text-xs text-neutral-400 mt-1">Upload PDF or DOCX for Query Sequence</p>
          </div>

            <textarea
              id="seq2"
              value={seq2}
              onChange={(e) => setSeq2(e.target.value)}
              placeholder="Enter DNA sequence (A, T, C, G only)..."
              className={`w-full px-4 py-4 border-2 rounded-xl font-mono text-sm resize-none h-36 focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 shadow-soft ${
                errors.seq2 ? 'border-red-300 bg-red-50/50' : 'border-neutral-300 bg-white/80'
              }`}
              disabled={isLoading}
            />
            {errors.seq2 && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {errors.seq2}
              </div>
            )}
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-500">Length: {seq2.length} characters</span>
              <div className="flex gap-1">
                {['A', 'T', 'C', 'G'].map((base, i) => (
                  <div key={base} className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      i === 0 ? 'bg-dna-adenine' : 
                      i === 1 ? 'bg-dna-thymine' : 
                      i === 2 ? 'bg-dna-cytosine' : 'bg-dna-guanine'
                    }`}></div>
                    <span className="text-xs text-neutral-500">{base}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-gradient-secondary rounded-xl p-6 border border-primary-200/30">
          <div className="flex flex-wrap gap-3">
            <span className="text-sm font-semibold text-neutral-700 mb-2 lg:mb-0">Quick Examples:</span>
            {EXAMPLE_SEQUENCES.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => loadExample(example)}
                className="px-4 py-2 bg-white/80 hover:bg-white text-primary-700 hover:text-primary-800 rounded-lg font-medium transition-all duration-200 shadow-soft hover:shadow-medium border border-primary-200/50 hover:border-primary-300"
                disabled={isLoading}
              >
                {example.name}
              </button>
            ))}
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !seq1.trim() || !seq2.trim()}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-primary hover:shadow-strong disabled:bg-neutral-300 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all duration-200 min-w-[180px] justify-center shadow-medium hover:scale-105 transform"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Align Sequences
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};