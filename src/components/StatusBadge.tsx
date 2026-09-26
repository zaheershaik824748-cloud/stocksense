import React from 'react';
import { OperationStatus, DeliveryStep } from '../types';

interface StatusBadgeProps {
  status: OperationStatus | DeliveryStep;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  switch (status) {
    case 'done':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 font-medium ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Done
        </span>
      );
    case 'ready':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 font-medium ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          Ready
        </span>
      );
    case 'waiting':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 font-medium ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          Waiting
        </span>
      );
    case 'picking':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-purple-50 text-purple-700 ring-1 ring-purple-600/20 font-medium ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
          Picking
        </span>
      );
    case 'packing':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20 font-medium ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          Packing
        </span>
      );
    case 'canceled':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-700 ring-1 ring-rose-600/20 font-medium ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          Canceled
        </span>
      );
    case 'draft':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-500/20 font-medium ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          Draft
        </span>
      );
  }
};
