import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ShoppingBag,
  Filter,
  ShieldCheck,
  Calendar,
  Layers,
  MapPin,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrustRingAvatar } from '../common/TrustRingAvatar';
import { CropOffer } from '../../types';

export const BuyerOffersView: React.FC = () => {
  const {
    offers,
    crops,
    currentUser,
    respondToCounterOffer,
    setActiveTab,
    language,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'countered' | 'accepted' | 'rejected'>('all');
  const [feedback, setFeedback] = useState<{ id: string; type: 'success' | 'error'; message: string } | null>(null);

  // Filter buyer offers for the active buyer (or fallback to all offers if in demo)
  const myOffers = offers.filter(o => o.buyerId === currentUser.id || currentUser.role !== 'buyer');

  const filteredOffers = myOffers.filter(offer => {
    if (statusFilter === 'all') return true;
    return offer.status === statusFilter;
  });

  const counts = {
    all: myOffers.length,
    pending: myOffers.filter(o => o.status === 'pending').length,
    countered: myOffers.filter(o => o.status === 'countered').length,
    accepted: myOffers.filter(o => o.status === 'accepted').length,
    rejected: myOffers.filter(o => o.status === 'rejected').length,
  };

  const handleAcceptCounter = (offerId: string) => {
    const res = respondToCounterOffer(offerId, 'accept');
    if (res.success) {
      setFeedback({ id: offerId, type: 'success', message: res.message });
    } else {
      setFeedback({ id: offerId, type: 'error', message: res.message });
    }
  };

  const handleRejectCounter = (offerId: string) => {
    const res = respondToCounterOffer(offerId, 'reject');
    if (res.success) {
      setFeedback({ id: offerId, type: 'success', message: res.message });
    } else {
      setFeedback({ id: offerId, type: 'error', message: res.message });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            My Offers
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Track your direct crop purchase proposals and farmer responses across Tamil Nadu
          </p>
        </div>

        {/* Direct Trade Notice */}
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>
            <strong>Direct Farmer Proposal:</strong> 0% farmer commission. Offers do not create orders or lock funds until farmer acceptance.
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs scrollbar-none">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>All Offers</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-800 font-bold">
            {counts.all}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'pending'
              ? 'bg-amber-600 text-white'
              : 'bg-white text-amber-900 hover:bg-amber-50 border border-amber-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Farmer Approval</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-900 font-bold">
            {counts.pending}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('countered')}
          className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'countered'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-900 hover:bg-blue-50 border border-blue-200'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Countered by Farmer</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-900 font-bold">
            {counts.countered}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('accepted')}
          className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'accepted'
              ? 'bg-emerald-700 text-white'
              : 'bg-white text-emerald-900 hover:bg-emerald-50 border border-emerald-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Accepted</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-900 font-bold">
            {counts.accepted}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('rejected')}
          className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'rejected'
              ? 'bg-rose-700 text-white'
              : 'bg-white text-rose-900 hover:bg-rose-50 border border-rose-200'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Rejected</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-900 font-bold">
            {counts.rejected}
          </span>
        </button>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 ${
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

      {/* Empty State */}
      {filteredOffers.length === 0 && (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-700">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No Offers Found
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {statusFilter === 'all'
              ? 'You have not submitted any crop purchase offers yet. Explore active farm lots in the Crop Marketplace and propose direct purchase terms.'
              : `No offers currently under "${statusFilter.replace('_', ' ')}".`}
          </p>
          <button
            onClick={() => setActiveTab('marketplace')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Crop Marketplace</span>
          </button>
        </div>
      )}

      {/* Offers List */}
      <div className="space-y-5">
        {filteredOffers.map(offer => {
          const matchedCrop = crops.find(c => c.id === offer.cropListingId);
          const farmerName = offer.farmerName || matchedCrop?.farmerName || 'Kumar Thangavel';
          const farmerTrust = offer.farmerTrust || matchedCrop?.farmerTrust || {
            level: 'star',
            title: 'Community Star',
            completedTransactions: 48,
            fulfilmentRate: 99,
            isVerified: true,
            positiveFeedbackScore: 5.0,
            cancellationRate: 0.5,
            reasons: ['Verified Farm Producer', 'Zero Quality Dispute Record'],
          };
          const farmerLocation = offer.farmerDistrict || matchedCrop?.farmerDistrict || 'Pollachi, Coimbatore';

          // Crop unit determination
          const isCoconut = offer.cropName.toLowerCase().includes('coconut') || offer.unit === 'Coconuts';
          const unitSingular = isCoconut ? 'Coconut' : (offer.unit === 'Pieces' ? 'Piece' : 'KG');
          const unitPlural = isCoconut ? 'Coconuts' : (offer.unit || 'KG');

          const proposedCropValue = offer.totalCropValue || (offer.offeredQuantityKg * offer.offeredPricePerKg);
          const buyerFee2Percent = Math.round(proposedCropValue * 0.02);

          return (
            <div
              key={offer.id}
              className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-5 sm:p-6 space-y-4 hover:border-emerald-300 transition-colors"
            >
              {/* Card Header: Farmer & Offer Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <TrustRingAvatar user={{ name: farmerName }} trust={farmerTrust} size="md" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Farmer / Seller</span>
                      <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {farmerLocation}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{farmerName}</h4>
                    <span className="text-[11px] text-emerald-800 font-medium">{farmerTrust.title}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1">
                  {/* Status Badge */}
                  {offer.status === 'pending' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      Waiting for Farmer Approval
                    </span>
                  )}
                  {offer.status === 'countered' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
                      <AlertCircle className="w-3.5 h-3.5 text-blue-700" />
                      Countered by Farmer
                    </span>
                  )}
                  {offer.status === 'accepted' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      Offer Accepted
                    </span>
                  )}
                  {offer.status === 'rejected' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
                      <XCircle className="w-3.5 h-3.5 text-rose-700" />
                      Offer Rejected
                    </span>
                  )}

                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Offered on: {offer.createdAt}
                  </span>
                </div>
              </div>

              {/* Offer Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Crop</span>
                  <span className="text-sm font-bold text-slate-900">
                    {language === 'ta' && matchedCrop?.cropNameTa ? matchedCrop.cropNameTa : offer.cropName}
                  </span>
                  {matchedCrop?.variety && (
                    <span className="text-[11px] text-slate-500 block">{matchedCrop.variety}</span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Offered Quantity</span>
                  <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                    {offer.offeredQuantityKg.toLocaleString('en-IN')} {unitPlural}
                  </span>
                  <span className="text-[11px] text-slate-500 block">Unit: {unitPlural}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Offered Price</span>
                  <span className="text-sm font-extrabold text-emerald-800 tabular-nums">
                    ₹{offer.offeredPricePerKg} / {unitSingular}
                  </span>
                  <span className="text-[11px] text-slate-500 block">Direct to Farmer</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Proposed Crop Value</span>
                  <span className="text-base font-extrabold text-slate-900 tabular-nums">
                    ₹{proposedCropValue.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-emerald-800 block">
                    Buyer Fee 2%: ₹{buyerFee2Percent.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Additional Terms / Buyer Message */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 bg-white px-1">
                <span>
                  Logistics & Delivery: <strong className="text-slate-800">{offer.pickupTerms}</strong>
                </span>
                {offer.message && (
                  <span className="italic text-slate-500">
                    Your note: &ldquo;{offer.message}&rdquo;
                  </span>
                )}
              </div>

              {/* STATUS SPECIFIC PANELS */}

              {/* 1. PENDING STATUS */}
              {offer.status === 'pending' && (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1.5 text-xs text-amber-950">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span>Waiting for Farmer Approval</span>
                  </div>
                  <p className="text-amber-800 leading-relaxed">
                    The farmer has been notified and is reviewing your offer. No order has been created, no crop stock has been reduced, and no payment is required at this stage.
                  </p>
                  <div className="pt-1 text-[11px] text-amber-700 font-medium">
                    • Once the farmer accepts, a confirmed order will be created and appear in your <strong>Orders & Payments</strong> view.
                  </div>
                </div>
              )}

              {/* 2. COUNTERED STATUS */}
              {offer.status === 'countered' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-3 text-xs text-blue-950">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
                      <AlertCircle className="w-4 h-4 text-blue-700" />
                      <span>Farmer Proposed a Counter Offer</span>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-800 bg-white px-2 py-0.5 rounded-md border border-blue-200">
                      Action Required
                    </span>
                  </div>

                  {/* Counter Specifics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white rounded-xl border border-blue-150">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Farmer Counter Price
                      </span>
                      <span className="text-base font-extrabold text-blue-900 tabular-nums">
                        ₹{offer.counterPricePerKg || offer.offeredPricePerKg} / {unitSingular}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        (Original: ₹{offer.offeredPricePerKg}/{unitSingular})
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Counter Quantity
                      </span>
                      <span className="text-base font-extrabold text-slate-900 tabular-nums">
                        {(offer.counterQuantityKg || offer.offeredQuantityKg).toLocaleString('en-IN')} {unitPlural}
                      </span>
                      <span className="text-[10px] text-slate-500 block">Correct Unit</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        New Proposed Total
                      </span>
                      <span className="text-base font-extrabold text-emerald-800 tabular-nums">
                        ₹{(
                          (offer.counterQuantityKg || offer.offeredQuantityKg) *
                          (offer.counterPricePerKg || offer.offeredPricePerKg)
                        ).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-500 block">Total Produce Value</span>
                    </div>
                  </div>

                  {/* Farmer Message if available */}
                  {offer.counterMessage && (
                    <div className="p-2.5 bg-blue-100/70 rounded-xl border border-blue-200 text-blue-900 text-xs italic">
                      <strong>Farmer Note:</strong> &ldquo;{offer.counterMessage}&rdquo;
                    </div>
                  )}

                  {/* Counter Action Buttons */}
                  <div className="flex items-center justify-end gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleRejectCounter(offer.id)}
                      className="px-3.5 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Reject Counter
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAcceptCounter(offer.id)}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      <span>Accept Counter & Confirm Order</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 3. ACCEPTED STATUS */}
              {offer.status === 'accepted' && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Offer Accepted</span>
                    </div>
                    <p className="text-emerald-800">
                      The farmer accepted this proposal. Confirmed order has been generated with zero farmer commission.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    <span>View Confirmed Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* 4. REJECTED STATUS */}
              {offer.status === 'rejected' && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-950">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-rose-900 text-sm">
                      <XCircle className="w-4 h-4 text-rose-700" />
                      <span>Offer Rejected</span>
                    </div>
                    <p className="text-rose-800">
                      The farmer was unable to accept this purchase offer. No order was created and no funds were deducted.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('marketplace')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-rose-300 text-rose-900 hover:bg-rose-100 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer"
                  >
                    <span>Browse Other Crops</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
