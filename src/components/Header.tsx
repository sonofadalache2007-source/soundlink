import React, { useState } from 'react';
import soundLinkLogo from '../assets/images/regenerated_image_1792165453701.png';
import { PWAInstallButton } from './pwa/PWAInstallButton';

interface HeaderProps {
  currentTab: string;
  onNavigateTab: (tab: string) => void;
  orderNumber?: string;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigateTab, orderNumber = 'SL-88492' }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const notifications = [
    {
      id: 'n1',
      title: 'New Master Deliverable Uploaded',
      body: 'Marcus Vance uploaded Draft_Mix_v2_Mastered.wav (24-bit 44.1kHz).',
      time: '25m ago',
      unread: true,
    },
    {
      id: 'n2',
      title: 'Escrow Secured',
      body: '$150.00 USD safely deposited in SoundLink Escrow.',
      time: '3h ago',
      unread: true,
    },
    {
      id: 'n3',
      title: 'Milestone Brief In Completed',
      body: 'Producer verified vocal stems and tempo map.',
      time: 'Yesterday',
      unread: false,
    },
  ];

  const getScreenTitle = () => {
    switch (currentTab) {
      case 'orders':
        return 'Orders';
      case 'explore':
        return 'Explore';
      case 'services':
        return 'Services';
      case 'messages':
        return 'Messages';
      case 'profile':
        return 'Profile';
      default:
        return 'Orders';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#0b0e14]/90 backdrop-blur-xl border-b border-white/5 pt-safe">
      <div className="h-16 max-w-4xl mx-auto px-4 flex items-center justify-between">
        {/* Brand & Breadcrumb */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigateTab('orders')}>
          <img
            alt="SoundLink Logo"
            className="h-8 w-auto object-contain"
            src={soundLinkLogo}
          />
          <span className="font-headline font-bold text-lg text-white tracking-tight">SoundLink</span>
          <span className="text-[#3d4a3d] font-semibold">/</span>
          <span className="font-headline font-semibold text-lg text-[#bccbb9] truncate max-w-[120px]">
            {getScreenTitle()}
          </span>
          {currentTab === 'orders' && (
            <span className="hidden sm:inline-block text-xs font-mono text-[#869585] ml-1">
              #{orderNumber}
            </span>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 relative">
          {/* PWA In-App Install Trigger */}
          <PWAInstallButton variant="header" />

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setUnreadCount(0);
              }}
              className="w-11 h-11 flex items-center justify-center rounded-full text-[#bccbb9] hover:text-white active:scale-95 transition-all relative hover:bg-white/5"
              aria-label="View notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#53e076] ring-2 ring-[#0b0e14]"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-[#191c22] rounded-xl border border-white/10 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Studio Activity</span>
                  <span className="text-[11px] text-[#53e076]">Mark all read</span>
                </div>
                <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                        item.unread ? 'bg-[#10131a] border border-[#53e076]/20' : 'bg-[#191c22] hover:bg-[#272a31]'
                      }`}
                      onClick={() => setShowNotifications(false)}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <p className="text-xs font-semibold text-white">{item.title}</p>
                        <span className="text-[10px] text-[#869585] whitespace-nowrap">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-[#bccbb9] mt-0.5 leading-snug">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar Link/Button to Profile Screen */}
          <button
            onClick={() => onNavigateTab('profile')}
            className="w-11 h-11 flex items-center justify-center rounded-full active:scale-95 transition-transform hover:bg-white/5 cursor-pointer"
            aria-label="Navigate to Profile"
            data-path="profile"
          >
            <img
              alt="Profile"
              className={`w-8 h-8 rounded-full object-cover transition-all ${
                currentTab === 'profile'
                  ? 'ring-2 ring-[#53e076]'
                  : 'ring-2 ring-[#53e076]/30 hover:ring-[#53e076]'
              }`}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCc-wvs_12LuYN4fxZbx17aWH7VTLfNaEOGi0FG9X-mSsAECkkGuCF9V9BKHdzJC9fo1CXYhL2Og5MJqiiChyiK1Ay6UPqt7ZxCnCoGPI2v6mkihL9JtnLgr4jbT6hSjzI_QLpVp2rJL3ToYA_MpPZbMPhJKukMflILb5DsYB2cv-3OUe9KuMpxedK4A9ykv0z3YZ0-yjXJzuzSgUEQase1tpcdNAkXwNaXdY7LvvhCuoKKIYimkySC"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
