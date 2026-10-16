import React, { useState } from 'react';

interface QuickReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
  producerName: string;
}

export const QuickReplyModal: React.FC<QuickReplyModalProps> = ({
  isOpen,
  onClose,
  onSend,
  producerName,
}) => {
  const [replyText, setReplyText] = useState('');
  const [quickPills] = useState([
    'Sounds incredible! Vocal transients punch through nicely.',
    'Can we check the reverb level on the bridge?',
    'What LUFS target did you master to?',
    'Approved on my studio monitors, sending to car test!',
  ]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSend(replyText);
    setReplyText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#191c22] rounded-t-2xl sm:rounded-2xl border border-white/10 shadow-2xl p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#53e076] text-[22px]">reply</span>
            <div>
              <h3 className="font-headline font-bold text-base text-white">Reply to {producerName}</h3>
              <p className="text-xs text-[#bccbb9]">Studio Insight Message</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#272a31] text-[#bccbb9] hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold text-[#869585] uppercase tracking-wider">Quick Suggestions</p>
          <div className="flex flex-wrap gap-1.5">
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setReplyText(pill)}
                className="text-left text-xs bg-[#10131a] hover:bg-[#272a31] text-[#bccbb9] hover:text-white border border-white/5 rounded-lg px-2.5 py-1.5 transition-colors"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <textarea
            rows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Message ${producerName}...`}
            className="w-full bg-[#10131a] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#53e076]"
            autoFocus
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg bg-[#272a31] text-white text-sm font-medium hover:bg-[#32353c] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-[#1db954] hover:bg-[#53e076] text-[#003914] text-sm font-bold shadow-lg shadow-[#1db954]/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              Send Reply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
