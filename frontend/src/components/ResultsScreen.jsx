import React from 'react';
import { Award, AlertCircle, RotateCcw, CheckCircle } from 'lucide-react';

export default function ResultsScreen({ caseData, gameState, onResetGame, onSelectDifferentCase }) {
  const result = gameState.accusationResult || {};
  const isSolved = gameState.solved;

  return (
    <div className="animate-fade-in flex flex-col gap-6 max-w-2xl mx-auto py-8">
      <div 
        className="glass-panel text-center p-8"
        style={{
          borderColor: isSolved ? 'var(--success)' : 'var(--danger)',
          boxShadow: isSolved ? '0 0 40px rgba(34, 197, 94, 0.25)' : '0 0 40px rgba(239, 68, 68, 0.25)'
        }}
      >
        {isSolved ? (
          <CheckCircle size={64} className="mx-auto mb-4 text-emerald-400 animate-bounce" />
        ) : (
          <AlertCircle size={64} className="mx-auto mb-4 text-red-500" />
        )}

        <h1 className="text-3xl font-extrabold mb-2" style={{ color: isSolved ? 'var(--success)' : 'var(--danger)' }}>
          {isSolved ? 'CASE CLOSED — VICTORY!' : 'INVESTIGATION FAILED'}
        </h1>

        <p className="text-sm text-gray-300 mb-6 font-medium">
          {isSolved ? `You and your partner successfully unmasked the culprit!` : `The killer escaped justice.`}
        </p>

        {/* Narrative Explanation */}
        <div className="p-4 rounded-xl bg-[rgba(15,23,42,0.8)] border border-[rgba(148,163,184,0.15)] text-left mb-6">
          <h3 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
            <Award size={16} /> Official Case Resolution
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed font-serif">
            {result.explanation || caseData.solution?.explanation}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="btn btn-primary w-full" onClick={onResetGame}>
            <RotateCcw size={16} /> Replay Case
          </button>
          <button className="btn btn-outline w-full" onClick={onSelectDifferentCase}>
            Select Another Case
          </button>
        </div>
      </div>
    </div>
  );
}
