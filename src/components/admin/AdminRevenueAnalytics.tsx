import React, { useState } from 'react';
import { DollarSign, TrendingUp, Info, BarChart3, ArrowDownLeft, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminRevenueAnalytics: React.FC = () => {
  const { t, language, revenueSectors } = useApp();
  const [timeFilter, setTimeFilter] = useState<'Today' | 'This Week' | 'This Month' | 'This Year'>('This Month');

  // Filter out free services for paid aggregations
  const paidSectors = revenueSectors.filter(s => !s.isFreePlatformService);
  const totalPlatformRevenue = paidSectors.reduce((acc, s) => acc + s.platformRevenue, 0);
  const totalTransactionValue = paidSectors.reduce((acc, s) => acc + s.bookingValue, 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Platform Revenue & Service Fee Analytics
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {t.admin.demoRevenueLabel}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Dedicated auditing of platform 2% service fees collected from buyers and service providers. 0% farmer selling fee guaranteed.
          </p>
        </div>

        {/* Date Filter Tabs */}
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

      {/* REVENUE STAT HIGHLIGHTS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 bg-gradient-to-br from-emerald-900 to-emerald-800 text-white rounded-3xl shadow-md space-y-2">
          <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider block">
            Total Platform Revenue
          </span>
          <div className="text-4xl font-extrabold text-amber-200 tabular-nums">
            ₹{totalPlatformRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-emerald-100 font-medium">
            Strict 2% fee collected from paid sectors
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-amber-900/10 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Total Transaction Value (GMV)
          </span>
          <div className="text-4xl font-extrabold text-slate-900 tabular-nums">
            ₹{totalTransactionValue.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Gross merchandise value processed
          </div>
        </div>

        <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-200 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-emerald-900 uppercase tracking-wider block">
            Farmer Crop Fee Guarantee
          </span>
          <div className="text-4xl font-extrabold text-emerald-700 tabular-nums">
            0% FREE
          </div>
          <div className="text-xs text-emerald-800 font-medium">
            ₹0 fees charged to farmers on produce sales
          </div>
        </div>
      </div>

      {/* SECTOR BREAKDOWN TABLE */}
      <div className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Sector-Wise Revenue Breakdown
            </h3>
            <span className="text-xs text-slate-500">
              Auditing fee rates across buyers, workers, machinery, logistics, and zero-fee farmer sales.
            </span>
          </div>

          <div className="text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            Active Filter: {timeFilter}
          </div>
        </div>

        {/* Sectors List */}
        <div className="space-y-4">
          {revenueSectors.map(sector => {
            const isZero = sector.isFreePlatformService;
            const percentOfTotal = totalPlatformRevenue > 0 && !isZero
              ? Math.round((sector.platformRevenue / totalPlatformRevenue) * 100)
              : 0;

            return (
              <div
                key={sector.sector}
                className={`p-4 rounded-2xl border ${
                  isZero ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50/80 border-slate-200/80'
                } space-y-2`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">
                      {language === 'ta' ? sector.nameTa : sector.name}
                    </span>
                    <span className="text-slate-500 ml-2">
                      ({sector.transactionCount} transactions · Value: ₹{sector.bookingValue.toLocaleString('en-IN')})
                    </span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-extrabold text-sm tabular-nums ${
                        isZero ? 'text-emerald-800' : 'text-emerald-900'
                      }`}
                    >
                      {isZero ? '₹0 (100% Free)' : `₹${sector.platformRevenue.toLocaleString('en-IN')}`}
                    </span>
                    <span className="text-[11px] text-slate-500 ml-2">
                      Fee: {sector.feeRatePercent}%
                    </span>
                  </div>
                </div>

                {/* Progress visual */}
                {!isZero ? (
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-700 rounded-full"
                      style={{ width: `${percentOfTotal}%` }}
                    />
                  </div>
                ) : (
                  <div className="text-[11px] text-emerald-800 font-semibold">
                    ✓ Protected by platform charter: 0% fee on farmer crop sales and agro inputs.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RECENT REVENUE LOG */}
      <div className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Recent Accrued Service Fees
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {[
            { id: 'ORD1024', type: 'Buyer Crop Fee', val: '₹15,000', fee: '₹300 (2%)', party: 'Murugan Wholesale Mandi' },
            { id: 'MAC204', type: 'Machinery Fee', val: '₹4,000', fee: '₹80 (2%)', party: 'Ravi Machinery Services' },
            { id: 'WRK302', type: 'Worker Booking Fee', val: '₹5,000', fee: '₹100 (2%)', party: 'Marimuthu Field Team' },
            { id: 'LOG442', type: 'Logistics Fee', val: '₹2,000', fee: '₹40 (2%)', party: 'Kongu Agri Transport' },
          ].map(txn => (
            <div key={txn.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex justify-between font-bold text-slate-800">
                <span>#{txn.id}</span>
                <span className="text-emerald-800 font-extrabold">{txn.fee}</span>
              </div>
              <div className="text-slate-600">{txn.type} ({txn.val})</div>
              <div className="text-[11px] text-slate-400 truncate">{txn.party}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
