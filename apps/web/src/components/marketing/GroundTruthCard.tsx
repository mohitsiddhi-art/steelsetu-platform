'use client';

import { LucideIcon, ShieldCheck, AlertTriangle, ShieldAlert, BadgeCheck } from 'lucide-react';
import TiltCard from './TiltCard';

interface GroundTruthCardProps {
  title: string;
  description: string;
  type: 'truth' | 'warning' | 'critical' | 'verified';
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

const TYPE_CONFIG = {
  truth: {
    bg: 'bg-ss-white',
    border: 'border-ss-accent/20',
    icon: ShieldCheck,
    iconColor: 'text-ss-accent',
    textColor: 'text-ss-black',
    tag: 'GROUND TRUTH'
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
    textColor: 'text-ss-black',
    tag: 'TRADE WARNING'
  },
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: ShieldAlert,
    iconColor: 'text-red-600',
    textColor: 'text-ss-black',
    tag: 'RISK ALERT'
  },
  verified: {
    bg: 'bg-ss-accent/5',
    border: 'border-ss-accent/30',
    icon: BadgeCheck,
    iconColor: 'text-ss-accent',
    textColor: 'text-ss-black',
    tag: 'VERIFIED'
  }
};

/**
 * GroundTruthCard provides "Honest Trade" guidance for the B2B marketplace.
 * It's used to show warnings, verified facts, and "Ground Truth" markers
 * to protect buyers from common industry pitfalls.
 */
export default function GroundTruthCard({
  title,
  description,
  type,
  icon: IconOverride,
  actionText,
  onAction,
  className = ''
}: GroundTruthCardProps) {
  const config = TYPE_CONFIG[type];
  const Icon = IconOverride || config.icon;

  return (
    <TiltCard className={`group relative overflow-hidden rounded-xl border p-6 shadow-sm transition-all hover:shadow-md ${config.bg} ${config.border} ${className}`}>
      {/* Decorative background element */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-current opacity-[0.03] transition-transform group-hover:scale-110" />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className={`rounded-lg p-2 ${config.bg} border ${config.border}`}>
            <Icon className={`h-6 w-6 ${config.iconColor}`} />
          </div>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${config.iconColor} opacity-70`}>
            {config.tag}
          </span>
        </div>

        <div>
          <h3 className={`text-lg font-bold leading-tight ${config.textColor}`}>
            {title}
          </h3>
          <p className={`mt-2 text-sm leading-relaxed opacity-70 ${config.textColor}`}>
            {description}
          </p>
        </div>

        {actionText && (
          <button
            onClick={onAction}
            className={`mt-2 w-full rounded-lg py-2.5 text-sm font-semibold transition-colors
              ${type === 'truth' || type === 'verified'
                ? 'bg-ss-accent text-ss-white hover:bg-ss-accent/90'
                : 'bg-ss-black text-ss-white hover:bg-ss-black/90'}`}
          >
            {actionText}
          </button>
        )}
      </div>
    </TiltCard>
  );
}
