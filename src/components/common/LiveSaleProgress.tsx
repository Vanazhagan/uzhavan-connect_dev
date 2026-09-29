import React, { useState } from 'react';
import { Sparkles, CheckCircle2, TrendingUp, Users, PlusCircle, AlertCircle } from 'lucide-react';
import { CropListing } from '../../types';
import { useApp, computeSalesLedger } from '../../context/AppContext';

interface LiveSaleProgressProps {
  crop: CropListing;
  allowDirectSale?: boolean;
}

export const LiveSaleProgress: React.FC<LiveSaleProgressProps> = ({ crop, allowDirectSale = true }) => {
  const { t, recordPartialSale } = useApp();
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState({ id: 'user_buyer_annapoorna', name: 'Annapoorna Fresh Foods' });

  const unit = crop.unit || (crop.cropName === 'Coconut' ? 'Coconuts' : 'KG');
  const unitSingular = unit === 'Coconuts' ? 'Coconut' : unit === 'Pieces' ? 'Piece' : unit;

  // Derive all metrics dynamically from the authoritative sales ledger
  const ledger = computeSalesLedger(crop.totalQuantityKg, crop.sales);
  const {
    soldQuantity,
    remainingQuantity,
    soldPercentage: percentSold,
    isSoldOut,
    buyerCount,
    validSales,
  } = ledger;

  const [customQty, setCustomQty] = useState<number>(Math.min(500, remainingQuantity || 500));
  const [customPrice, setCustomPrice] = useState<number>(crop.pricePerKg);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleConfirmSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (customQty <= 0) {
      setFeedbackMsg({ type: 'error', text: `Please enter a valid quantity in ${unit}.` });
      return;
    }
    if (customQty > remainingQuantity) {
      setFeedbackMsg({
        type: 'error',
        text: `Only ${remainingQuantity} ${unit} is currently available.`,
      });
      return;
    }

    const res = recordPartialSale(
      crop.id,
      selectedBuyer.id,
      selectedBuyer.name,
      customQty,
      customPrice
    );

    if (res.success) {
      setFeedbackMsg({ type: 'success', text: res.message });
      setTimeout(() => {
        setShowSaleModal(false);
        setFeedbackMsg(null);
      }, 1500);
    } else {
      setFeedbackMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-amber-900/10 shadow-xs space-y-4">
      {/* Header and Live Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isSoldOut ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isSoldOut ? 'bg-emerald-600' : 'bg-amber-500'}`}></span>
          </span>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            {t.saleProgress.title}
          </h4>
        </div>

        {/* Sold percentage badge */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              isSoldOut
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : percentSold > 50
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-slate-100 text-slate-800'
            }`}
          >
            {isSoldOut ? '100% SOLD' : `${percentSold}% ${t.saleProgress.soldPercent}`}
          </span>
        </div>
      </div>

      {/* Signature Animated Progress Bar */}
      <div className="space-y-1.5">
        <div className="relative w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isSoldOut
                ? 'bg-gradient-to-r from-emerald-600 to-green-500 shadow-sm shadow-emerald-500/30'
                : 'bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-500'
            }`}
            style={{ width: `${percentSold}%` }}
          />
        </div>

        {/* Axis markers */}
        <div className="flex justify-between text-[11px] text-slate-500 tabular-nums">
          <span>0 {unit}</span>
          <span>{Math.round(crop.totalQuantityKg / 2).toLocaleString('en-IN')} {unit} (50%)</span>
          <span className="font-semibold text-slate-700">
            {crop.totalQuantityKg.toLocaleString('en-IN')} {unit} (100%)
          </span>
        </div>
      </div>

      {/* Sold Out Celebration Card */}
      {isSoldOut ? (
        <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-300/80 rounded-xl text-center space-y-1.5 animate-in zoom-in-95 duration-300">
          <div className="inline-flex items-center justify-center gap-1.5 text-emerald-800 font-extrabold text-base">
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
            <span>SOLD OUT!</span>
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-800">
            <span className="px-2.5 py-0.5 bg-emerald-200 text-emerald-950 rounded-full">
              100% SOLD
            </span>
            <span>·</span>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-full">
              0 {unit} Remaining
            </span>
          </div>
          <p className="text-xs text-emerald-700 font-medium">
            {t.saleProgress.soldOutSub} ({crop.totalQuantityKg.toLocaleString('en-IN')} {unit})
          </p>
        </div>
      ) : (
        /* Stat Pillars */
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100 text-center">
            <span className="text-[11px] text-slate-500 block truncate">
              {t.saleProgress.originalQty}
            </span>
            <span className="text-base font-bold text-slate-800 tabular-nums">
              {crop.totalQuantityKg.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-500">{unit}</span>
            </span>
          </div>

          <div className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100/80 text-center">
            <span className="text-[11px] text-emerald-700 block truncate">
              {t.saleProgress.soldQty}
            </span>
            <span className="text-base font-bold text-emerald-800 tabular-nums">
              {soldQuantity.toLocaleString('en-IN')} <span className="text-xs font-normal text-emerald-600">{unit}</span>
            </span>
          </div>

          <div className="p-2.5 bg-amber-50/50 rounded-xl border border-amber-200/60 text-center">
            <span className="text-[11px] text-amber-800 block truncate font-medium">
              {t.saleProgress.remainingQty}
            </span>
            <span className="text-base font-bold text-amber-900 tabular-nums">
              {remainingQuantity.toLocaleString('en-IN')} <span className="text-xs font-normal text-amber-700">{unit}</span>
            </span>
          </div>
        </div>
      )}

      {/* Buyer Contribution Feed */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-emerald-700" />
          <span>
            {buyerCount} {buyerCount === 1 ? 'Buyer' : 'Buyers'} contracted
          </span>
        </div>

        {allowDirectSale && !isSoldOut && remainingQuantity > 0 && (
          <button
            onClick={() => setShowSaleModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Record Partial Sale</span>
          </button>
        )}
      </div>

      {/* Sales Breakup Micro-Timeline */}
      {validSales.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Recent Sales Split
          </span>
          <div className="space-y-1">
            {validSales.map((sale, idx) => (
              <div
                key={sale.id || sale.offerId || `${sale.buyerId}-${idx}`}
                className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium text-slate-800">{sale.buyerName}</span>
                </div>
                <div className="font-semibold text-slate-900 tabular-nums">
                  {sale.quantityKg.toLocaleString('en-IN')} {unit} @ ₹{sale.pricePerKg}/{unitSingular}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Partial Sale Modal */}
      {showSaleModal && !isSoldOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {t.saleProgress.partialSellModalTitle}
              </h3>
              <button
                onClick={() => setShowSaleModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmSale} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {t.saleProgress.selectBuyer}
                </label>
                <select
                  value={selectedBuyer.id}
                  onChange={e => {
                    const buyerMap: Record<string, string> = {
                      user_buyer_annapoorna: 'Annapoorna Fresh Foods',
                      user_buyer_murugan: 'Murugan Wholesale Agro Mandi',
                      user_buyer_new: 'Kaveri Agro Exports',
                    };
                    setSelectedBuyer({ id: e.target.value, name: buyerMap[e.target.value] || 'Direct Buyer' });
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="user_buyer_annapoorna">Annapoorna Fresh Foods (Tiruppur)</option>
                  <option value="user_buyer_murugan">Murugan Wholesale Agro Mandi (Coimbatore)</option>
                  <option value="user_buyer_new">Kaveri Agro Exports (Salem)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    {t.saleProgress.enterQuantity} ({unit})
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={remainingQuantity}
                    value={customQty}
                    onChange={e => setCustomQty(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    placeholder="e.g. 500"
                    required
                  />
                  <span className="text-[10px] text-amber-700 font-medium mt-0.5 block">
                    Available: {remainingQuantity} {unit}
                  </span>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    {t.saleProgress.enterPrice} (₹/{unitSingular})
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={customPrice}
                    onChange={e => setCustomPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    placeholder="30"
                    required
                  />
                </div>
              </div>

              {/* Calculated Value */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/70 text-emerald-950 flex items-center justify-between">
                <div>
                  <span className="text-[11px] block text-emerald-800">Direct Order Value:</span>
                  <span className="text-base font-bold tabular-nums">
                    ₹{(customQty * customPrice).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-right text-[11px] text-emerald-800">
                  <span>Buyer Platform Fee: 2%</span>
                  <span className="block font-semibold">Farmer Platform Fee: ₹0</span>
                </div>
              </div>

              {feedbackMsg && (
                <div
                  className={`p-2.5 rounded-lg flex items-center gap-2 text-xs font-medium ${
                    feedbackMsg.type === 'success'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {feedbackMsg.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{feedbackMsg.text}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSaleModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  {t.saleProgress.confirmSale}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

