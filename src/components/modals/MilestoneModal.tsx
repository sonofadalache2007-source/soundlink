import React from 'react';
import { Milestone } from '../../types/order';

interface MilestoneModalProps {
  milestone: Milestone | null;
  onClose: () => void;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({ milestone, onClose }) => {
  if (!milestone) return null;

  const milestoneDetails: Record<string, { deliverables: string[]; rules: string[]; eta: string }> = {
    m1: {
      deliverables: ['Lead vocal WAV stem 24-bit 48kHz', 'Reference instrumental MP3 track', 'BPM: 128 / Key: D Minor note'],
      rules: ['Stems must not be clipping (below -3dB true peak)', 'Dry vocals without baked-in reverbs'],
      eta: 'Completed yesterday at 4:15 PM',
    },
    m2: {
      deliverables: ['Celemony Melodyne pitch correction', 'Analog hardware pass: Neve 1073 EQ + Tube', 'LA-2A optical compression leveling'],
      rules: ['A/B Master preview rendered with -0.3dB True Peak', 'Stereo imaging phase checked'],
      eta: 'Currently active in mixing suite',
    },
    m3: {
      deliverables: ['High-res 24-bit 96kHz Master WAV', 'Streaming LUFS (-14 LUFS) & Club (-8 LUFS) masters', 'Acapella tuned & processed stem package'],
      rules: ['All stem stems aligned to sample grid', 'Includes instrumental performance version'],
      eta: 'Scheduled delivery: Tomorrow at 2:00 PM',
    },
    m4: {
      deliverables: ['Full commercial rights license release', 'SoundLink Escrow $150.00 payout release', 'Final stems archive ZIP bundle'],
      rules: ['Requires client approval or auto-release window completion'],
      eta: 'Scheduled delivery: Tomorrow at 6:00 PM',
    },
  };

  const detail = milestoneDetails[milestone.id] || {
    deliverables: ['Standard audio stem delivery'],
    rules: ['Subject to SoundLink terms of service'],
    eta: 'Pending',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#191c22] rounded-t-2xl sm:rounded-2xl border border-white/10 shadow-2xl p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              milestone.status === 'done'
                ? 'bg-[#1db954] text-[#003914]'
                : milestone.status === 'active'
                ? 'bg-[#1db954]/20 text-[#53e076] ring-2 ring-[#53e076]'
                : 'bg-[#32353c] text-[#bccbb9]'
            }`}>
              <span className="material-symbols-outlined text-[18px]">{milestone.icon}</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-lg text-white">Milestone: {milestone.name}</h3>
              <p className="text-xs text-[#53e076] font-medium capitalize">Status: {milestone.subtext}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#272a31] text-[#bccbb9] hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-[#bccbb9] leading-relaxed">
            {milestone.description}
          </p>

          <div className="bg-[#10131a] p-3 rounded-xl border border-white/5 space-y-2">
            <span className="text-[11px] font-bold text-[#869585] uppercase tracking-wider block">
              Deliverables & Requirements
            </span>
            <ul className="space-y-1.5">
              {detail.deliverables.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-white">
                  <span className="material-symbols-outlined text-[#53e076] text-[16px] shrink-0 mt-0.5">check_circle</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between px-3 py-2 bg-[#272a31]/50 rounded-lg text-xs text-[#bccbb9]">
            <span>Timeline:</span>
            <span className="font-semibold text-white">{detail.eta}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-lg bg-[#272a31] text-white text-sm font-medium hover:bg-[#32353c] transition-colors"
        >
          Close Milestone Details
        </button>
      </div>
    </div>
  );
};
