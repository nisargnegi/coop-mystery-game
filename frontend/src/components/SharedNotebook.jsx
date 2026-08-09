import React from 'react';
import { Edit3, Users } from 'lucide-react';

export default function SharedNotebook({ notes, onNotesChange }) {
  return (
    <div className="animate-fade-in glass-panel flex flex-col gap-3">
      <div className="flex justify-between items-center border-b border-[rgba(148,163,184,0.15)] pb-3">
        <h3 className="text-base font-bold flex items-center gap-2 text-amber-400">
          <Edit3 size={18} /> Shared Detective Notebook
        </h3>
        <span className="text-xs text-emerald-400 flex items-center gap-1">
          <Users size={12} /> Synced with Partner
        </span>
      </div>

      <p className="text-xs text-gray-400">
        Type notes, alibi timelines, and suspect suspicions below. Edits are synchronized live in real-time between both players.
      </p>

      <textarea
        rows={10}
        value={notes || ''}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Write down your theories here... (e.g. 'Dot claims she was in her office at 11pm, but Rosie's eyewitness account contradicts her!')"
        className="input-field text-sm font-mono leading-relaxed"
        style={{ resize: 'vertical' }}
      />
    </div>
  );
}
