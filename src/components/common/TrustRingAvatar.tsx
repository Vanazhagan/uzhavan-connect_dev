import React from 'react';
import { Star, ShieldCheck, Sparkles } from 'lucide-react';
import { TrustMetrics, UserProfile } from '../../types';
import { useApp } from '../../context/AppContext';

interface TrustRingAvatarProps {
  user?: Partial<UserProfile>;
  trust?: TrustMetrics;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  interactive?: boolean;
  className?: string;
}

export const TrustRingAvatar: React.FC<TrustRingAvatarProps> = ({
  user,
  trust,
  size = 'md',
  showLabel = false,
  interactive = true,
  className = '',
}) => {
  const { setWhyTrustRingModalUser, t } = useApp();
  const effectiveTrust = trust || user?.trust || {
    level: 'grey' as const,
    title: 'New Member',
    completedTransactions: 0,
    fulfilmentRate: 100,
    isVerified: false,
    positiveFeedbackScore: 5.0,
    cancellationRate: 0,
    reasons: ['New to Uzhavan Connect'],
  };

  const name = user?.name || effectiveTrust.title || 'User';
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('');

  // Sizing definitions
  const sizeMap = {
    sm: {
      outer: 'w-9 h-9 p-0.5',
      inner: 'w-7.5 h-7.5 text-xs',
      starBadge: 'w-3 h-3 -bottom-0.5 -right-0.5 text-[8px]',
      strokeWidth: 'border-2',
    },
    md: {
      outer: 'w-12 h-12 p-0.5',
      inner: 'w-10.5 h-10.5 text-sm',
      starBadge: 'w-4 h-4 -bottom-1 -right-1 text-[10px]',
      strokeWidth: 'border-[2.5px]',
    },
    lg: {
      outer: 'w-16 h-16 p-1',
      inner: 'w-13.5 h-13.5 text-base',
      starBadge: 'w-5 h-5 -bottom-1 -right-1 text-xs',
      strokeWidth: 'border-[3px]',
    },
    xl: {
      outer: 'w-24 h-24 p-1.5',
      inner: 'w-20 h-20 text-2xl',
      starBadge: 'w-7 h-7 -bottom-1.5 -right-1.5 text-sm',
      strokeWidth: 'border-4',
    },
  };

  const currentSize = sizeMap[size];

  // Ring styling by level
  // GREY: New Member
  // GOLD: Active Member
  // GREEN: Trusted Member
  // STAR: Community Star (Gold ring + animated glow + small star/crown)
  let ringClasses = 'border-slate-300 bg-slate-50';
  let badgeIcon = null;
  let ringLabel = t.trust.newMember;
  let ringLabelColor = 'text-slate-600';

  if (effectiveTrust.level === 'grey') {
    ringClasses = 'border-slate-300';
    ringLabel = t.trust.newMember;
    ringLabelColor = 'text-slate-600';
  } else if (effectiveTrust.level === 'gold') {
    ringClasses = 'border-amber-400 shadow-sm shadow-amber-500/20';
    ringLabel = t.trust.activeMember;
    ringLabelColor = 'text-amber-700';
  } else if (effectiveTrust.level === 'green') {
    ringClasses = 'border-emerald-500 shadow-sm shadow-emerald-600/25';
    ringLabel = t.trust.trustedMember;
    ringLabelColor = 'text-emerald-700 font-medium';
    badgeIcon = (
      <div className={`absolute ${currentSize.starBadge} rounded-full bg-emerald-600 text-white flex items-center justify-center shadow`}>
        <ShieldCheck className="w-2.5 h-2.5" />
      </div>
    );
  } else if (effectiveTrust.level === 'star') {
    ringClasses = 'border-amber-400 trust-ring-star shadow-md shadow-amber-400/30';
    ringLabel = t.trust.communityStar;
    ringLabelColor = 'text-amber-800 font-semibold';
    badgeIcon = (
      <div className={`absolute ${currentSize.starBadge} rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center shadow-md border border-white font-bold`}>
        <Star className="w-2.5 h-2.5 fill-current" />
      </div>
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!interactive) return;
    e.stopPropagation();
    setWhyTrustRingModalUser({
      id: user?.id || 'temp_user',
      name,
      role: user?.role || 'farmer',
      mobile: user?.mobile || '',
      district: user?.district || 'Tamil Nadu',
      preferredLanguage: 'ta',
      trust: effectiveTrust,
      verificationStatus: effectiveTrust.isVerified ? 'verified' : 'pending',
    });
  };

  return (
    <div
      onClick={handleClick}
      className={`inline-flex items-center gap-2 ${interactive ? 'cursor-pointer group' : ''} ${className}`}
      title={interactive ? `${t.trust.whyRing} (${ringLabel})` : ringLabel}
    >
      <div className="relative shrink-0">
        <div
          className={`rounded-full flex items-center justify-center ${currentSize.outer} ${currentSize.strokeWidth} ${ringClasses} transition-transform duration-200 group-hover:scale-105`}
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={name}
              referrerPolicy="no-referrer"
              className={`rounded-full object-cover ${currentSize.inner}`}
            />
          ) : (
            <div
              className={`rounded-full bg-emerald-800 text-amber-100 font-semibold flex items-center justify-center ${currentSize.inner} shadow-inner`}
            >
              {initials || 'U'}
            </div>
          )}
        </div>
        {badgeIcon}
      </div>

      {showLabel && (
        <div className="text-left leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`text-xs ${ringLabelColor}`}>{ringLabel}</span>
            {interactive && (
              <span className="text-[11px] text-emerald-700 underline underline-offset-2 opacity-80 group-hover:opacity-100">
                {t.trust.whyRing}
              </span>
            )}
          </div>
          {effectiveTrust.completedTransactions > 0 && (
            <div className="text-[11px] text-slate-500">
              {effectiveTrust.completedTransactions} {t.crops.completedLots}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
