import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'card' | 'badge';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed or running as standalone, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'card') {
      return (
        <div className="bg-[#191c22] rounded-xl p-3.5 border border-[#53e076]/30 shadow-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#53e076]/20 text-[#53e076] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">download_for_offline</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Install SoundLink App</p>
              <p className="text-[11px] text-[#bccbb9] truncate">Fast offline access & low latency audio</p>
            </div>
          </div>
          <button
            onClick={install}
            className="px-3 py-1.5 rounded-lg bg-[#1db954] hover:bg-[#53e076] text-[#003914] text-xs font-bold whitespace-nowrap active:scale-95 transition-all shadow-md"
          >
            Install
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#53e076]/15 hover:bg-[#53e076]/25 border border-[#53e076]/40 text-[#53e076] text-xs font-semibold active:scale-95 transition-all"
        title="Install SoundLink App"
      >
        <span className="material-symbols-outlined text-[16px]">install_mobile</span>
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#53e076]/15 hover:bg-[#53e076]/25 border border-[#53e076]/40 text-[#53e076] text-xs font-semibold active:scale-95 transition-all"
          title="Install on iPhone / iPad"
        >
          <span className="material-symbols-outlined text-[16px]">ios_share</span>
          <span className="hidden sm:inline">Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-[#191c22] border border-white/10 p-5 shadow-2xl text-left space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#53e076] text-[22px]">phone_iphone</span>
                  <h3 className="font-headline font-bold text-base text-white">Install on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="w-7 h-7 rounded-full bg-[#272a31] text-[#bccbb9] hover:text-white flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-[#bccbb9]">
                <div className="flex items-start gap-2.5 bg-[#10131a] p-2.5 rounded-lg border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-[#53e076] text-[#003914] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <p>Tap the <strong className="text-white">Share</strong> button (box with upward arrow) in the Safari toolbar.</p>
                </div>
                <div className="flex items-start gap-2.5 bg-[#10131a] p-2.5 rounded-lg border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-[#53e076] text-[#003914] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <p>Scroll down and select <strong className="text-white">Add to Home Screen</strong>.</p>
                </div>
                <div className="flex items-start gap-2.5 bg-[#10131a] p-2.5 rounded-lg border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-[#53e076] text-[#003914] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <p>Tap <strong className="text-white">Add</strong> in the top-right corner to launch SoundLink full-screen.</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-lg bg-[#272a31] hover:bg-[#32353c] text-white text-xs font-semibold transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
