import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function NotificationBanner() {
  const { notification, notify } = useApp();

  if (!notification) return null;

  const isSuccess = notification.type === 'success';
  const isWarn = notification.type === 'warning';

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-fade-in shadow-xl">
      <div
        className={`flex items-start space-x-3 p-3.5 rounded-xl border text-xs font-medium backdrop-blur-md ${
          isSuccess
            ? 'bg-emerald-50/95 border-emerald-300 text-emerald-900 shadow-emerald-500/10'
            : isWarn
            ? 'bg-amber-50/95 border-amber-300 text-amber-900 shadow-amber-500/10'
            : 'bg-slate-900/95 border-slate-700 text-white shadow-slate-900/20'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        ) : isWarn ? (
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        ) : (
          <Info className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
        )}

        <div className="flex-1 pr-2">
          <span>{notification.message}</span>
        </div>

        <button
          onClick={() => notify(null)}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
