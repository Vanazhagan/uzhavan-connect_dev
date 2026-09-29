import React from 'react';
import { Award, Sparkles, CheckCircle2, ShieldCheck, Trophy, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminRewardsView: React.FC = () => {
  const { awards, t } = useApp();

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Uzhavan Trust Ring & Monthly Awards Management
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Admin oversight of organic Trust Rings (New → Active → Trusted → Community Star) and monthly agricultural recognitions.
          </p>
        </div>

        <div className="text-xs font-bold text-amber-900 bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200 shadow-2xs">
          Trust Rings Cannot Be Purchased
        </div>
      </div>

      {/* TRUST RING TIER CRITERIA CARD */}
      <div className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-800" />
          Trust Ring Progression Tiers
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-400" />
              New Member (Grey Ring)
            </div>
            <div className="text-slate-600">Base level assigned upon signup and mobile verification.</div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
            <div className="font-bold text-amber-900 flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              Active Member (Gold Ring)
            </div>
            <div className="text-amber-800">Earned after 5+ successful transactions & 90%+ fulfillment rate.</div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600" />
              Trusted Member (Green Ring)
            </div>
            <div className="text-emerald-800">Earned after 15+ verified transactions & verified identity docs.</div>
          </div>

          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-1">
            <div className="font-bold text-purple-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Community Star
            </div>
            <div className="text-purple-800">Monthly recognition awarded for exceptional ground integrity.</div>
          </div>
        </div>
      </div>

      {/* RECOGNIZED COMMUNITY AWARDS */}
      <div className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            Monthly Ecosystem Awards & Recognition
          </h3>
          <span className="text-xs text-slate-500">Earned through verified activity</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {awards.map(award => (
            <div key={award.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-200">
                  {award.badge}
                </span>
                <span className="text-slate-400 font-mono">{award.district}</span>
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-sm">{award.recipientName}</div>
                <div className="font-bold text-emerald-800 mt-0.5">{award.title}</div>
              </div>
              <p className="text-slate-600 text-[11px] leading-tight">{award.criteria}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
