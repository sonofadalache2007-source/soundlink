import React, { useState } from 'react';

interface ApproveReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { rating: number; tip: number; review: string }) => void;
  escrowAmount: number;
  producerName: string;
}

export const ApproveReleaseModal: React.FC<ApproveReleaseModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  escrowAmount,
  producerName,
}) => {
  const [rating, setRating] = useState(5);
  const [tip, setTip] = useState<number>(15);
  const [customTip, setCustomTip] = useState<string>('');
  const [review, setReview] = useState('Outstanding mix and master! The vocal punch and stereo clarity on the chorus is radio-ready.');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const tipOptions = [0, 10, 15, 25];

  const handleConfirm = () => {
    const finalTip = tip === -1 ? (parseFloat(customTip) || 0) : tip;
    setIsSuccess(true);
    setTimeout(() => {
      onConfirm({ rating, tip: finalTip, review });
      setIsSuccess(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#191c22] rounded-t-2xl sm:rounded-2xl border border-white/10 shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#1db954]/20 text-[#53e076] flex items-center justify-center ring-8 ring-[#1db954]/10 animate-bounce">
              <span className="material-symbols-outlined text-[36px]">verified</span>
            </div>
            <h3 className="font-headline font-bold text-xl text-white">Funds Released!</h3>
            <p className="text-sm text-[#bccbb9] max-w-xs mx-auto">
              ${(escrowAmount + (tip === -1 ? (parseFloat(customTip) || 0) : tip)).toFixed(2)} USD successfully transferred from escrow to {producerName}.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#53e076]/10 text-[#53e076] text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px]">lock_open</span>
              Order Completed
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#53e076] text-[24px]">verified_user</span>
                <div>
                  <h3 className="font-headline font-bold text-lg text-white">Approve & Release Escrow</h3>
                  <p className="text-xs text-[#bccbb9]">SoundLink Smart Escrow Guarantee</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#272a31] text-[#bccbb9] hover:text-white flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Escrow summary banner */}
            <div className="p-3.5 bg-[#10131a] rounded-xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#bccbb9]">Master Deliverable:</span>
                <span className="font-semibold text-white">Draft_Mix_v2_Mastered.wav</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#bccbb9]">Escrow Held:</span>
                <span className="font-bold text-[#53e076] text-base">${escrowAmount.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#bccbb9]">Producer:</span>
                <span className="text-white font-medium">{producerName}</span>
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-xs font-semibold text-[#bccbb9] uppercase tracking-wider mb-1.5">
                Rate Master Quality & Communication
              </label>
              <div className="flex items-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <span
                      className={`material-symbols-outlined text-[28px] ${
                        star <= rating ? 'text-[#53e076]' : 'text-[#32353c]'
                      }`}
                    >
                      star
                    </span>
                  </button>
                ))}
                <span className="text-xs text-[#53e076] font-bold ml-2">
                  {rating === 5 ? '5.0 Studio Perfect' : `${rating}.0 Great`}
                </span>
              </div>
            </div>

            {/* Add Producer Tip */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#bccbb9] uppercase tracking-wider">
                  Add Producer Tip (Optional)
                </label>
                <span className="text-xs text-[#53e076]">100% goes to producer</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {tipOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setTip(opt)}
                    className={`py-2 px-1 text-xs font-bold rounded-lg border transition-colors ${
                      tip === opt
                        ? 'bg-[#1db954] text-[#003914] border-[#53e076]'
                        : 'bg-[#10131a] text-[#bccbb9] border-white/5 hover:border-white/20'
                    }`}
                  >
                    {opt === 0 ? 'No Tip' : `+$${opt}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Review feedback */}
            <div>
              <label className="block text-xs font-semibold text-[#bccbb9] uppercase tracking-wider mb-1.5">
                Public Review & Testimonial
              </label>
              <textarea
                rows={2}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience working with this engineer..."
                className="w-full bg-[#10131a] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#53e076]"
              />
            </div>

            {/* Escrow Release Notice */}
            <p className="text-[11px] text-[#869585] text-center">
              Releasing escrow transfers all commercial audio rights and locks the master download.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg bg-[#272a31] text-white text-sm font-medium hover:bg-[#32353c] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#1db954] to-[#53e076] text-[#003914] text-sm font-bold shadow-lg shadow-[#1db954]/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">task_alt</span>
                Confirm Release
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
