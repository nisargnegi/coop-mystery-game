import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Star, Play, CheckCircle, MapPin, Users, Key } from 'lucide-react';

export default function CaseSelect({ serverUrl, activeCaseId, onSelectCase, roomCode }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${serverUrl}/api/cases`)
      .then(res => res.json())
      .then(data => {
        setCases(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching cases:", err);
        setLoading(false);
      });
  }, [serverUrl]);

  if (loading) {
    return <div className="text-center p-8 text-gray-400">Loading Cases Catalogue...</div>;
  }

  return (
    <div className="animate-fade-in flex flex-col gap-5">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-1">Select Your Investigation</h2>
        <p className="text-xs sm:text-sm text-gray-400">Choose a case file to investigate with your partner. Progress syncs live.</p>
      </div>

      <div className="grid grid-3 gap-4 sm:gap-6">
        {cases.map((c) => {
          const isCurrent = c.id === activeCaseId;
          const imageSrc = `cases/${c.id}.png`;

          return (
            <div 
              key={c.id} 
              className="case-card flex flex-col justify-between"
              style={{
                padding: 0,
                borderColor: isCurrent ? c.themeColor : 'var(--panel-border)',
                boxShadow: isCurrent ? `0 0 25px ${c.themeColor}44` : 'none'
              }}
            >
              <div>
                {/* Case Thumbnail Image - Compact on mobile (h-32), responsive on desktop (sm:h-44) */}
                <div className="relative h-32 sm:h-44 w-full overflow-hidden bg-slate-950 border-b border-[rgba(148,163,184,0.15)]">
                  <img
                    src={imageSrc}
                    alt={c.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center">
                    <span className="badge backdrop-blur-md" style={{ backgroundColor: `${c.themeColor}33`, color: c.themeColor, border: `1px solid ${c.themeColor}66` }}>
                      {c.genre}
                    </span>
                    <span className="text-[11px] text-white bg-slate-950/80 px-2 py-0.5 rounded backdrop-blur-md flex items-center gap-1 border border-white/10">
                      <Clock size={11} /> {c.playtime}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4">
                  <h3 className="text-base sm:text-lg font-bold mb-1.5" style={{ color: isCurrent ? c.themeColor : '#fff' }}>
                    {c.title}
                  </h3>
                  
                  <p className="text-xs text-gray-300 leading-relaxed mb-3">
                    {c.summary}
                  </p>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 pt-0">
                <div className="flex justify-between items-center mb-3 text-[11px] sm:text-xs text-gray-400 border-t border-[rgba(255,255,255,0.06)] pt-2.5">
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star size={12} className="fill-amber-400" /> {c.difficulty}
                  </span>
                  <span className="text-gray-400">Co-op Sync Ready</span>
                </div>

                <button 
                  className={`btn w-full ${isCurrent ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    backgroundColor: isCurrent ? c.themeColor : 'transparent',
                    color: isCurrent ? '#0f172a' : '#fff'
                  }}
                  onClick={() => onSelectCase(c.id)}
                >
                  {isCurrent ? (
                    <>
                      <CheckCircle size={16} /> Active Case
                    </>
                  ) : (
                    <>
                      <Play size={16} /> Launch Case
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
