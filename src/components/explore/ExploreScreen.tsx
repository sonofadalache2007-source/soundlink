import React, { useState } from 'react';
import { Order } from '../../types/order';

interface ExploreScreenProps {
  onSelectCreator: (name: string, title: string, price: number) => void;
  onNavigateToOrder: () => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ onSelectCreator, onNavigateToOrder }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const categories = ['All', 'Vocal Mix & Master', 'Dolby Atmos', 'Stem Tuning', 'Analog Tape', 'Beat Production'];

  const creators = [
    {
      id: 'c1',
      name: 'Marcus Vance',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOV5JhY6y63DeEpwDJFMGuIMme1UgHVXmkV8StOGD8nu9vjwjBDyzSt5Zv4sEjr8Msf9Ixb6CGeKE7dN1QkDsZJ_Bovvg88O0Qxv3Q9cwG-hbP3Nf6FPVhsxZ_0mVl2KczpSuum8iOxy0XRBT0sWICQemujQ2wAYnufzx72Nj76fb_YULJMCZjpXg6xWNeTfi3lPoGxxYzavLz2oFbC6VO2Z3DKrvi-kkPKTL-QfBd1wzgKVI5jENE',
      badge: 'PRO VERIFIED',
      headline: 'Billboard Hot 100 Vocal Mixer & Mastering Engineer',
      genre: 'Pop / Hip-Hop / R&B',
      rating: 4.98,
      reviewsCount: 142,
      price: 150,
      turnaround: '24-48 hours',
      gear: 'Neve 1073 • Teletronix LA-2A • Tube-Tech CL1B',
      sampleTitle: 'Billboard Vocal Master Preview (Jaxson Drake)',
      sampleBpm: '128 BPM',
      inWorkspace: true,
    },
    {
      id: 'c2',
      name: 'Elena Rostova',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkLkrKN1iK1kKhRNJb3OZ6GvQ-yKPxXcKcoGkuIYlODdRDvyYGv4bBQl47Czj3snTw4M7RIdXtcnDx_R5eVLBb6Tt0XTjq0ySP8JkTupJXb6nsmEeN2mPv_AAlqfVds6wkchO_kwrhJmbJXObcC6RkUpDn5nUMF96sfW-8sP4oyk4V-OHTIaSGL1J0kz9zokyOXVTZoMLwNGqTP2MTIs5cBCozpD3VJRBidihVensucH6sNYf8fHXz',
      badge: 'ATMOS CERTIFIED',
      headline: 'Dolby Atmos 7.1.4 Immersive Spatial Audio Specialist',
      genre: 'Electronic / Cinematic / Indie',
      rating: 5.0,
      reviewsCount: 88,
      price: 300,
      turnaround: '3-4 days',
      gear: 'Genelec 8351B 7.1.4 Array • Avid S6 • MTRX Studio',
      sampleTitle: 'Spatial Binaural Master Demo (Starlight)',
      sampleBpm: '110 BPM',
      inWorkspace: false,
    },
    {
      id: 'c3',
      name: 'Kendrick Chen',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCc-wvs_12LuYN4fxZbx17aWH7VTLfNaEOGi0FG9X-mSsAECkkGuCF9V9BKHdzJC9fo1CXYhL2Og5MJqiiChyiK1Ay6UPqt7ZxCnCoGPI2v6mkihL9JtnLgr4jbT6hSjzI_QLpVp2rJL3ToYA_MpPZbMPhJKukMflILb5DsYB2cv-3OUe9KuMpxedK4A9ykv0z3YZ0-yjXJzuzSgUEQase1tpcdNAkXwNaXdY7LvvhCuoKKIYimkySC',
      badge: 'TOP RATED',
      headline: 'Surgical Vocal Pitching & Timing Specialist',
      genre: 'Commercial Pop / K-Pop / Trap',
      rating: 4.95,
      reviewsCount: 210,
      price: 65,
      turnaround: '12-24 hours',
      gear: 'Celemony Melodyne 5 Studio • Antares Auto-Tune Pro',
      sampleTitle: 'Harmonic Stack Micro-Alignment',
      sampleBpm: '140 BPM',
      inWorkspace: false,
    },
  ];

  const filteredCreators = creators.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.headline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col relative w-full pt-16 pb-28 bg-[#10131a]">
      <div className="max-w-md mx-auto w-full space-y-4 px-3 sm:px-4">
        {/* Search & Header */}
        <div className="pt-2 space-y-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#869585] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audio engineers, Dolby Atmos, gear..."
              className="w-full bg-[#191c22] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#869585] focus:outline-none focus:border-[#53e076]"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  activeCategory === cat
                    ? 'bg-[#1db954]/20 border-[#53e076] text-[#53e076]'
                    : 'bg-[#191c22] border-white/5 text-[#bccbb9] hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Escrow Notice */}
        <div className="bg-gradient-to-r from-[#191c22] to-[#1d2026] p-3 rounded-xl border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#53e076] text-[20px]">shield</span>
            <div>
              <p className="text-xs font-bold text-white">100% Escrow Protection</p>
              <p className="text-[11px] text-[#bccbb9]">Funds held securely until you approve deliverables.</p>
            </div>
          </div>
          <button
            onClick={onNavigateToOrder}
            className="text-xs text-[#53e076] font-bold underline whitespace-nowrap"
          >
            Active Order
          </button>
        </div>

        {/* Creator List */}
        <div className="space-y-3">
          {filteredCreators.map((creator) => {
            const isPlayingThis = playingId === creator.id;
            return (
              <div
                key={creator.id}
                className="bg-[#191c22] rounded-xl p-4 shadow-lg border border-white/5 space-y-3 hover:border-white/10 transition-colors"
              >
                {/* Creator Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      alt={creator.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10"
                      src={creator.avatar}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-headline font-bold text-sm text-white">{creator.name}</h4>
                        <span className="text-[9px] bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] text-white px-1.5 py-0.5 rounded font-extrabold tracking-wide">
                          {creator.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#53e076]">{creator.genre}</p>
                      <div className="flex items-center gap-1 text-[11px] text-[#bccbb9] mt-0.5">
                        <span className="material-symbols-outlined text-[#53e076] text-[14px]">star</span>
                        <span className="text-white font-bold">{creator.rating}</span>
                        <span>({creator.reviewsCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-white">${creator.price} USD</p>
                    <p className="text-[10px] text-[#869585]">per master</p>
                  </div>
                </div>

                <p className="text-xs text-[#bccbb9] leading-relaxed line-clamp-2">
                  {creator.headline}
                </p>

                {/* Hardware Spec */}
                <div className="p-2 bg-[#10131a] rounded-lg text-[11px] text-[#869585] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[14px]">tune</span>
                  <span className="truncate">{creator.gear}</span>
                </div>

                {/* Sample Audio Player Bar */}
                <div className="bg-[#1d2026] p-2.5 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <button
                      onClick={() => setPlayingId(isPlayingThis ? null : creator.id)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                        isPlayingThis ? 'bg-[#53e076] text-[#003914]' : 'bg-[#32353c] text-white hover:bg-[#53e076] hover:text-[#003914]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isPlayingThis ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                    <div className="min-w-0">
                      <p className="text-xs text-white truncate font-medium">{creator.sampleTitle}</p>
                      <p className="text-[10px] text-[#869585]">{creator.sampleBpm} • 24-bit 48kHz</p>
                    </div>
                  </div>
                  {isPlayingThis && (
                    <span className="text-[10px] text-[#53e076] font-mono animate-pulse">Playing</span>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {creator.inWorkspace ? (
                    <button
                      onClick={onNavigateToOrder}
                      className="flex-1 py-2 rounded-lg bg-[#53e076]/20 text-[#53e076] text-xs font-bold border border-[#53e076]/40 flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                      Open In Workspace
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectCreator(creator.name, creator.headline, creator.price)}
                      className="flex-1 py-2 rounded-lg bg-[#1db954] hover:bg-[#53e076] text-[#003914] text-xs font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">bolt</span>
                      Book with Escrow (${creator.price})
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
