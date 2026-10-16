import React, { useState } from 'react';
import { Order } from '../../types/order';

interface ServicesScreenProps {
  onBookService: (serviceName: string, price: number, turnaround: string) => void;
  onNavigateToOrder: () => void;
}

export const ServicesScreen: React.FC<ServicesScreenProps> = ({ onBookService, onNavigateToOrder }) => {
  const [selectedTier, setSelectedTier] = useState<string>('pro');
  const [addons, setAddons] = useState<{ [key: string]: boolean }>({
    rushDelivery: false,
    instrumentalStems: true,
    dolbyAtmosFile: false,
  });

  const tiers = [
    {
      id: 'standard',
      name: 'Single Master Pass',
      price: 75,
      turnaround: '48 hours',
      popular: false,
      features: [
        'Stereo WAV Master (16-bit 44.1kHz)',
        'True Peak Limiting (-0.5dB TP)',
        '1 Revision Round included',
        'Streaming LUFS Target (-14 LUFS)',
      ],
    },
    {
      id: 'pro',
      name: 'Billboard Vocal Mix & Master',
      price: 150,
      turnaround: '24 hours',
      popular: true,
      current: true,
      features: [
        'Analog Hardware Pass (Neve 1073 + Tube-Tech)',
        'Celemony Melodyne Surgical Vocal Tuning',
        '3 Revision Rounds with A/B Waveform Scrubber',
        'Hi-Res 24-bit 96kHz + Club & Streaming Masters',
        'Dedicated Producer Feedback Notes',
      ],
    },
    {
      id: 'atmos',
      name: 'Dolby Atmos Spatial Suite',
      price: 300,
      turnaround: '3 days',
      popular: false,
      features: [
        '7.1.4 Dolby Atmos Immersive Master Bed',
        'Up to 128 Spatial Panned Objects',
        'ADM BWF Delivery with Apple Spatial Binaural Render',
        'Unlimited Revision Rounds',
        'Full Stem Archive ZIP bundle',
      ],
    },
  ];

  const currentTier = tiers.find((t) => t.id === selectedTier) || tiers[1];

  let totalPrice = currentTier.price;
  if (addons.rushDelivery) totalPrice += 45;
  if (addons.instrumentalStems) totalPrice += 25;
  if (addons.dolbyAtmosFile) totalPrice += 75;

  const toggleAddon = (key: string) => {
    setAddons((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-16 pb-28 bg-[#10131a]">
      <div className="max-w-md mx-auto w-full space-y-4 px-3 sm:px-4">
        {/* Header */}
        <div className="pt-2 text-center space-y-1">
          <span className="text-[10px] font-bold tracking-wider uppercase text-[#53e076] bg-[#1db954]/15 px-2.5 py-0.5 rounded-full inline-block">
            Studio Packages
          </span>
          <h2 className="font-headline font-bold text-xl text-white">Audio Engineering Services</h2>
          <p className="text-xs text-[#bccbb9]">All studio orders backed by SoundLink Escrow Protection</p>
        </div>

        {/* Tier Selector Cards */}
        <div className="space-y-3">
          {tiers.map((tier) => {
            const isSelected = selectedTier === tier.id;
            return (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#191c22] border-[#53e076] shadow-xl shadow-[#1db954]/10'
                    : 'bg-[#191c22]/70 border-white/5 hover:border-white/20'
                }`}
              >
                {tier.popular && (
                  <span className="absolute top-3 right-3 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#1db954] text-[#003914]">
                    MOST POPULAR
                  </span>
                )}
                {tier.current && (
                  <span className="absolute bottom-3 right-3 text-[10px] text-[#4cd7f6] bg-[#00b0cd]/20 px-2 py-0.5 rounded-full font-semibold">
                    Current Order #SL-88492
                  </span>
                )}

                <div className="flex items-center justify-between pr-20">
                  <div>
                    <h3 className="font-headline font-bold text-sm text-white">{tier.name}</h3>
                    <p className="text-[11px] text-[#53e076] font-medium">Turnaround: {tier.turnaround}</p>
                  </div>
                </div>

                <div className="mt-2 text-lg font-bold text-white">
                  ${tier.price} <span className="text-xs font-normal text-[#869585]">USD</span>
                </div>

                <ul className="mt-3 space-y-1.5 border-t border-white/5 pt-3">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#bccbb9]">
                      <span className="material-symbols-outlined text-[#53e076] text-[16px] shrink-0 mt-0.5">
                        check
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Add-ons Section */}
        <div className="bg-[#191c22] rounded-xl p-4 shadow-lg border border-white/5 space-y-3">
          <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-[#869585]">
            Custom Studio Add-ons
          </h4>

          <div className="space-y-2">
            <button
              onClick={() => toggleAddon('rushDelivery')}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left text-xs transition-colors ${
                addons.rushDelivery
                  ? 'bg-[#1db954]/15 border-[#53e076] text-white'
                  : 'bg-[#10131a] border-white/5 text-[#bccbb9]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-[18px] ${addons.rushDelivery ? 'text-[#53e076]' : 'text-[#869585]'}`}>
                  {addons.rushDelivery ? 'check_box' : 'check_box_outline_blank'}
                </span>
                <span>24-Hour Express Rush Turnaround</span>
              </div>
              <span className="font-bold text-white">+$45</span>
            </button>

            <button
              onClick={() => toggleAddon('instrumentalStems')}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left text-xs transition-colors ${
                addons.instrumentalStems
                  ? 'bg-[#1db954]/15 border-[#53e076] text-white'
                  : 'bg-[#10131a] border-white/5 text-[#bccbb9]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-[18px] ${addons.instrumentalStems ? 'text-[#53e076]' : 'text-[#869585]'}`}>
                  {addons.instrumentalStems ? 'check_box' : 'check_box_outline_blank'}
                </span>
                <span>Individual Clean Stem Bounces (WAV)</span>
              </div>
              <span className="font-bold text-white">+$25</span>
            </button>

            <button
              onClick={() => toggleAddon('dolbyAtmosFile')}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left text-xs transition-colors ${
                addons.dolbyAtmosFile
                  ? 'bg-[#1db954]/15 border-[#53e076] text-white'
                  : 'bg-[#10131a] border-white/5 text-[#bccbb9]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-[18px] ${addons.dolbyAtmosFile ? 'text-[#53e076]' : 'text-[#869585]'}`}>
                  {addons.dolbyAtmosFile ? 'check_box' : 'check_box_outline_blank'}
                </span>
                <span>Dolby Atmos Spatial Binaural Pass</span>
              </div>
              <span className="font-bold text-white">+$75</span>
            </button>
          </div>
        </div>

        {/* Total & Checkout Bar */}
        <div className="bg-[#191c22] rounded-xl p-4 shadow-xl border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#bccbb9]">Total Escrow Deposit</p>
              <p className="text-xl font-headline font-extrabold text-white">${totalPrice.toFixed(2)} USD</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#53e076] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                100% Escrow Secured
              </span>
              <p className="text-[10px] text-[#869585]">Released only upon your approval</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToOrder}
              className="py-2.5 px-3 rounded-lg bg-[#272a31] text-xs font-semibold text-[#bccbb9] hover:text-white"
            >
              View Active
            </button>
            <button
              onClick={() => onBookService(currentTier.name, totalPrice, currentTier.turnaround)}
              className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#1db954] to-[#53e076] text-[#003914] text-xs font-bold shadow-lg shadow-[#1db954]/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              Book & Deposit into Escrow (${totalPrice.toFixed(2)})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
