import React from 'react';
import {
  Sparkles,
  Layers,
  FileText,
  MapPin,
  ArrowRight,
  TrendingUp,
  Search,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LiveSaleProgress } from '../common/LiveSaleProgress';
import { MarketPricesWidget } from '../common/MarketPricesWidget';
import { TrustRingAvatar } from '../common/TrustRingAvatar';

export const MarketOpportunitiesView: React.FC = () => {
  const {
    t,
    language,
    crops,
    currentUser,
    buyerRequirements,
    setActiveTab,
  } = useApp();

  // Farmer's active crops
  const farmerCrops = crops.filter(c => c.farmerId === currentUser.id);
  const activeFarmerCrops = farmerCrops.filter(c => !c.isSoldOut && c.remainingQuantityKg > 0);
  const farmerCropNames = farmerCrops.map(c => c.cropName.toLowerCase());

  // Matching buyer requirements for farmer's active crops
  const matchingBuyerReqs = buyerRequirements.filter(
    req =>
      req.status === 'open' &&
      (farmerCropNames.length === 0 || farmerCropNames.includes(req.cropNeeded.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {language === 'ta' ? 'சந்தை வாய்ப்புகள்' : 'Market Opportunities'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
              Farmer Producer View
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Explore commercial buyer demand, track your crop sale progress, and inspect local mandi benchmark prices.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('myCrops')}
          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-amber-200" />
          <span>+ List Harvest Produce</span>
        </button>
      </div>

      {/* 0% Commission Guarantee banner for farmers */}
      <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>0% Commission for Farmers:</strong> Sell your harvest directly to verified wholesalers and processing units. 100% of agreed crop value goes straight to your account.
          </span>
        </div>
        <span className="text-[11px] font-bold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-200 shrink-0">
          Direct Payment
        </span>
      </div>

      {/* Section 1: Farmer Active Crops & Sale Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-800" />
            <h3 className="text-base font-bold text-slate-900">
              Your Active Listed Harvests ({farmerCrops.length})
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('myCrops')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 underline cursor-pointer"
          >
            Manage All Listings →
          </button>
        </div>

        {farmerCrops.length > 0 ? (
          <div className="space-y-4">
            {farmerCrops.map(crop => {
              const unit = crop.unit || 'KG';
              const unitSingular = unit === 'Coconuts' ? 'Coconut' : unit === 'Pieces' ? 'Piece' : unit;

              return (
                <div
                  key={crop.id}
                  className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={crop.imageUrl}
                        alt={crop.cropName}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                            {crop.qualityGrade || 'Grade A'}
                          </span>
                          <span className="text-xs text-slate-500">{crop.cultivationType}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mt-0.5">
                          {language === 'ta' ? crop.cropNameTa : crop.cropName}
                          <span className="text-xs font-normal text-slate-500 ml-2">
                            ({crop.variety})
                          </span>
                        </h4>
                        <span className="text-xs text-slate-500">
                          Harvest Date: {crop.harvestDate} · {crop.farmerDistrict}
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-start sm:items-end justify-between gap-1">
                      <span className="text-xs text-slate-400 font-medium">Expected Price</span>
                      <span className="text-lg font-extrabold text-emerald-900 tabular-nums">
                        ₹{crop.pricePerKg}
                        <span className="text-xs font-normal text-slate-500"> /{unitSingular}</span>
                      </span>
                      <button
                        onClick={() => setActiveTab('myCrops')}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer border border-slate-200 transition-colors"
                      >
                        Manage Listing
                      </button>
                    </div>
                  </div>

                  {/* Live Sales Progress Widget */}
                  <LiveSaleProgress crop={crop} allowDirectSale={true} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-2">
            <Layers className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No Harvest Produce Currently Listed</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              List your upcoming crop harvest to start receiving direct purchase offers from verified buyers.
            </p>
            <button
              onClick={() => setActiveTab('myCrops')}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
            >
              + List First Harvest
            </button>
          </div>
        )}
      </div>

      {/* Section 2: Matching Commercial Buyer Requirements */}
      <div className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-800" />
            <h3 className="text-base font-bold text-slate-900">
              Matching Commercial Buyer Requirements
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {matchingBuyerReqs.length} Open Demand Postings
          </span>
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
                  className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 hover:border-emerald-300 transition-colors flex flex-col justify-between space-y-3"
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
                      className="px-3 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs cursor-pointer transition-colors"
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
            No open buyer requirements currently posted. List your crops to attract direct buyer inquiries!
          </div>
        )}
      </div>

      {/* Section 3: Mandi Benchmark Reference Prices */}
      <MarketPricesWidget
        role="farmer"
        title="Mandi Benchmark Reference Rates"
        subtitle="Sample reference prices across Tamil Nadu regulated agricultural markets (Demo Reference Only)"
      />
    </div>
  );
};
