import React from 'react';
import { Award, Star, ShieldCheck, Trophy, Sparkles, CheckCircle, Heart, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const UzhavanRewardsView: React.FC = () => {
  const { t, language, awards } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t.nav.rewards}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Transparent, activity-driven community honors celebrating dependability, punctuality, and trust on Tamil Nadu soil.
          </p>
        </div>

        {/* Cannot be purchased badge */}
        <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Uzhavan Honors cannot be purchased or sponsored. Awarded solely by verified ground performance.</span>
        </div>
      </div>

      {/* Featured Award Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {awards.map(award => (
          <div
            key={award.id}
            className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-6 space-y-4 relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block">
                  {award.badge}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {language === 'ta' ? award.titleTa : award.title}
                </h3>
                <span className="text-xs font-semibold text-emerald-800 block">
                  {award.recipientName} ({award.district})
                </span>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center text-slate-950 shadow-md">
                <Trophy className="w-6 h-6" />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs text-slate-700">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block">
                Verification Criteria
              </span>
              <p className="leading-relaxed">
                {language === 'ta' ? award.criteriaTa : award.criteria}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium pt-1">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Includes permanent Profile Trust Star enhancement</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
