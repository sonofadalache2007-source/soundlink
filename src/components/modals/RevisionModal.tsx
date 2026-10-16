import React, { useState } from 'react';

interface RevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (revisionData: { timecode: string; stems: string[]; notes: string }) => void;
  revisionsRemaining: number;
}

export const RevisionModal: React.FC<RevisionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  revisionsRemaining,
}) => {
  const [timecode, setTimecode] = useState('01:24');
  const [selectedStems, setSelectedStems] = useState<string[]>(['Lead Vocals', 'Master Bus']);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const stemOptions = [
    'Lead Vocals',
    'Backing Harmonies',
    'Bass & Kick Balance',
    'High-End Sibilance / De-esser',
    'Reverb & Space Tails',
    'Master Bus Limiter',
  ];

  const toggleStem = (stem: string) => {
    setSelectedStems((prev) =>
      prev.includes(stem) ? prev.filter((s) => s !== stem) : [...prev, stem]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      alert('Please enter your revision feedback notes.');
      return;
    }
    onSubmit({ timecode, stems: selectedStems, notes });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#191c22] rounded-t-2xl sm:rounded-2xl border border-white/10 shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#53e076] text-[22px]">restart_alt</span>
            <div>
              <h3 className="font-headline font-bold text-lg text-white">Request Audio Revision</h3>
              <p className="text-xs text-[#bccbb9]">Round 2 of 3 • {revisionsRemaining} revisions remaining</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#272a31] text-[#bccbb9] hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#bccbb9] uppercase tracking-wider mb-1.5">
              Target Song Timecode
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-xs text-[#869585]">timer</span>
                <input
                  type="text"
                  value={timecode}
                  onChange={(e) => setTimecode(e.target.value)}
                  placeholder="e.g. 01:24 or Chorus 2"
                  className="w-full bg-[#10131a] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#53e076]"
                />
              </div>
              <button
                type="button"
                onClick={() => setTimecode('Current Playhead (01:42)')}
                className="px-3 py-2 text-xs bg-[#272a31] hover:bg-[#32353c] text-[#53e076] font-medium rounded-lg whitespace-nowrap"
              >
                Use Playhead
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#bccbb9] uppercase tracking-wider mb-1.5">
              Affected Stems / Frequency Focus
            </label>
            <div className="grid grid-cols-2 gap-2">
              {stemOptions.map((stem) => {
                const checked = selectedStems.includes(stem);
                return (
                  <button
                    key={stem}
                    type="button"
                    onClick={() => toggleStem(stem)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-left border transition-colors ${
                      checked
                        ? 'bg-[#1db954]/20 border-[#53e076] text-white'
                        : 'bg-[#10131a] border-white/5 text-[#bccbb9] hover:border-white/20'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[16px] ${checked ? 'text-[#53e076]' : 'text-[#869585]'}`}>
                      {checked ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                    <span className="truncate">{stem}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#bccbb9] uppercase tracking-wider mb-1.5">
              Specific Engineering Feedback
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Can we bring up the 8k high shelf slightly on the lead vocals during the hook, and ease up on the bus limiter pumping?"
              className="w-full bg-[#10131a] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#53e076] placeholder-[#869585]"
              required
            />
          </div>

          <div className="bg-[#10131a] p-3 rounded-lg border border-white/5 flex items-start gap-2.5 text-xs text-[#bccbb9]">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px] shrink-0 mt-0.5">info</span>
            <p>
              Revisions are addressed within <strong className="text-white">12-24 hours</strong>. Marcus Vance will be notified with your timestamped markers.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg bg-[#272a31] text-white text-sm font-medium hover:bg-[#32353c] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#1db954] to-[#53e076] text-[#003914] text-sm font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              Submit Revision
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
