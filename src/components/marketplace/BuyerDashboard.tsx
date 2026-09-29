import React from 'react';
import {
  ShoppingBag,
  FileText,
  Clock,
  AlertCircle,
  CreditCard,
  Heart,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrustRingAvatar } from '../common/TrustRingAvatar';
import { MarketPricesWidget } from '../common/MarketPricesWidget';

export const BuyerDashboard: React.FC = () => {
  const {
    currentUser,
    crops,
    offers,
    buyerRequirements,
    orders,
    favourites,
    setActiveTab,
    language,
    notifications,
  } = useApp();

  // Active buyer-specific data
  const myOffers = offers.filter(o => o.buyerId === currentUser.id);
  const pendingOffers = myOffers.filter(o => o.status === 'pending');
  const counterOffers = myOffers.filter(o => o.status === 'countered');
  const acceptedOffers = myOffers.filter(o => o.status === 'accepted');

  const myRequirements = buyerRequirements.filter(r => r.buyerId === currentUser.id);
  const openRequirements = myRequirements.filter(r => r.status === 'open');

  const myOrders = orders.filter(o => o.buyerId === currentUser.id);
  const pendingSettlementOrders = myOrders.filter(
    o => o.settlementStatus !== 'settlement_completed'
  );

  // Commercial crop matching alerts (crops available in system matching buyer requirements)
  const matchingCropAlerts = openRequirements.flatMap(req => {
    const matched = crops.filter(
      c =>
        c.cropName.toLowerCase() === req.cropNeeded.toLowerCase() &&
        c.remainingQuantityKg > 0 &&
        !c.isSoldOut
    );
    return matched.map(crop => ({
      reqId: req.id,
      cropNeeded: req.cropNeeded,
      cropNeededTa: req.cropNeededTa,
      reqQty: req.requiredQuantityKg,
      targetPrice: req.targetPricePerKg,
      crop,
    }));
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                Buyer Dashboard
              </span>
              <span className="text-xs text-emerald-200">
                {currentUser.businessName || 'Wholesale Agri Mandi'} · {currentUser.district}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              Direct farm-gate sourcing across Tamil Nadu. Propose purchase offers with <strong>0% farmer commission</strong> and direct buyer-to-farmer UPI settlement.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 self-start md:self-auto">
            <TrustRingAvatar user={{ name: currentUser.name }} trust={currentUser.trust} size="lg" />
            <div>
              <span className="text-[10px] text-amber-200 uppercase font-bold block">Trust Standing</span>
              <h4 className="text-sm font-bold text-white">{currentUser.trust.title}</h4>
              <span className="text-xs text-emerald-200">
                {currentUser.trust.completedTransactions} Farm Contracts Fulfilled
              </span>
            </div>
          </div>
        </div>

        {/* Trade Rules Sub-bar */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Buyer Platform Service Fee: <strong>2%</strong> · Farmer Deduction: <strong>₹0 (100% Free)</strong></span>
          </div>
          <span className="text-emerald-300 font-medium">Platform never locks your payments</span>
        </div>
      </div>

      {/* Action Required Alert: Counter Offers */}
      {counterOffers.length > 0 && (
        <div className="p-4 sm:p-5 bg-blue-50 border border-blue-200 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-2xl shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-blue-950">
                Action Required: {counterOffers.length} Counter Offer{counterOffers.length > 1 ? 's' : ''} Received from Farmer
              </h3>
              <p className="text-xs text-blue-800 mt-0.5">
                Farmers have reviewed your proposals and submitted counter price/quantities. Review and accept in My Offers to create confirmed orders.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('offers')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <span>Review Counter Offers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => setActiveTab('requirements')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 text-left transition-all shadow-2xs cursor-pointer flex flex-col justify-between min-h-[105px]"
        >
          <div className="flex items-center justify-between">
            <FileText className="w-5 h-5 text-emerald-700" />
            <span className="text-xl font-extrabold text-slate-900 tabular-nums">
              {openRequirements.length}
            </span>
          </div>
          <div>
            <div className="font-bold text-xs text-slate-800">Active Demand</div>
            <div className="text-[10px] text-slate-500">Posted Requirements</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 text-left transition-all shadow-2xs cursor-pointer flex flex-col justify-between min-h-[105px]"
        >
          <div className="flex items-center justify-between">
            <Clock className="w-5 h-5 text-amber-600" />
            <span className="text-xl font-extrabold text-amber-700 tabular-nums">
              {pendingOffers.length}
            </span>
          </div>
          <div>
            <div className="font-bold text-xs text-slate-800">Pending Offers</div>
            <div className="text-[10px] text-slate-500">Awaiting Farmer Approval</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`p-4 rounded-2xl border text-left transition-all shadow-2xs cursor-pointer flex flex-col justify-between min-h-[105px] ${
            counterOffers.length > 0
              ? 'bg-blue-50/80 border-blue-300 hover:border-blue-400'
              : 'bg-white border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <span className="text-xl font-extrabold text-blue-700 tabular-nums">
              {counterOffers.length}
            </span>
          </div>
          <div>
            <div className="font-bold text-xs text-slate-800">Counters to Review</div>
            <div className="text-[10px] text-slate-500">Farmer Counter-Proposals</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 text-left transition-all shadow-2xs cursor-pointer flex flex-col justify-between min-h-[105px]"
        >
          <div className="flex items-center justify-between">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <span className="text-xl font-extrabold text-slate-900 tabular-nums">
              {myOrders.length}
            </span>
          </div>
          <div>
            <div className="font-bold text-xs text-slate-800">Confirmed Orders</div>
            <div className="text-[10px] text-slate-500">Contracted Farm Lots</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 text-left transition-all shadow-2xs cursor-pointer flex flex-col justify-between min-h-[105px]"
        >
          <div className="flex items-center justify-between">
            <CreditCard className="w-5 h-5 text-purple-700" />
            <span className="text-xl font-extrabold text-purple-800 tabular-nums">
              {pendingSettlementOrders.length}
            </span>
          </div>
          <div>
            <div className="font-bold text-xs text-slate-800">Pending Payments</div>
            <div className="text-[10px] text-slate-500">Direct UPI / Bank Transfer</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('favFarmers')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 text-left transition-all shadow-2xs cursor-pointer flex flex-col justify-between min-h-[105px]"
        >
          <div className="flex items-center justify-between">
            <Heart className="w-5 h-5 text-rose-500" />
            <span className="text-xl font-extrabold text-slate-900 tabular-nums">
              {favourites.farmers.length}
            </span>
          </div>
          <div>
            <div className="font-bold text-xs text-slate-800">Favourite Farmers</div>
            <div className="text-[10px] text-slate-500">Regular Sourcing Partners</div>
          </div>
        </button>
      </div>

      {/* Quick Action Buttons Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('marketplace')}
          className="px-4 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-emerald-200" />
          <span>Browse Crop Market</span>
        </button>

        <button
          onClick={() => setActiveTab('requirements')}
          className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold shadow-2xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <FileText className="w-4 h-4 text-emerald-700" />
          <span>Post Commercial Requirement</span>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold shadow-2xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Clock className="w-4 h-4 text-amber-600" />
          <span>View My Offers ({myOffers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold shadow-2xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <CreditCard className="w-4 h-4 text-slate-700" />
          <span>Orders & Payments</span>
        </button>

        <button
          onClick={() => setActiveTab('favFarmers')}
          className="px-4 py-2.5 rounded-2xl bg-white hover:bg-rose-50 border border-slate-300 text-slate-800 text-xs font-bold shadow-2xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Heart className="w-4 h-4 text-rose-500" />
          <span>Favourite Farmers</span>
        </button>
      </div>

      {/* Two-Column Middle Section: Matching Crop Alerts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Commercial Crop Matching Alerts */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <h3 className="text-base font-bold text-slate-900">
                  Matching Farm Lots for Your Demand
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Available harvests matching your open commercial requirements
              </p>
            </div>

            <button
              onClick={() => setActiveTab('marketplace')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {matchingCropAlerts.length > 0 ? (
            <div className="space-y-3">
              {matchingCropAlerts.slice(0, 3).map((match, idx) => {
                const c = match.crop;
                const isCoconut = c.cropName.toLowerCase().includes('coconut') || c.unit === 'Coconuts';
                const unitSingular = isCoconut ? 'Coconut' : (c.unit === 'Pieces' ? 'Piece' : 'KG');
                const unitPlural = isCoconut ? 'Coconuts' : (c.unit || 'KG');

                return (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={c.imageUrl}
                        alt={c.cropName}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900">
                            {c.cropName} ({c.variety || 'Grade 1'})
                          </span>
                          <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                            Matches Requirement #{match.reqId}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 block">
                          Farmer: {c.farmerName} · {c.farmerDistrict}
                        </span>
                        <div className="text-xs text-slate-700 mt-1">
                          Available: <strong>{c.remainingQuantityKg.toLocaleString('en-IN')} {unitPlural}</strong> @{' '}
                          <strong className="text-emerald-800">₹{c.pricePerKg} / {unitSingular}</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('marketplace')}
                      className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Send Offer</span>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500 text-xs space-y-2">
              <p>No new farm lots currently matching your specific requirements.</p>
              <button
                onClick={() => setActiveTab('requirements')}
                className="text-xs font-bold text-emerald-800 underline"
              >
                + Post a New Commercial Crop Requirement
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Confirmed Orders & Settlement Snapshot */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Recent Confirmed Contracts
            </h3>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
            {myOrders.length > 0 ? (
              myOrders.slice(0, 3).map(order => {
                const isCoconut = order.cropName.toLowerCase().includes('coconut') || order.unit === 'Coconuts';
                const unitPlural = isCoconut ? 'Coconuts' : (order.unit || 'KG');

                return (
                  <div
                    key={order.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs hover:bg-slate-100/70 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">#{order.id}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">
                          {order.orderStatus.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-slate-600 block mt-0.5">
                        {order.quantityKg.toLocaleString('en-IN')} {unitPlural} {order.cropName} · Farmer: {order.farmerName}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-slate-900 block tabular-nums">
                        ₹{order.cropValue.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-semibold block">
                        Settlement: {order.settlementStatus}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-slate-500 text-xs">
                No confirmed orders yet. Accepted farmer offers will appear here.
              </div>
            )}

            <button
              onClick={() => setActiveTab('orders')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
            >
              Open Direct Payment Ledger
            </button>
          </div>
        </div>
      </div>

      {/* Commercial Market Reference Benchmarks Widget */}
      <MarketPricesWidget
        role="buyer"
        title="Commercial Mandi Price References"
        subtitle="Benchmark wholesale mandi prices across Tamil Nadu to guide your target requirement rates"
      />
    </div>
  );
};
