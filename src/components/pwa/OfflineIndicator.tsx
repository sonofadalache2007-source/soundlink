import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-16 inset-x-4 max-w-sm mx-auto z-50 flex items-center gap-2 rounded-xl bg-amber-500/90 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-black shadow-xl animate-in fade-in slide-in-from-top-2">
      <span className="h-2 w-2 rounded-full bg-black animate-pulse shrink-0" />
      <span>Offline Mode — Cached studio workspace loaded</span>
    </div>
  );
};
