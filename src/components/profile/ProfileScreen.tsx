import React, { useState } from 'react';
import { Order } from '../../types/order';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface ProfileScreenProps {
  order: Order;
  onNavigateToOrder: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ order, onNavigateToOrder }) => {
  const [activePersona, setActivePersona] = useState<'client' | 'producer'>('client');
  const [autoReleaseHours, setAutoReleaseHours] = useState('72');

  return (
    <div className="flex-1 flex flex-col relative w-full pt-16 pb-28 bg-[#10131a]">
      <div className="max-w-md mx-auto w-full space-y-4 px-3 sm:px-4">
        
        {/* Profile Switcher Pill */}
        <div className="pt-2 flex justify-center">
          <div className="bg-[#191c22] p-1 rounded-full flex items-center border border-white/5">
            <button
              onClick={() => setActivePersona('client')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activePersona === 'client'
                  ? 'bg-[#1db954] text-[#003914]'
                  : 'text-[#bccbb9] hover:text-white'
              }`}
            >
              Client (Jaxson Drake)
            </button>
            <button
              onClick={() => setActivePersona('producer')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activePersona === 'producer'
                  ? 'bg-[#571bc1] text-white'
                  : 'text-[#bccbb9] hover:text-white'
              }`}
            >
              Producer (Marcus Vance)
            </button>
          </div>
        </div>

        {/* Persona Header Card */}
        {activePersona === 'client' ? (
          <div className="bg-[#191c22] rounded-xl p-4 shadow-xl border border-white/5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  alt={order.client.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-[#53e076]/40"
                  src={order.client.avatar}
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#53e076] rounded-full ring-2 ring-[#191c22]"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline font-bold text-base text-white">{order.client.name}</h3>
                  <span className="text-[10px] bg-[#1db954]/20 text-[#53e076] px-2 py-0.5 rounded-full font-bold">
                    VERIFIED CLIENT
                  </span>
                </div>
                <p className="text-xs text-[#bccbb9]">Independent Recording Artist & Songwriter</p>
                <p className="text-[11px] text-[#869585] mt-0.5">Los Angeles, CA • Member since 2024</p>
              </div>
            </div>

            {/* Escrow Balance Snapshot */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-[#10131a] p-3 rounded-lg border border-white/5">
                <p className="text-[10px] uppercase font-bold text-[#869585]">Active In Escrow</p>
                <p className="text-base font-bold text-[#53e076] mt-0.5">${order.escrow.amount.toFixed(2)} USD</p>
                <p className="text-[10px] text-[#bccbb9]">Order #{order.orderNumber}</p>
              </div>
              <div className="bg-[#10131a] p-3 rounded-lg border border-white/5">
                <p className="text-[10px] uppercase font-bold text-[#869585]">Total Spent</p>
                <p className="text-base font-bold text-white mt-0.5">$1,850.00 USD</p>
                <p className="text-[10px] text-[#bccbb9]">12 Completed Masters</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#191c22] rounded-xl p-4 shadow-xl border border-white/5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  alt={order.producer.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-[#d0bcff]/40"
                  src={order.producer.avatar}
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#53e076] rounded-full ring-2 ring-[#191c22]"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline font-bold text-base text-white">{order.producer.name}</h3>
                  <span className="text-[10px] bg-[#d0bcff] text-[#3c0091] px-1.5 py-0.5 rounded font-extrabold">
                    PRO MASTERING
                  </span>
                </div>
                <p className="text-xs text-[#53e076]">Billboard Charting Audio Engineer</p>
                <p className="text-[11px] text-[#869585] mt-0.5">Nashville & Atlanta • 4.98 Rating (142 reviews)</p>
              </div>
            </div>

            {/* Hardware & DAW Specs */}
            <div className="bg-[#10131a] p-3 rounded-lg border border-white/5 space-y-2">
              <p className="text-[10px] font-bold text-[#869585] uppercase tracking-wider">Studio Setup & Outboard Gear</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Neve 1073 Preamp',
                  'Teletronix LA-2A Optical',
                  'Tube-Tech CL 1B',
                  'Weiss DS1-MK3 De-Esser',
                  'Universal Audio Apollo x8p',
                  'Genelec 8351B SAM Monitors',
                  'Pro Tools Ultimate',
                  'Celemony Melodyne 5 Studio',
                ].map((gear, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-[#191c22] border border-white/5 text-[#bccbb9] px-2 py-0.5 rounded"
                  >
                    {gear}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Current Active Order Quick Card */}
        <div className="bg-[#191c22] rounded-xl p-4 shadow-lg border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#53e076] uppercase tracking-wider">Active Workspace</span>
            <span className="text-xs text-[#869585] font-mono">#{order.orderNumber}</span>
          </div>
          <p className="text-sm font-bold text-white">{order.title}</p>
          <div className="flex items-center justify-between text-xs text-[#bccbb9]">
            <span>Escrow: ${order.escrow.amount.toFixed(2)} USD</span>
            <span>Est: {order.delivery.estimate}</span>
          </div>
          <button
            onClick={onNavigateToOrder}
            className="w-full mt-2 py-2 rounded-lg bg-[#53e076]/15 hover:bg-[#53e076]/25 text-[#53e076] text-xs font-bold transition-colors flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">equalizer</span>
            Return to Active Workspace
          </button>
        </div>

        {/* Order History */}
        <div className="bg-[#191c22] rounded-xl p-4 shadow-lg border border-white/5 space-y-3">
          <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-[#869585]">
            Past Completed Orders
          </h4>
          <div className="space-y-2">
            {[
              {
                id: 'SL-86012',
                title: 'Summer Nights - Single Vocal Polish',
                producer: 'Marcus Vance',
                amount: '$120.00',
                date: 'Sep 28, 2026',
              },
              {
                id: 'SL-84990',
                title: 'Late Drive - EP Master (4 Tracks)',
                producer: 'Elena Rostova',
                amount: '$480.00',
                date: 'Aug 14, 2026',
              },
            ].map((item) => (
              <div
                key={item.id}
                className="bg-[#10131a] p-3 rounded-lg border border-white/5 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                  <p className="text-[10px] text-[#869585]">#{item.id} • {item.producer} • {item.date}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#53e076]">{item.amount}</span>
                  <p className="text-[9px] text-[#869585]">Released</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* App Installation / PWA Card */}
        <PWAInstallButton variant="card" />

        {/* Studio Preferences */}
        <div className="bg-[#191c22] rounded-xl p-4 shadow-lg border border-white/5 space-y-3">
          <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-[#869585]">
            Studio Delivery Settings
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center text-[#bccbb9]">
              <span>Default Audio Format:</span>
              <span className="font-semibold text-white">24-bit 48kHz WAV</span>
            </div>
            <div className="flex justify-between items-center text-[#bccbb9]">
              <span>Escrow Auto-Release Window:</span>
              <span className="font-semibold text-white">{autoReleaseHours} Hours</span>
            </div>
            <div className="flex justify-between items-center text-[#bccbb9]">
              <span>Audio Watermarking:</span>
              <span className="font-semibold text-[#53e076]">Enabled for pre-release</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
