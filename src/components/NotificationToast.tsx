import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { CheckCircle2, AlertTriangle, Info, AlertCircle, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications, dismissNotification } = useInventory();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {notifications.slice(0, 4).map((notif) => {
        let borderClass = 'border-slate-200';
        let bgClass = 'bg-white';
        let IconComponent = Info;
        let iconColor = 'text-blue-500';

        if (notif.type === 'success') {
          borderClass = 'border-emerald-200';
          IconComponent = CheckCircle2;
          iconColor = 'text-emerald-500';
        } else if (notif.type === 'warning') {
          borderClass = 'border-amber-200';
          IconComponent = AlertTriangle;
          iconColor = 'text-amber-500';
        } else if (notif.type === 'error') {
          borderClass = 'border-rose-200';
          IconComponent = AlertCircle;
          iconColor = 'text-rose-500';
        }

        return (
          <div
            key={notif.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border ${borderClass} ${bgClass} transition-all duration-300 transform translate-y-0 flex items-start gap-3 backdrop-blur-md bg-opacity-95`}
          >
            <div className={`mt-0.5 shrink-0 ${iconColor}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-slate-900">{notif.title}</h4>
                <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed break-words">{notif.message}</p>
            </div>
            <button
              onClick={() => dismissNotification(notif.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
