import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Star, Play, CheckCircle } from 'lucide-react';

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
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Select Your Investigation</h2>
        <p className="text-sm text-gray-400">Choose a case file to investigate with your partner. All progress syncs live.</p>
      </div>

      <div className="grid grid-3 gap-6">
        {cases.map((c) => {
          const isCurrent = c.id === activeCaseId;
          const imageSrc = `/cases/${c.id}.png`;

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
                {/* Case Thumbnail Image */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900 border-b border-[rgba(148,163,184,0.15)]">
                  <img
                    src={imageSrc}
                    alt={c.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                    <span className="badge backdrop-blur-md" style={{ backgroundColor: `${c.themeColor}33`, color: c.themeColor, border: `1px solid ${c.themeColor}66` }}>
                      {c.genre}
                    </span>
                    <span className="text-xs text-white bg-slate-900/80 px-2 py-1 rounded backdrop-blur-md flex items-center gap-1 border border-white/10">
                      <Clock size={12} /> {c.playtime}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2" style={{ color: isCurrent ? c.themeColor : '#fff' }}>
                    {c.title}
                  </h3>
                  
                  <p className="text-xs text-gray-300 leading-relaxed mb-4">
                    {c.summary}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="flex justify-between items-center mb-3 text-xs text-gray-400 border-t border-[rgba(255,255,255,0.05)] pt-3">
                  <span>Difficulty: <strong className="text-amber-400">{c.difficulty}</strong></span>
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
