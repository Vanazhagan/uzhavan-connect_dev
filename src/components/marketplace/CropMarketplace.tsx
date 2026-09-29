import React, { useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Send,
  Heart,
  ShieldCheck,
  Eye,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrustRingAvatar } from '../common/TrustRingAvatar';
import { CropListing } from '../../types';

export const CropMarketplace: React.FC = () => {
  const {
    t,
    language,
    crops,
    currentUser,
    currentRole,
    favourites,
    toggleFavourite,
    submitCropOffer,
    marketPrices,
    buyerRequirements,
    setActiveTab,
  } = useApp();

  const [selectedCropFilter, setSelectedCropFilter] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Offer modal state for buyer
  const [activeCropForOffer, setActiveCropForOffer] = useState<CropListing | null>(null);
  const [offerQty, setOfferQty] = useState<number>(500);
  const [offerPrice, setOfferPrice] = useState<number>(30);
  const [pickupTerms, setPickupTerms] = useState<'Farm Pickup by Buyer' | 'Farmer Arranged Logistics' | 'Direct Mandi Delivery'>('Farm Pickup by Buyer');
  const [offerMsg, setOfferMsg] = useState('');
  const [offerSuccess, setOfferSuccess] = useState(false);
  const [offerError, setOfferError] = useState<string | null>(null);

  // Details modal state for farmer
  const [activeCropForFarmerDetails, setActiveCropForFarmerDetails] = useState<CropListing | null>(null);

  const districts = ['All', 'Coimbatore', 'Pollachi', 'Erode', 'Salem', 'Thanjavur', 'Madurai', 'Tiruppur', 'Dindigul'];
  const cropNames = ['All', 'Paddy', 'Coconut', 'Groundnut', 'Black Gram', 'Green Gram', 'Onion', 'Sugarcane', 'Banana', 'Sunflower', 'Corn / Maize'];

  const filteredCrops = crops.filter(c => {
    if (selectedCropFilter !== 'All' && c.cropName !== selectedCropFilter) return false;
    if (selectedDistrict !== 'All' && !c.farmerDistrict.toLowerCase().includes(selectedDistrict.toLowerCase())) return false;
    if (searchQuery && !c.cropName.toLowerCase().includes(searchQuery.toLowerCase()) && !c.farmerDistrict.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCropForOffer) return;

    setOfferError(null);
    const res = submitCropOffer({
      cropListingId: activeCropForOffer.id,
      cropName: activeCropForOffer.cropName,
      offeredQuantityKg: offerQty,
      offeredPricePerKg: offerPrice,
      pickupTerms,
      message: offerMsg,
      unit: activeCropForOffer.unit || (activeCropForOffer.cropName === 'Coconut' ? 'Coconuts' : 'KG'),
    });

    if (res.success) {
      setOfferSuccess(true);
      setTimeout(() => {
        setOfferSuccess(false);
        setActiveCropForOffer(null);
      }, 1600);
    } else {
      setOfferError(res.message);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {currentRole === 'farmer' ? t.nav.marketplaceFarmer : t.nav.marketplace}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {currentRole === 'farmer'
              ? 'View active demand, wholesale buyer requirements, and market reference benchmarks for your harvests.'
              : 'Discover fresh harvests directly from verified Tamil Nadu farmers with live lot tracking.'}
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
          <span>Buyer Platform Fee: </span>
          <span className="font-bold text-emerald-800">2% on order value</span>
          <span className="text-[10px] text-slate-400 ml-1.5">(₹0 for farmers)</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search crop or district..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <select
              value={selectedCropFilter}
              onChange={e => setSelectedCropFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {cropNames.map(c => (
                <option key={c} value={c}>
                  Crop: {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {districts.map(d => (
                <option key={d} value={d}>
                  District: {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map(crop => {
          const percentSold = Math.round((crop.soldQuantityKg / crop.totalQuantityKg) * 100);
          const isSoldOut = crop.remainingQuantityKg <= 0 || crop.isSoldOut;
          const isFav = favourites.farmers.includes(crop.farmerId);

          return (
            <div
              key={crop.id}
              className="bg-white rounded-3xl border border-amber-900/10 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div>
                {/* Crop Image + Price Tag */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={crop.imageUrl}
                    alt={crop.cropName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                    ₹{crop.pricePerKg}{' '}
                    <span className="text-[10px] text-slate-500 font-normal">
                      / {crop.unit === 'Coconuts' ? 'Coconut' : crop.unit || 'KG'}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleFavourite('farmers', crop.farmerId)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs shadow-sm hover:scale-110 transition-transform cursor-pointer"
                    title="Favourite farmer"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-500'
                      }`}
                    />
                  </button>

                  {isSoldOut && (
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center text-white font-bold text-lg">
                      SOLD OUT
                    </div>
                  )}
                </div>

                {/* Farmer Info with Profile Trust Ring */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <TrustRingAvatar
                        user={{ name: crop.farmerName }}
                        trust={crop.farmerTrust}
                        size="md"
                        showLabel={false}
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{crop.farmerName}</h4>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                          <span className="truncate max-w-[140px]">{crop.farmerDistrict}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {crop.farmerTrust.title}
                    </span>
                  </div>

                  {/* Crop Details */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {language === 'ta' ? crop.cropNameTa : crop.cropName}
                      <span className="text-xs font-normal text-slate-500 ml-1.5">
                        ({crop.variety})
                      </span>
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                      {crop.description}
                    </p>
                  </div>

                  {/* Live Sale Progress Mini Bar */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600">Available Lot</span>
                      <span className="text-emerald-800 tabular-nums">
                        {crop.remainingQuantityKg.toLocaleString('en-IN')} / {crop.totalQuantityKg.toLocaleString('en-IN')} {crop.unit || 'KG'}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentSold}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>{percentSold}% Sold</span>
                      <span>Harvest: {crop.harvestDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                {currentRole === 'farmer' ? (
                  <button
                    onClick={() => setActiveCropForFarmerDetails(crop)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-emerald-700" />
                    <span>View Market Details & Mandi Rates</span>
                  </button>
                ) : (
                  <button
                    disabled={isSoldOut}
                    onClick={() => {
                      setActiveCropForOffer(crop);
                      setOfferQty(Math.min(500, crop.remainingQuantityKg));
                      setOfferPrice(crop.pricePerKg);
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                      isSoldOut
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-800 hover:bg-emerald-700 text-white shadow-xs cursor-pointer'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isSoldOut ? 'Sold Out' : 'Send Offer / Purchase'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Offer / Purchase Modal */}
      {activeCropForOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Submit Purchase Offer
                </h3>
                <span className="text-xs text-slate-500">
                  Direct to Farmer {activeCropForOffer.farmerName}
                </span>
              </div>
              <button
                onClick={() => setActiveCropForOffer(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendOffer} className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-950 text-sm block">
                    {activeCropForOffer.cropName} ({activeCropForOffer.variety})
                  </span>
                  <span className="text-[11px] text-emerald-800">
                    Remaining Available: {activeCropForOffer.remainingQuantityKg.toLocaleString('en-IN')}{' '}
                    {activeCropForOffer.unit || 'KG'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Base Price:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    ₹{activeCropForOffer.pricePerKg} / {activeCropForOffer.unit === 'Coconuts' ? 'Coconut' : activeCropForOffer.unit || 'KG'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Offer Quantity ({activeCropForOffer.unit || 'KG'})
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={activeCropForOffer.remainingQuantityKg}
                    value={offerQty}
                    onChange={e => setOfferQty(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Offered Price / {activeCropForOffer.unit === 'Coconuts' ? 'Coconut' : activeCropForOffer.unit || 'KG'} (₹)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={offerPrice}
                    onChange={e => setOfferPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Pickup & Transport Terms
                </label>
                <select
                  value={pickupTerms}
                  onChange={e => setPickupTerms(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                >
                  <option value="Farm Pickup by Buyer">Farm Pickup by Buyer (We bring transport)</option>
                  <option value="Farmer Arranged Logistics">Farmer Arranged Logistics (Add transit fee)</option>
                  <option value="Direct Mandi Delivery">Direct Mandi Delivery</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Message to Farmer (Optional)
                </label>
                <textarea
                  value={offerMsg}
                  onChange={e => setOfferMsg(e.target.value)}
                  placeholder="e.g. Can collect Oct 6 morning with our 2-Ton truck. Direct UPI payment on crate weighment."
                  rows={2}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                />
              </div>

              {/* Fee and Settlement Breakdown */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span>Agreed Crop Value:</span>
                  <span className="font-bold tabular-nums">
                    ₹{(offerQty * offerPrice).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-800">
                  <span>Buyer Platform Fee (2%):</span>
                  <span className="tabular-nums">
                    ₹{Math.round(offerQty * offerPrice * 0.02).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Farmer Platform Deduction:</span>
                  <span className="font-bold text-emerald-700">₹0 (100% Free)</span>
                </div>
              </div>

              {offerSuccess && (
                <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-xl font-semibold text-center animate-in zoom-in-95 text-xs">
                  Offer submitted! Status: PENDING FARMER REVIEW. Awaiting farmer acceptance.
                </div>
              )}

              {offerError && (
                <div className="p-2.5 bg-rose-100 text-rose-900 border border-rose-200 rounded-xl font-semibold text-center animate-in zoom-in-95">
                  {offerError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveCropForOffer(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Submit Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Farmer Market Details & Mandi Benchmark Modal */}
      {activeCropForFarmerDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-700" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Market Price & Demand Overview
                  </h3>
                  <span className="text-xs text-slate-500">
                    {activeCropForFarmerDetails.cropName} ({activeCropForFarmerDetails.variety || 'Grade 1'})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveCropForFarmerDetails(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Image & Price Comparison */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center gap-3">
                <img
                  src={activeCropForFarmerDetails.imageUrl}
                  alt={activeCropForFarmerDetails.cropName}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 text-sm">
                      {activeCropForFarmerDetails.cropName} · {activeCropForFarmerDetails.farmerDistrict}
                    </span>
                    <span className="font-bold text-slate-900">
                      ₹{activeCropForFarmerDetails.pricePerKg} / {activeCropForFarmerDetails.unit === 'Coconuts' ? 'Coconut' : activeCropForFarmerDetails.unit || 'KG'}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-800 block mt-0.5">
                    Farmer: {activeCropForFarmerDetails.farmerName} ({activeCropForFarmerDetails.cultivationType})
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Available: {activeCropForFarmerDetails.remainingQuantityKg.toLocaleString('en-IN')} {activeCropForFarmerDetails.unit || 'KG'}
                  </span>
                </div>
              </div>

              {/* Mandi Benchmark Comparison */}
              {(() => {
                const mandiMatch = marketPrices.find(
                  m => m.cropName.toLowerCase() === activeCropForFarmerDetails.cropName.toLowerCase()
                );
                return (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                        Mandi Benchmark Reference Rate:
                      </span>
                      <span className="font-extrabold text-emerald-800 text-sm tabular-nums">
                        ₹{mandiMatch?.referencePrice || activeCropForFarmerDetails.pricePerKg} / {mandiMatch?.unit || activeCropForFarmerDetails.unit || 'KG'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Mandi: {mandiMatch?.marketName || 'Regulated Market Mandi, Tamil Nadu'} ({mandiMatch?.location || 'Tamil Nadu'})
                    </div>
                  </div>
                );
              })()}

              {/* Active Commercial Buyer Demand for this crop */}
              {(() => {
                const activeDemands = buyerRequirements.filter(
                  r =>
                    r.cropNeeded.toLowerCase() === activeCropForFarmerDetails.cropName.toLowerCase() &&
                    r.status === 'open'
                );

                return (
                  <div className="space-y-2">
                    <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">
                      Active Buyer Commercial Demand ({activeDemands.length})
                    </span>

                    {activeDemands.length > 0 ? (
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {activeDemands.map(req => {
                          const isCoconut = req.cropNeeded.toLowerCase().includes('coconut') || req.unit === 'Coconuts';
                          const unitSingular = isCoconut ? 'Coconut' : (req.unit === 'Pieces' ? 'Piece' : 'KG');
                          const unitPlural = isCoconut ? 'Coconuts' : (req.unit || 'KG');

                          return (
                            <div
                              key={req.id}
                              className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-bold text-slate-900 block">{req.buyerName}</span>
                                <span className="text-[11px] text-slate-500">
                                  Needs {req.requiredQuantityKg.toLocaleString('en-IN')} {unitPlural} · {req.preferredLocation}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="font-extrabold text-emerald-800 block tabular-nums">
                                  ₹{req.targetPricePerKg} / {unitSingular}
                                </span>
                                <span className="text-[10px] text-slate-400">Target Offer</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-xl text-center text-slate-500 text-xs">
                        No open buyer requirements for this crop right now.
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setActiveCropForFarmerDetails(null);
                  setActiveTab('requirements');
                }}
                className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Browse All Buyer Demand
              </button>
              <button
                type="button"
                onClick={() => setActiveCropForFarmerDetails(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 font-medium hover:bg-slate-50 cursor-pointer text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
