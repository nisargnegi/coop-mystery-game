import React, { useState } from 'react';
import { Key, Filter, FileText, Activity, MessageSquare, Cpu } from 'lucide-react';

export default function EvidenceBoard({ caseData, gameState }) {
  const [filterType, setFilterType] = useState('all');

  const discoveredIds = gameState.discoveredClues || [];
  const discoveredClues = (caseData.clues || []).filter(c => discoveredIds.includes(c.id));

  const filteredClues = filterType === 'all' 
    ? discoveredClues 
    : discoveredClues.filter(c => c.type === filterType);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'physical': return <Activity size={14} className="text-amber-400" />;
      case 'testimony': return <MessageSquare size={14} className="text-purple-400" />;
      case 'document': return <FileText size={14} className="text-sky-400" />;
      case 'digital': return <Cpu size={14} className="text-cyan-400" />;
      default: return <Key size={14} />;
    }
  };

  return (
    <div className="animate-fade-in flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[rgba(148,163,184,0.15)] pb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Key size={20} className="text-sky-400" /> Evidence Locker
          </h2>
          <p className="text-xs text-gray-400">
            {discoveredClues.length} of {caseData.clues?.length || 0} Clues Uncovered
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-1 bg-[rgba(15,23,42,0.6)] p-1 rounded-lg border border-[rgba(148,163,184,0.15)]">
          {['all', 'physical', 'testimony', 'document', 'digital'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`btn btn-sm ${filterType === type ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', textTransform: 'capitalize' }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {filteredClues.length === 0 ? (
        <div className="text-center p-12 text-gray-500 text-sm">
          No evidence of this category has been uncovered yet. Explore more locations and interrogate suspects!
        </div>
      ) : (
        <div className="grid grid-2 gap-4">
          {filteredClues.map((clue) => (
            <div key={clue.id} className="clue-card">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  {getTypeIcon(clue.type)} {clue.name}
                </h4>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[rgba(255,255,255,0.05)] text-gray-400">
                  {clue.type}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{clue.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
