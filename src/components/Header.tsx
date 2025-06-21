import React from 'react';
import { Dna } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-neutral-200/50 sticky top-0 z-50 shadow-soft">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-medium animate-float">
                <Dna className="w-7 h-7 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-primary rounded-xl blur-lg opacity-30 animate-pulse-slow"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-700">
                DNA <span className="text-transparent bg-gradient-primary bg-clip-text">Aligner</span>
              </h1>
              <p className="text-neutral-600 font-medium">Global Sequence Alignment & Mutation Analysis</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <div className="px-4 py-2 bg-gradient-secondary rounded-full border border-primary-200/50 shadow-soft">
              <span className="text-sm font-semibold text-primary-700">Needleman-Wunsch Algorithm</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};