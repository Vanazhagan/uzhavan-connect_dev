import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminOverview: React.FC = () => {
  const {
    t,
    language,
    revenueSectors,
    adminIssues,
    verificationRequests,
    orders,
    crops,
    workers,
    machinery,
    logisticsPartners,
    agriStores,
    setActiveTab,
  } = useApp();

  const [timeFilter, setTimeFilter] = useState<'Today' | 'This Week' | 'This Month' | 'This Year'>('This Month');

  // Sector calculations (paid only vs 0% free)
  const paidSectors = revenueSectors.filter(s => !s.isFreePlatformService);
  const totalPlatformRevenue = paidSectors.reduce((acc, s) => acc + s.platformRevenue, 0);
  const totalTransactionValue = paidSectors.reduce((acc, s) => acc + s.bookingValue, 0);
  const totalPaidTransactions = paidSectors.reduce((acc, s) => acc + s.transactionCount, 0);

  // Platform Users count across ecosystem
  const pendingVerifications = verificationRequests.filter(
    v => v.status === 'VERIFICATION_PENDING' || v.status === 'pending'
  ).length;

  const openDisputesCount = adminIssues.filter(i => i.status !== 'resolved').length;

  const totalRegisteredUsers =
    crops.length + workers.length + machinery.length + logisticsPartners.length + agriStores.length + 15; // seed estimate

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Admin Overview & Control Console
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {t.admin.demoRevenueLabel}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            High-level platform metric overview, transaction volumes, pending approvals, and system health.
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl text-xs">
          {(['Today', 'This Week', 'This Month', 'This Year'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setTimeFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                timeFilter === tab
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TOP SUMMARY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-amber-900/10 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {t.admin.totalPlatformRevenue}
          </span>
          <div className="text-3xl font-extrabold text-emerald-800 tabular-nums">
            ₹{totalPlatformRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">
            Strict 2% service model collected
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-amber-900/10 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {t.admin.totalTransactionValue}
          </span>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
            ₹{totalTransactionValue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Across agriculture & farm machinery
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-amber-900/10 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Paid Transactions
          </span>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
            {totalPaidTransactions.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Fulfilled ecosystem transactions
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-amber-900/10 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Farmer Crop Fee Rate
          </span>
          <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">
            0% FREE
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Protected by platform charter
          </div>
        </div>
      </div>

      {/* SECONDARY OPERATIONAL METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab('users')}
          className="p-5 bg-white hover:bg-slate-50 transition-colors text-left rounded-3xl border border-amber-900/10 shadow-xs flex items-center justify-between cursor-pointer group"
        >
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Ecosystem Users</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalRegisteredUsers}</div>
            <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Farmers, Buyers, Workers, Logistics</div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className="p-5 bg-white hover:bg-slate-50 transition-colors text-left rounded-3xl border border-amber-900/10 shadow-xs flex items-center justify-between cursor-pointer group"
        >
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Verification Count</div>
            <div className="text-2xl font-extrabold text-amber-900 mt-1">{pendingVerifications}</div>
            <div className="text-[11px] text-amber-700 font-medium mt-0.5">Requires Admin KYC review</div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </button>

        <button
          onClick={() => setActiveTab('issues')}
          className="p-5 bg-white hover:bg-slate-50 transition-colors text-left rounded-3xl border border-amber-900/10 shadow-xs flex items-center justify-between cursor-pointer group"
        >
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Disputes & Issues</div>
            <div className="text-2xl font-extrabold text-rose-900 mt-1">{openDisputesCount}</div>
            <div className="text-[11px] text-rose-700 font-medium mt-0.5">Open ground complaints</div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-800 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* RECENT PLATFORM ACTIVITY STREAM */}
      <div className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Platform Activity</h3>
            <span className="text-xs text-slate-500">Live operational events across Tamil Nadu agricultural hubs</span>
          </div>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
            System Live
          </span>
        </div>

        <div className="space-y-3 text-xs">
          {[
            { time: '10 mins ago', type: 'Buyer Crop Order', title: 'Murugan Wholesale Mandi placed ₹15,000 order', detail: 'Crop: Pollachi Coconut · 2% platform fee (₹300) accrued', badge: 'bg-emerald-100 text-emerald-800' },
            { time: '25 mins ago', type: 'Verification Request', title: 'Kaveri Agro Exports submitted GST documents', detail: 'Location: Salem · Status: PENDING ADMIN REVIEW', badge: 'bg-amber-100 text-amber-900' },
            { time: '1 hour ago', type: 'Worker Booking', title: 'Marimuthu Field Team booked by Suresh Kumar', detail: 'Work: Coconut Harvesting · Value: ₹5,000 · Fee: ₹100', badge: 'bg-blue-100 text-blue-800' },
            { time: '2 hours ago', type: 'Machinery Rental', title: 'Sonalika 45HP Tractor dispatched in Pollachi', detail: 'Provider: Ravi Machinery Services · Duration: 4 hrs', badge: 'bg-indigo-100 text-indigo-800' },
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.badge}`}>
                    {item.type}
                  </span>
                  <span className="font-bold text-slate-900">{item.title}</span>
                </div>
                <div className="text-slate-600">{item.detail}</div>
              </div>
              <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
