import React, { useState } from 'react';
import {
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Check,
  UserCheck,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrustRingAvatar } from '../common/TrustRingAvatar';
import { ReverseWorkerRequest } from '../../types';

export const WorkerJobRequestsView: React.FC = () => {
  const {
    labourRequirements,
    expressWorkerInterest,
    currentUser,
    currentRole,
    switchRole,
    t,
    language,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');
  const [feedback, setFeedback] = useState<{ id: string; type: 'success' | 'error'; message: string } | null>(null);

  // Filter farmer-posted labour requirements (Available Jobs)
  const filteredJobs = labourRequirements.filter(req => {
    const matchesSearch =
      req.workType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.crop && req.crop.toLowerCase().includes(searchQuery.toLowerCase())) ||
      req.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.farmerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCrop =
      selectedCropFilter === 'All' ||
      (req.crop && req.crop.toLowerCase() === selectedCropFilter.toLowerCase());

    return matchesSearch && matchesCrop;
  });

  const cropsList = ['All', 'Coconut', 'Paddy', 'Tomato', 'Turmeric', 'Banana'];

  const handleApply = (req: ReverseWorkerRequest) => {
    const res = expressWorkerInterest(req.id, {
      id: currentUser.id,
      name: currentUser.name,
      phone: currentUser.mobile,
      area: `${currentUser.village ? currentUser.village + ', ' : ''}${currentUser.district}`,
      isTeam: currentUser.isTeam ?? true,
      teamSize: currentUser.teamSize || 6,
      dailyCharge: (currentUser.dailyRate || 600) * (currentUser.teamSize || 1),
      trust: currentUser.trust,
    });

    if (res.success) {
      setFeedback({ id: req.id, type: 'success', message: res.message });
      setTimeout(() => {
        setFeedback(prev => (prev?.id === req.id ? null : prev));
      }, 4000);
    } else {
      setFeedback({ id: req.id, type: 'error', message: res.message });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Open Labour Requirements
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Available Jobs ({labourRequirements.length})
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Browse genuine farmer-posted field labour jobs across Tamil Nadu. Propose your team or individual specialist services directly.
          </p>
        </div>

        {/* Quick Role Switcher for easy testing */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => switchRole('farmer')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer border border-slate-300"
          >
            <UserCheck className="w-3.5 h-3.5 text-slate-700" />
            <span>Switch to Farmer View</span>
          </button>
        </div>
      </div>

      {/* Info notice: Farmer-posted jobs only */}
      <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs text-emerald-950 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Farmer Field Openings:</strong> Farmers post required headcounts for harvesting, climbing, and farm operations. Apply with your team capacity or specialist skill.
          </span>
        </div>
        <span className="text-[11px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 shrink-0">
          Direct Settlement
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by job title, crop, district or farmer name..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <select
              value={selectedCropFilter}
              onChange={e => setSelectedCropFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {cropsList.map(c => (
                <option key={c} value={c}>
                  Crop Filter: {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Feed */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-2">
            <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No Open Labour Requirements Match Filter</h4>
            <p className="text-xs text-slate-500">Try adjusting your crop filter or search query.</p>
          </div>
        ) : (
          filteredJobs.map(req => {
            const confirmedCount = req.confirmedWorkersCount || 0;
            const remaining = Math.max(0, req.workersRequired - confirmedCount);
            const isFilled = remaining === 0 || req.status === 'assigned';
            const isPartiallyFilled = confirmedCount > 0 && remaining > 0;
            const percentFilled = Math.min(100, Math.round((confirmedCount / req.workersRequired) * 100));

            // Check if active worker or their team has applied
            const hasApplied = req.responses.some(
              r =>
                r.workerId === currentUser.id ||
                r.workerName.toLowerCase().includes(currentUser.name.toLowerCase()) ||
                r.workerName.toLowerCase().includes('marimuthu')
            );

            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-5 sm:p-6 space-y-4 hover:border-emerald-300 transition-colors"
              >
                {/* Header: Farmer and Job Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <TrustRingAvatar
                      user={{ name: req.farmerName }}
                      trust={{
                        level: 'star',
                        title: 'Verified Farmer Producer',
                        completedTransactions: 48,
                        fulfilmentRate: 99,
                        isVerified: true,
                        positiveFeedbackScore: 4.95,
                        cancellationRate: 0.5,
                        reasons: ['Verified Farm Landholder', 'Prompt Direct Wage Settlement'],
                      }}
                      size="md"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          Farmer Employer
                        </span>
                        <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-700" />
                          {req.location}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">
                        {req.workType} ({req.crop || 'Field Crop'})
                      </h4>
                      <span className="text-xs text-slate-600">Farmer: {req.farmerName}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col sm:items-end justify-between items-center gap-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Offered Wage</span>
                    <span className="text-base sm:text-lg font-extrabold text-emerald-800 tabular-nums">
                      ₹{req.expectedDailyWage}
                      <span className="text-xs font-normal text-slate-500"> /person/day</span>
                    </span>
                  </div>
                </div>

                {/* Job Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-50 rounded-2xl text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Date of Work</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                      {req.date}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Shift Time</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" />
                      {req.timeSlot}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Workers Needed</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Users className="w-3.5 h-3.5 text-emerald-700" />
                      {req.workersRequired} Workers
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Crop Sector</span>
                    <span className="font-bold text-emerald-900 mt-0.5 block">
                      {req.crop || 'Field Work'}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {req.notes && (
                  <p className="text-xs text-slate-600 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                    <strong>Farmer Instructions:</strong> &ldquo;{req.notes}&rdquo;
                  </p>
                )}

                {/* Staffing Status & Counter Bar */}
                <div className="p-3 bg-white rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-600 uppercase">Staffing:</span>
                      <span className="font-semibold text-slate-800">
                        <strong className="text-slate-900">{req.workersRequired}</strong> Required ·{' '}
                        <strong className="text-emerald-800">{confirmedCount}</strong> Confirmed ·{' '}
                        <strong className={remaining > 0 ? 'text-amber-800' : 'text-slate-500'}>
                          {remaining}
                        </strong>{' '}
                        Remaining
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        isFilled
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : isPartiallyFilled
                          ? 'bg-blue-100 text-blue-900 border border-blue-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {isFilled
                        ? 'FILLED / ASSIGNED'
                        : isPartiallyFilled
                        ? 'PARTIALLY FILLED'
                        : 'OPEN FOR WORKERS'}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isFilled ? 'bg-emerald-600' : isPartiallyFilled ? 'bg-blue-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${percentFilled}%` }}
                    />
                  </div>
                </div>

                {/* Feedback */}
                {feedback && feedback.id === req.id && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between ${
                      feedback.type === 'success'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        : 'bg-rose-100 text-rose-900 border border-rose-200'
                    }`}
                  >
                    <span>{feedback.message}</span>
                    <button
                      onClick={() => setFeedback(null)}
                      className="text-xs font-bold underline cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Worker Application Action */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-500">
                    {req.responses.length} worker team{req.responses.length === 1 ? '' : 's'} expressed interest
                  </div>

                  {isFilled ? (
                    <span className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold border border-slate-200">
                      Requirement Fully Staffed ({req.workersRequired}/{req.workersRequired})
                    </span>
                  ) : hasApplied ? (
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>✓ Interest Submitted — Awaiting Farmer Selection</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApply(req)}
                      className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Briefcase className="w-4 h-4 text-emerald-200" />
                      <span>I&apos;m Interested — Apply with My Team</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
