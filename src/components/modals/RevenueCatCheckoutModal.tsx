import React, { useState, useEffect } from 'react';
import { revenueCat, RevenueCatPlan, DEFAULT_PLANS } from '../../services/revenuecat';

interface RevenueCatCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (plan: RevenueCatPlan) => void;
  initialPlanId?: string;
}

export const RevenueCatCheckoutModal: React.FC<RevenueCatCheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialPlanId = 'monthly',
}) => {
  const [plans, setPlans] = useState<RevenueCatPlan[]>(DEFAULT_PLANS);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      revenueCat.init();
      revenueCat.getPlans().then((loadedPlans) => {
        if (loadedPlans && loadedPlans.length > 0) {
          setPlans(loadedPlans);
        }
      });
      setSelectedPlanId(initialPlanId);
      setIsSuccess(false);
      setErrorMessage(null);
    }
  }, [isOpen, initialPlanId]);

  if (!isOpen) return null;

  const currentPlan = plans.find((p) => p.identifier === selectedPlanId) || plans[0];
  const isLive = revenueCat.isLive();

  const handleCheckout = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    const result = await revenueCat.purchase(currentPlan);
    setIsProcessing(false);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(currentPlan);
        onClose();
      }, 1600);
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#191c22] rounded-t-2xl sm:rounded-2xl border border-white/10 shadow-2xl p-5 space-y-4 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#1db954]/20 text-[#53e076] flex items-center justify-center ring-8 ring-[#1db954]/10 animate-bounce">
              <span className="material-symbols-outlined text-[36px]">verified</span>
            </div>
            <h3 className="font-headline font-bold text-xl text-white">Payment Confirmed!</h3>
            <p className="text-sm text-[#bccbb9] max-w-xs mx-auto">
              Your {currentPlan.title} is now active. All entitlements and escrow features unlocked.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#53e076]/10 text-[#53e076] text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px]">credit_card</span>
              RevenueCat Verified Receipt
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#e75252]/20 text-[#e75252] flex items-center justify-center font-bold text-xs">
                  RC
                </div>
                <div>
                  <h3 className="font-headline font-bold text-base text-white">SoundLink Checkout</h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#bccbb9]">
                    <span>Powered by RevenueCat</span>
                    <span className="text-[#3d4a3d]">•</span>
                    <span className={isLive ? 'text-[#53e076]' : 'text-[#4cd7f6]'}>
                      {isLive ? 'Live Web Billing' : 'Sandbox Test Mode'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#272a31] text-[#bccbb9] hover:text-white flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Plan Selector */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-[#869585] uppercase tracking-wider">Select Subscription or Escrow Package</p>
              {plans.map((plan) => {
                const isSelected = plan.identifier === selectedPlanId;
                return (
                  <div
                    key={plan.identifier}
                    onClick={() => setSelectedPlanId(plan.identifier)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#1db954]/10 border-[#53e076] shadow-md'
                        : 'bg-[#10131a] border-white/5 hover:border-white/15'
                    }`}
                  >
                    {plan.badge && (
                      <span className="absolute top-2.5 right-2.5 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#1db954] text-[#003914]">
                        {plan.badge}
                      </span>
                    )}
                    <div className="flex items-start justify-between pr-16">
                      <div>
                        <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                          {plan.title}
                        </h4>
                        <p className="text-[11px] text-[#bccbb9] mt-0.5 line-clamp-1">{plan.description}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="font-headline font-extrabold text-sm text-[#53e076]">{plan.priceString}</span>
                      <span className={`text-[11px] flex items-center gap-1 ${isSelected ? 'text-[#53e076] font-bold' : 'text-[#869585]'}`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                        </span>
                        {isSelected ? 'Selected' : 'Select'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Features Checklist */}
            <div className="bg-[#10131a] p-3 rounded-xl border border-white/5 space-y-1.5">
              <p className="text-[11px] font-bold text-[#869585] uppercase tracking-wider">Included with {currentPlan.title}</p>
              <ul className="space-y-1">
                {currentPlan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-[#bccbb9]">
                    <span className="material-symbols-outlined text-[#53e076] text-[15px] shrink-0">check_circle</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                {errorMessage}
              </div>
            )}

            {/* RevenueCat Security info */}
            <div className="flex items-center justify-between text-[11px] text-[#869585] px-1">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#53e076]">lock</span>
                256-bit Encrypted Checkout
              </span>
              <span>Cancel or adjust anytime</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg bg-[#272a31] text-white text-xs font-semibold hover:bg-[#32353c] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#1db954] to-[#53e076] text-[#003914] text-xs font-bold shadow-lg shadow-[#1db954]/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">credit_card</span>
                    Pay {currentPlan.priceString}
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
