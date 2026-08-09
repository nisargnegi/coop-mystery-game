import React, { useState } from 'react';
import { MapPin, Search, Users, Unlock, CheckCircle, ChevronRight, Lock } from 'lucide-react';

export default function LocationView({ caseData, gameState, currentLocation, onSelectLocation, onUnlockClue }) {
  const [selectedSuspect, setSelectedSuspect] = useState(null);

  if (!currentLocation) return <div>Select a location from the map.</div>;

  const unlockedLocations = gameState.unlockedLocations || [];
  const discoveredClues = gameState.discoveredClues || [];
  const caseImageSrc = `cases/${caseData.id}.png`;

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      {/* Location Banner Image */}
      <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden border border-[rgba(148,163,184,0.2)] shadow-2xl bg-slate-950">
        <img
          src={caseImageSrc}
          alt={caseData.title}
          className="w-full h-full object-cover brightness-90"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        <div className="absolute bottom-4 left-4 right-4">
          <span className="badge mb-1 inline-block" style={{ backgroundColor: `${caseData.themeColor || '#38bdf8'}33`, color: caseData.themeColor || '#38bdf8', border: `1px solid ${caseData.themeColor || '#38bdf8'}66` }}>
            {caseData.genre}
          </span>
          <h2 className="text-2xl font-extrabold text-white drop-shadow-md">
            {currentLocation.name}
          </h2>
        </div>
      </div>

      {/* Map Header Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[rgba(148,163,184,0.15)]">
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

      {/* Main Location Info */}
      <div className="glass-panel">
        <p className="text-sm text-gray-300 leading-relaxed">{currentLocation.description}</p>
      </div>

      <div className="grid grid-2 gap-6">
        {/* Hotspots & Investigation */}
        <div className="glass-panel">
          <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-sky-400">
            <Search size={18} /> Investigate Hotspots
          </h3>

          {currentLocation.hotspots && currentLocation.hotspots.length > 0 ? (
            <div className="flex flex-col gap-3">
              {currentLocation.hotspots.map((spot) => {
                const isClueFound = spot.unlocksClueId && discoveredClues.includes(spot.unlocksClueId);
                return (
                  <div key={spot.id} className="p-3 rounded-lg bg-[rgba(15,23,42,0.6)] border border-[rgba(148,163,184,0.15)]">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-semibold text-white">{spot.name}</h4>
                      {isClueFound && (
                        <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                          <CheckCircle size={12} /> Discovered
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-3">{spot.description}</p>

                    {spot.unlocksClueId && !isClueFound && (
                      <button
                        className="btn btn-outline btn-sm w-full text-xs"
                        onClick={() => onUnlockClue(spot.unlocksClueId, spot.unlocksLocationId)}
                      >
                        <Unlock size={12} /> Inspect & Note Evidence
                      </button>
                    )}
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
          <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-purple-400">
            <Users size={18} /> Interrogate Suspects
          </h3>

          {currentLocation.suspects && currentLocation.suspects.length > 0 ? (
            <div className="flex flex-col gap-4">
              {currentLocation.suspects.map((suspect) => (
                <div key={suspect.id} className="p-3 rounded-lg bg-[rgba(15,23,42,0.6)] border border-[rgba(148,163,184,0.15)]">
                  <h4 className="text-sm font-semibold text-white mb-1">{suspect.name}</h4>
                  <p className="text-xs text-gray-400 mb-3">{suspect.description}</p>

                  <div className="flex flex-col gap-2">
                    {suspect.dialogueOptions.map((opt) => {
                      const hasReqClue = !opt.requiredClueId || discoveredClues.includes(opt.requiredClueId);
                      const isOptionUnlocked = opt.unlocksClueId && discoveredClues.includes(opt.unlocksClueId);

                      return (
                        <details key={opt.id} className="text-xs bg-[rgba(0,0,0,0.3)] rounded p-2 border border-[rgba(148,163,184,0.1)]">
                          <summary className={`cursor-pointer font-medium flex justify-between items-center ${hasReqClue ? 'text-gray-200' : 'text-gray-500'}`}>
                            <span>{hasReqClue ? `❓ ${opt.text}` : `🔒 [Confrontation Evidence Needed]`}</span>
                          </summary>

                          {hasReqClue && (
                            <div className="mt-2 pt-2 border-t border-[rgba(255,255,255,0.05)]">
                              <p className="italic text-gray-300 mb-2">"{opt.response}"</p>
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
