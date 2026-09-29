import React from 'react';
import { X, ShieldCheck, CheckCircle2, Award, Info, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrustRingAvatar } from './TrustRingAvatar';

export const WhyTrustRingModal: React.FC = () => {
  const { whyTrustRingModalUser, setWhyTrustRingModalUser, t } = useApp();

  if (!whyTrustRingModalUser) return null;

  const trust = whyTrustRingModalUser.trust;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] border border-amber-900/10 rounded-2xl shadow-2xl overflow-hidden text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-amber-900/10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-semibold text-slate-900">
              {t.trust.whyRing}
            </h3>
          </div>
          <button
            onClick={() => setWhyTrustRingModalUser(null)}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label={t.common.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* User profile snapshot */}
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <TrustRingAvatar user={whyTrustRingModalUser} size="lg" interactive={false} />
            <div>
              <h4 className="text-base font-bold text-slate-900">{whyTrustRingModalUser.name}</h4>
              <p className="text-xs text-slate-600">
                {whyTrustRingModalUser.district} {whyTrustRingModalUser.taluk ? `· ${whyTrustRingModalUser.taluk}` : ''}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs font-medium text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>{trust.title}</span>
              </div>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-white rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-500 block mb-0.5">{t.trust.completedSales}</span>
              <span className="text-2xl font-bold text-emerald-800 tabular-nums">
                {trust.completedTransactions}
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-500 block mb-0.5">{t.trust.fulfilmentRate}</span>
              <span className="text-2xl font-bold text-emerald-800 tabular-nums">
                {trust.fulfilmentRate}%
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-500 block mb-0.5">{t.trust.positiveFeedback}</span>
              <span className="text-2xl font-bold text-amber-700 tabular-nums">
                ★ {trust.positiveFeedbackScore.toFixed(1)} / 5.0
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-500 block mb-0.5">{t.trust.cancellationRate}</span>
              <span className="text-2xl font-bold text-slate-700 tabular-nums">
                {trust.cancellationRate}%
              </span>
            </div>
          </div>

          {/* Verified Reasons & Badges */}
          <div className="space-y-2">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Verified Ground Signals
            </h5>
            <div className="space-y-2">
              {trust.reasons.map((reason, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-lg text-xs font-medium text-emerald-950"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Policy Banner: Cannot be purchased */}
          <div className="flex items-start gap-3 p-3.5 bg-amber-50/80 border border-amber-200/70 rounded-xl text-xs text-amber-900">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Uzhavan Trust Guarantee:</strong> {t.trust.policyNotice}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setWhyTrustRingModalUser(null)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
