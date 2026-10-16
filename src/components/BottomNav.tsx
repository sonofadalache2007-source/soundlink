import React from 'react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  messageBadge?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, messageBadge = 1 }) => {
  const tabs = [
    { id: 'explore', label: 'Explore', icon: 'explore' },
    { id: 'services', label: 'Services', icon: 'graphic_eq' },
    { id: 'orders', label: 'Orders', icon: 'receipt_long' },
    { id: 'messages', label: 'Messages', icon: 'chat_bubble', badge: messageBadge },
    { id: 'profile', label: 'Profile', icon: 'account_circle' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-[#0b0e14]/90 backdrop-blur-2xl border-t border-white/5 shadow-[0_-4px_24px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-all gap-0.5 relative ${
                isActive
                  ? 'text-[#53e076] font-bold scale-105'
                  : 'text-[#bccbb9] hover:text-white'
              }`}
            >
              <div className="relative">
                <span className={`material-symbols-outlined text-[24px] transition-transform ${isActive ? 'scale-110' : ''}`}>
                  {tab.icon}
                </span>
                {tab.badge && tab.badge > 0 && !isActive && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#53e076] text-[#003914] text-[9px] font-extrabold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="font-label-sm text-[11px] tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#53e076] mt-0.5 shadow-[0_0_8px_#53e076]"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
