import React from 'react';
import {
  CloudSun,
  Calendar,
  Layers,
  Wrench,
  Users,
  ShoppingBag,
  CreditCard,
  Truck,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  FileText,
  DollarSign,
  Briefcase,
  CheckCircle2,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  getFarmerSalesMetrics,
  getFarmerOfferMetrics,
  getFarmerCropMetrics,
  getFarmerPaymentMetrics,
  getFarmerBookingMetrics,
} from '../../utils/appDataHelpers';
import { TrustRingAvatar } from '../common/TrustRingAvatar';
import { LiveSaleProgress } from '../common/LiveSaleProgress';
import { MarketPricesWidget } from '../common/MarketPricesWidget';
import { ASSET_IMAGES } from '../../assets/images';

export const FarmerDashboard: React.FC = () => {
  const {
    t,
    language,
    currentUser,
    setActiveTab,
    calendarEvents,
    crops,
    offers,
    orders,
    buyerRequirements,
    weatherForecast,
    workerBookings,
    machineryBookings,
    deliveryRequests,
  } = useApp();

  const todayWeather = weatherForecast[0];

  // Compute shared metrics via appDataHelpers
  const salesMetrics = getFarmerSalesMetrics(currentUser.id, currentUser.name, crops);
  const offerMetrics = getFarmerOfferMetrics(currentUser.id, currentUser.name, offers);
  const cropMetrics = getFarmerCropMetrics(currentUser.id, currentUser.name, crops);
  const paymentMetrics = getFarmerPaymentMetrics(currentUser.id, currentUser.name, orders);
  const bookingMetrics = getFarmerBookingMetrics(
    currentUser.id,
    currentUser.name,
    workerBookings,
    machineryBookings,
    deliveryRequests
  );

  const farmerCrops = cropMetrics.farmerCrops;
  const activeCrops = cropMetrics.activeCrops;
  const farmerCropNames = farmerCrops.map(c => c.cropName.toLowerCase());

  const thisMonthSales = salesMetrics.thisMonthSales;
  const thisYearSales = salesMetrics.thisYearSales;
  const buyerIdSet = new Set(salesMetrics.uniqueBuyerNames);

  const pendingOffersCount = offerMetrics.pendingOffersCount;

  // Matching buyer requirements
  const matchingBuyerReqs = buyerRequirements.filter(
    req =>
      req.status === 'open' &&
      (farmerCropNames.length === 0 || farmerCropNames.includes(req.cropNeeded.toLowerCase()))
  );

  const totalAmountReceived = paymentMetrics.totalReceived;
  const totalPendingAmount = paymentMetrics.totalPending;

  const activeWorkerBooking = bookingMetrics.upcomingWorkerBooking;
  const activeMachineryBooking = bookingMetrics.activeMachineryBooking;
  const activeDelivery = bookingMetrics.activeDelivery;

  const farmerWorkerBookings = bookingMetrics.workerBookings;
  const farmerMachineryBookings = bookingMetrics.machineryBookings;
  const farmerDeliveryRequests = bookingMetrics.deliveryRequests;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Profile & Weather Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-amber-950 text-white p-6 sm:p-8 shadow-sm">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: `url(${ASSET_IMAGES.heroTamilFarms})` }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <TrustRingAvatar user={currentUser} size="xl" interactive={true} />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-[11px] text-emerald-200">
                <span>{currentUser.farmSize || '6.5 Acres'}</span>
                <span>·</span>
                <span>{currentUser.irrigationType || 'Drip Irrigation'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {currentUser.name}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/90 font-medium">
                {currentUser.village}, {currentUser.taluk}, {currentUser.district}
              </p>
              <div className="pt-1 flex items-center gap-2 text-xs text-amber-300 font-semibold">
                <span>{currentUser.trust.title}</span>
                <span>·</span>
                <span>{currentUser.trust.completedTransactions} {t.crops.completedLots}</span>
              </div>
            </div>
          </div>

          {/* Weather Widget */}
          <div
            onClick={() => setActiveTab('weather')}
            className="group cursor-pointer bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:w-64 transition-all"
          >
            <div className="flex items-center justify-between text-xs text-amber-200">
              <span className="font-semibold uppercase tracking-wider">
                {t.weather.title}
              </span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                LIVE DEMO
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold tracking-tight tabular-nums">
                  {todayWeather.tempCelsius}°C
                </div>
                <div className="text-xs text-emerald-200">
                  {language === 'ta' ? todayWeather.conditionTa : todayWeather.condition}
                </div>
              </div>
              <CloudSun className="w-10 h-10 text-amber-300 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-100/90">
              <span>Rain Chance: {todayWeather.rainChancePercent}%</span>
              <span className="underline underline-offset-2 flex items-center gap-1 group-hover:text-amber-200">
                Forecast <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main KPI Cards (This Month Sales, This Year Sales, Total Buyers, Pending Offers) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: This Month Sales */}
        <div
          onClick={() => setActiveTab('orders')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-900/10 shadow-2xs hover:border-emerald-400 transition-all cursor-pointer group space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">This Month Sales</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-900 tabular-nums">
            ₹{thisMonthSales.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500">Confirmed & contracted sales</p>
        </div>

        {/* KPI 2: This Year Sales */}
        <div
          onClick={() => setActiveTab('orders')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-900/10 shadow-2xs hover:border-emerald-400 transition-all cursor-pointer group space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">This Year Sales</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums">
            ₹{thisYearSales.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500">2026 Cumulative revenue</p>
        </div>

        {/* KPI 3: Total Buyers */}
        <div
          onClick={() => setActiveTab('orders')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-900/10 shadow-2xs hover:border-emerald-400 transition-all cursor-pointer group space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Buyers</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-800">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums">
            {buyerIdSet.size} <span className="text-xs font-normal text-slate-500">Traders</span>
          </div>
          <p className="text-[11px] text-slate-500">Direct buyers contracted</p>
        </div>

        {/* KPI 4: Pending Offers */}
        <div
          onClick={() => setActiveTab('myCrops')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-900/10 shadow-2xs hover:border-emerald-400 transition-all cursor-pointer group space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Offers</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-800">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-purple-900 tabular-nums">
            {pendingOffersCount} <span className="text-xs font-normal text-slate-500">Offers</span>
          </div>
          <p className="text-[11px] text-purple-700 font-medium">Awaiting your response</p>
        </div>
      </div>

      {/* 3. Quick Actions Grid */}
      <div className="space-y-2">
        <h3 className="text-base font-bold text-slate-900">{t.farmer.quickActions}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            onClick={() => setActiveTab('myCrops')}
            className="p-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-left transition-all shadow-2xs cursor-pointer space-y-1 group"
          >
            <PlusCircle className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs">Add Crop Harvest</div>
            <div className="text-[10px] text-emerald-200">List produce for 0% fee</div>
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className="p-3.5 bg-white hover:bg-emerald-50/60 text-slate-900 border border-slate-200 rounded-2xl text-left transition-all shadow-2xs cursor-pointer space-y-1 group"
          >
            <ShoppingBag className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs">Market Opportunities</div>
            <div className="text-[10px] text-slate-500">View demand & mandi rates</div>
          </button>

          <button
            onClick={() => setActiveTab('jobRequests')}
            className="p-3.5 bg-white hover:bg-emerald-50/60 text-slate-900 border border-slate-200 rounded-2xl text-left transition-all shadow-2xs cursor-pointer space-y-1 group"
          >
            <Users className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs">Post Labour Need</div>
            <div className="text-[10px] text-slate-500">Hire local worker teams</div>
          </button>

          <button
            onClick={() => setActiveTab('machinery')}
            className="p-3.5 bg-white hover:bg-emerald-50/60 text-slate-900 border border-slate-200 rounded-2xl text-left transition-all shadow-2xs cursor-pointer space-y-1 group"
          >
            <Wrench className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs">Book Machinery</div>
            <div className="text-[10px] text-slate-500">Tractors & harvesters</div>
          </button>

          <button
            onClick={() => setActiveTab('logistics')}
            className="p-3.5 bg-white hover:bg-emerald-50/60 text-slate-900 border border-slate-200 rounded-2xl text-left transition-all shadow-2xs cursor-pointer space-y-1 group"
          >
            <Truck className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs">Request Logistics</div>
            <div className="text-[10px] text-slate-500">Farm-to-mandi transport</div>
          </button>
        </div>
      </div>

      {/* SECTION A: ACTIVE CROPS & SALE PROGRESS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-800" />
            <h3 className="text-base font-bold text-slate-900">
              A. Active Crop Harvests ({farmerCrops.length})
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('myCrops')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 underline cursor-pointer"
          >
            Manage Listings →
          </button>
        </div>

        {farmerCrops.length > 0 ? (
          <div className="space-y-4">
            {farmerCrops.map(crop => (
              <div key={crop.id} className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={crop.imageUrl}
                      alt={crop.cropName}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {language === 'ta' ? crop.cropNameTa : crop.cropName}
                        <span className="text-xs font-normal text-slate-500 ml-2">({crop.variety})</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Harvest: {crop.harvestDate} · {crop.farmerDistrict}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-emerald-900 tabular-nums block">
                      ₹{crop.pricePerKg} / {crop.unit === 'Coconuts' ? 'Coconut' : crop.unit || 'KG'}
                    </span>
                    <span className="text-[10px] text-slate-400">Expected Farm Rate</span>
                  </div>
                </div>

                {/* Live Sale Progress Bar Component */}
                <LiveSaleProgress crop={crop} allowDirectSale={true} />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-2">
            <Layers className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No Harvest Produce Currently Listed</h4>
            <p className="text-xs text-slate-500">List your upcoming crop harvest to start receiving buyer offers.</p>
          </div>
        )}
      </div>

      {/* SECTION B: CURRENT MARKET REFERENCE (Prioritizes Active Crops First) */}
      <MarketPricesWidget
        role="farmer"
        title="B. Current Market Reference Prices"
        subtitle="Sample reference prices across Tamil Nadu regulated agricultural markets (prioritizing your active crops)"
      />

      {/* SECTION C: BUYER NEEDS MATCHING YOUR CROPS */}
      <div className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-800" />
              <h3 className="text-base font-bold text-slate-900">
                C. Buyer Needs Matching Your Crops
              </h3>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                Active Crop Filter
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Wholesale buyer requirements seeking crops in your active portfolio ({farmerCropNames.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')})
            </p>
          </div>

          <button
            onClick={() => setActiveTab('marketplace')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>View All Market Demand</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {matchingBuyerReqs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchingBuyerReqs.map(req => {
              const isCoconut = req.cropNeeded.toLowerCase().includes('coconut') || req.unit === 'Coconuts';
              const unitSingular = isCoconut ? 'Coconut' : (req.unit === 'Pieces' ? 'Piece' : 'KG');
              const unitPlural = isCoconut ? 'Coconuts' : (req.unit || 'KG');

              return (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100/90 hover:border-emerald-300 transition-colors flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <TrustRingAvatar user={{ name: req.buyerName }} trust={req.buyerTrust} size="md" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{req.buyerName}</h4>
                        <span className="text-[11px] text-emerald-800 font-medium">{req.buyerTrust.title}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold text-emerald-900 block tabular-nums">
                        ₹{req.targetPricePerKg} / {unitSingular}
                      </span>
                      <span className="text-[10px] text-slate-400">Target Offer</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-100 space-y-1 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-800">
                        Seeking: {language === 'ta' && req.cropNeededTa ? req.cropNeededTa : req.cropNeeded}
                      </span>
                      <span className="text-emerald-800 tabular-nums">
                        {req.requiredQuantityKg.toLocaleString('en-IN')} {unitPlural}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-between gap-2 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-700" />
                        {req.preferredLocation}
                      </span>
                      <span>Needed by: {req.requiredDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>{req.transportRequirement}</span>
                    <button
                      onClick={() => setActiveTab('myCrops')}
                      className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
                    >
                      Offer My Harvest →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
            No buyer requirements currently matched to your crops.
          </div>
        )}
      </div>

      {/* SECTION D: PAYMENT SUMMARY */}
      <div className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-800" />
            <h3 className="text-base font-bold text-slate-900">D. Payment Summary</h3>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 underline cursor-pointer"
          >
            View Orders & Settlements →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Received */}
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-1">
            <span className="text-xs font-semibold text-emerald-800 block">
              ✓ Amount Received (Farmer Confirmed)
            </span>
            <div className="text-2xl font-extrabold text-emerald-900 tabular-nums">
              ₹{totalAmountReceived.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-emerald-700">
              Direct UPI / Bank transfer confirmed received by you (0% platform fee)
            </p>
          </div>

          {/* Pending */}
          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-1">
            <span className="text-xs font-semibold text-amber-900 block">
              ⏳ Pending Settlement / Awaiting Receipt Confirmation
            </span>
            <div className="text-2xl font-extrabold text-amber-900 tabular-nums">
              ₹{totalPendingAmount.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-amber-800">
              Recorded payments awaiting your bank receipt verification
            </p>
          </div>
        </div>
      </div>

      {/* SECTIONS E, F, G: WORKER, MACHINERY & LOGISTICS STATUS SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* E. Worker Status */}
        <div className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-700" />
                E. Worker Status
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                {farmerWorkerBookings.length} Bookings
              </span>
            </div>

            {activeWorkerBooking ? (
              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1 text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{activeWorkerBooking.workerName}</span>
                  <span className="uppercase text-[10px] text-emerald-800 font-extrabold bg-emerald-100 px-2 py-0.2 rounded">
                    {activeWorkerBooking.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {activeWorkerBooking.workType} · {activeWorkerBooking.date}
                </p>
                <div className="text-[11px] font-semibold text-emerald-900 pt-0.5">
                  {activeWorkerBooking.workersRequired} Workers (₹{activeWorkerBooking.totalCharge.toLocaleString('en-IN')})
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                No active worker bookings right now.
              </p>
            )}
          </div>

          <button
            onClick={() => setActiveTab('jobRequests')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
          >
            Post Labour Need / View Workers →
          </button>
        </div>

        {/* F. Machinery Status */}
        <div className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-emerald-700" />
                F. Machinery Status
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                {farmerMachineryBookings.length} Rentals
              </span>
            </div>

            {activeMachineryBooking ? (
              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1 text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span className="truncate max-w-[160px]">{activeMachineryBooking.machineName}</span>
                  <span className="uppercase text-[10px] text-emerald-800 font-extrabold bg-emerald-100 px-2 py-0.2 rounded">
                    {activeMachineryBooking.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {activeMachineryBooking.workPurpose} · {activeMachineryBooking.date}
                </p>
                <div className="text-[11px] font-semibold text-emerald-900 pt-0.5">
                  Provider: {activeMachineryBooking.providerName} (₹{activeMachineryBooking.estimatedCost.toLocaleString('en-IN')})
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                No active machinery rentals right now.
              </p>
            )}
          </div>

          <button
            onClick={() => setActiveTab('machinery')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
          >
            Book Tractor / Machinery →
          </button>
        </div>

        {/* G. Logistics Status */}
        <div className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-700" />
                G. Logistics Status
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                {farmerDeliveryRequests.length} Shipments
              </span>
            </div>

            {activeDelivery ? (
              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1 text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{activeDelivery.cropName} Shipment</span>
                  <span className="uppercase text-[10px] text-emerald-800 font-extrabold bg-emerald-100 px-2 py-0.2 rounded">
                    {activeDelivery.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  To: {activeDelivery.buyerName}
                </p>
                <div className="text-[11px] font-semibold text-emerald-900 pt-0.5">
                  {activeDelivery.quantityKg} {activeDelivery.unit || 'KG'} · Date: {activeDelivery.preferredDate}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                No active produce shipments right now.
              </p>
            )}
          </div>

          <button
            onClick={() => setActiveTab('logistics')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
          >
            Request Transport Delivery →
          </button>
        </div>
      </div>
    </div>
  );
};
