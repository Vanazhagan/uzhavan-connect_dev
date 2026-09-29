import React, { useState } from 'react';
import {
  User,
  MapPin,
  Phone,
  ShieldCheck,
  Award,
  Layers,
  Calendar,
  CheckCircle2,
  Lock,
  Edit3,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrustRingAvatar } from '../common/TrustRingAvatar';

export const UserProfileView: React.FC = () => {
  const { t, language, currentUser, setCurrentUser, currentRole } = useApp();
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields
  const [name, setName] = useState(currentUser.name);
  const [farmSize, setFarmSize] = useState(currentUser.farmSize || '6.5 Acres');
  const [irrigation, setIrrigation] = useState(currentUser.irrigationType || 'Drip & Borewell');
  const [village, setVillage] = useState(currentUser.village || 'Anamalai');
  const [taluk, setTaluk] = useState(currentUser.taluk || 'Pollachi');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name,
      farmSize,
      irrigationType: irrigation,
      village,
      taluk,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <TrustRingAvatar user={currentUser} size="xl" interactive={true} />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900">{currentUser.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 capitalize">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {currentUser.village}, {currentUser.taluk}, {currentUser.district}, Tamil Nadu
              </p>
              <div className="pt-1 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{currentUser.trust.title}</span>
                <span>·</span>
                <span>{currentUser.trust.completedTransactions} Verified Transactions</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 self-start cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSave} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Farm Size</label>
                <input
                  type="text"
                  value={farmSize}
                  onChange={e => setFarmSize(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Taluk</label>
                <input
                  type="text"
                  value={taluk}
                  onChange={e => setTaluk(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Village</label>
                <input
                  type="text"
                  value={village}
                  onChange={e => setVillage(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Irrigation</label>
                <input
                  type="text"
                  value={irrigation}
                  onChange={e => setIrrigation(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Trust Signals Detail Box */}
        <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200/70 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-950 uppercase tracking-wider">
              Profile Trust Ring Details
            </span>
            <span className="text-amber-800 font-semibold">{t.trust.whyRing}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-white rounded-xl border border-amber-100">
              <span className="text-[10px] text-slate-400 block">{t.trust.completedSales}</span>
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                {currentUser.trust.completedTransactions}
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-amber-100">
              <span className="text-[10px] text-slate-400 block">{t.trust.fulfilmentRate}</span>
              <span className="text-xl font-bold text-emerald-800 tabular-nums">
                {currentUser.trust.fulfilmentRate}%
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-amber-100">
              <span className="text-[10px] text-slate-400 block">{t.trust.positiveFeedback}</span>
              <span className="text-xl font-bold text-amber-700 tabular-nums">
                ★ {currentUser.trust.positiveFeedbackScore.toFixed(1)}
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-amber-100">
              <span className="text-[10px] text-slate-400 block">{t.trust.cancellationRate}</span>
              <span className="text-xl font-bold text-slate-700 tabular-nums">
                {currentUser.trust.cancellationRate}%
              </span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            {currentUser.trust.reasons.map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-medium text-emerald-950">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
