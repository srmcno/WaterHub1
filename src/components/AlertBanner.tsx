'use client';

import { useState } from 'react';
import { Alert } from '@/types';

interface AlertBannerProps {
  alerts: Alert[];
}

const severityConfig: Record<string, { bg: string; border: string; icon: string; text: string }> = {
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-400',
    icon: '🚨',
    text: 'text-red-800',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-400',
    icon: '⚠️',
    text: 'text-yellow-800',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-400',
    icon: 'ℹ️',
    text: 'text-blue-800',
  },
};

export default function AlertBanner({ alerts }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = alerts.filter((a) => !dismissed.has(a.id));

  if (visible.length === 0) return null;

  return (
    <div className="space-y-2">
      {visible.map((alert) => {
        const cfg = severityConfig[alert.severity] ?? severityConfig.info;
        return (
          <div
            key={alert.id}
            className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${cfg.bg} ${cfg.border}`}
          >
            <span className="text-lg flex-shrink-0 mt-0.5">{cfg.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${cfg.text}`}>{alert.message}</p>
              <div className="flex items-center gap-3 mt-1">
                {alert.site && (
                  <span className="text-xs text-gray-500">Site: {alert.site}</span>
                )}
                <span className="text-xs text-gray-400">
                  {new Date(alert.timestamp).toLocaleString()}
                </span>
                <span
                  className={`text-xs font-medium uppercase tracking-wide px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.text} border ${cfg.border}`}
                >
                  {alert.severity}
                </span>
              </div>
            </div>
            <button
              onClick={() => setDismissed((prev) => { const next = new Set(prev); next.add(alert.id); return next; })}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
              aria-label="Dismiss alert"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
