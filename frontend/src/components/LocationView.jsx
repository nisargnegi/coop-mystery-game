import React, { useState } from 'react';
import { MapPin, Search, Users, Unlock, CheckCircle, ChevronRight, Lock, FileText, User } from 'lucide-react';

export default function LocationView({ caseData, gameState, currentLocation, onSelectLocation, onUnlockClue }) {
  const [selectedSuspect, setSelectedSuspect] = useState(null);

  if (!currentLocation) return <div className="p-4 text-center text-gray-400">Select a location from the map.</div>;

  const unlockedLocations = gameState.unlockedLocations || [];
  const discoveredClues = gameState.discoveredClues || [];
  const caseImageSrc = `cases/${caseData.id}.png`;

  const getSuspectInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="animate-fade-in flex flex-col gap-4 sm:gap-6">
      {/* Location Banner Image - Compact on Mobile (h-32 sm:h-48), full height on Desktop */}
      <div className="relative h-32 sm:h-48 md:h-56 w-full rounded-xl sm:rounded-2xl overflow-hidden border border-[rgba(148,163,184,0.2)] shadow-2xl bg-slate-950">
        <img
          src={caseImageSrc}
          alt={caseData.title}
          className="w-full h-full object-cover brightness-90"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
          <span className="badge mb-1 inline-block" style={{ backgroundColor: `${caseData.themeColor || '#38bdf8'}33`, color: caseData.themeColor || '#38bdf8', border: `1px solid ${caseData.themeColor || '#38bdf8'}66` }}>
            {caseData.genre}
          </span>
          <h2 className="text-lg sm:text-2xl font-extrabold text-white drop-shadow-md flex items-center gap-2">
            <MapPin size={20} style={{ color: caseData.themeColor || '#38bdf8' }} /> {currentLocation.name}
          </h2>
        </div>
      </div>

      {/* Map Location Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[rgba(148,163,184,0.15)] no-scrollbar">
        {caseData.locations.map((loc) => {
          const isUnlocked = unlockedLocations.includes(loc.id);
          const isCurrent = currentLocation.id === loc.id;
          return (
            <button
              key={loc.id}
              disabled={!isUnlocked}
              onClick={() => {
                onSelectLocation(loc);
                setSelectedSuspect(null);
              }}
              className={`btn btn-sm ${isCurrent ? 'btn-primary' : 'btn-outline'}`}
              style={{
                opacity: isUnlocked ? 1 : 0.4,
                whiteSpace: 'nowrap',
                cursor: isUnlocked ? 'pointer' : 'not-allowed'
              }}
            >
              {isUnlocked ? <MapPin size={14} /> : <Lock size={14} />}
              {loc.name}
            </button>
          );
        })}
      </div>

      {/* Scene Description */}
      <div className="glass-panel">
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{currentLocation.description}</p>
      </div>

      <div className="grid grid-2 gap-4 sm:gap-6">
        {/* Hotspots & Investigation */}
        <div className="glass-panel">
          <h3 className="text-sm sm:text-base font-semibold mb-3.5 flex items-center gap-2 text-sky-400">
            <Search size={18} /> Investigate Scene Hotspots
          </h3>

          {currentLocation.hotspots && currentLocation.hotspots.length > 0 ? (
            <div className="flex flex-col gap-3">
              {currentLocation.hotspots.map((spot) => {
                const isClueFound = spot.unlocksClueId && discoveredClues.includes(spot.unlocksClueId);
                return (
                  <div key={spot.id} className="p-3 rounded-xl bg-[rgba(15,23,42,0.6)] border border-[rgba(148,163,184,0.15)] flex gap-3 items-start">
                    <div className="hotspot-badge">
                      <Search size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-xs sm:text-sm font-semibold text-white">{spot.name}</h4>
                        {isClueFound && (
                          <span className="text-[10px] sm:text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                            <CheckCircle size={12} /> Found
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mb-2.5">{spot.description}</p>

                      {spot.unlocksClueId && !isClueFound && (
                        <button
                          className="btn btn-outline btn-sm w-full text-xs py-1.5"
                          onClick={() => onUnlockClue(spot.unlocksClueId, spot.unlocksLocationId)}
                        >
                          <Unlock size={12} /> Inspect & Collect Proof
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-400">No further items to examine at this scene.</p>
          )}
        </div>

        {/* Suspect Interrogation */}
        <div className="glass-panel">
          <h3 className="text-sm sm:text-base font-semibold mb-3.5 flex items-center gap-2 text-purple-400">
            <Users size={18} /> Interrogate Suspects
          </h3>

          {currentLocation.suspects && currentLocation.suspects.length > 0 ? (
            <div className="flex flex-col gap-3 sm:gap-4">
              {currentLocation.suspects.map((suspect) => (
                <div key={suspect.id} className="p-3 rounded-xl bg-[rgba(15,23,42,0.6)] border border-[rgba(148,163,184,0.15)]">
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="suspect-avatar">
                      {getSuspectInitials(suspect.name)}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">{suspect.name}</h4>
                      <p className="text-[11px] text-gray-400">{suspect.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {suspect.dialogueOptions.map((opt) => {
                      const hasReqClue = !opt.requiredClueId || discoveredClues.includes(opt.requiredClueId);
                      const isOptionUnlocked = opt.unlocksClueId && discoveredClues.includes(opt.unlocksClueId);

                      return (
                        <details key={opt.id} className="text-xs bg-[rgba(0,0,0,0.35)] rounded-lg p-2.5 border border-[rgba(148,163,184,0.12)]">
                          <summary className={`cursor-pointer font-medium flex justify-between items-center ${hasReqClue ? 'text-gray-200' : 'text-gray-500'}`}>
                            <span>{hasReqClue ? `❓ ${opt.text}` : `🔒 [Confrontation Evidence Needed]`}</span>
                          </summary>

                          {hasReqClue && (
                            <div className="mt-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
                              <p className="italic text-gray-300 mb-2 leading-relaxed">"{opt.response}"</p>
                              {opt.unlocksClueId && !isOptionUnlocked && (
                                <button
                                  className="btn btn-primary btn-sm text-xs py-1"
                                  onClick={() => onUnlockClue(opt.unlocksClueId)}
                                >
                                  Note Testimony Clue
                                </button>
                              )}
                            </div>
                          )}
                        </details>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">No persons present at this location.</p>
          )}
        </div>
      </div>
    </div>
  );
}
