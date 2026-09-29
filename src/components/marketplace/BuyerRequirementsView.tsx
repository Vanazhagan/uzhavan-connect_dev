import React, { useState } from 'react';
import {
  FileText,
  Plus,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrustRingAvatar } from '../common/TrustRingAvatar';
import { BuyerRequirement } from '../../types';

export const BuyerRequirementsView: React.FC = () => {
  const {
    t,
    language,
    buyerRequirements,
    addBuyerRequirement,
    crops,
    currentUser,
    currentRole,
    setActiveTab,
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);

  // Form fields
  const [cropNeeded, setCropNeeded] = useState('Tomato');
  const [cropNeededTa, setCropNeededTa] = useState('தக்காளி');
  const [qty, setQty] = useState(1500);
  const [quality, setQuality] = useState('Grade A - Premium Firm Red');
  const [location, setLocation] = useState('Pollachi / Coimbatore');
  const [reqDate, setReqDate] = useState('2026-10-06');
  const [targetPrice, setTargetPrice] = useState(31);
  const [transport, setTransport] = useState('Buyer will arrange 2-Ton truck');

  const handlePostReq = (e: React.FormEvent) => {
    e.preventDefault();
    const isCoconut = cropNeeded === 'Coconut';
    addBuyerRequirement({
      cropNeeded,
      cropNeededTa,
      requiredQuantityKg: qty,
      preferredQuality: quality,
      preferredLocation: location,
      requiredDate: reqDate,
      targetPricePerKg: targetPrice,
      transportRequirement: transport,
      unit: isCoconut ? 'Coconuts' : 'KG',
    });
    setShowAddModal(false);
  };

  const getReqUnit = (cropNeeded: string, explicitUnit?: string) => {
    const isCoconut = cropNeeded.toLowerCase().includes('coconut') || explicitUnit === 'Coconuts';
    return {
      unitSingular: isCoconut ? 'Coconut' : (explicitUnit === 'Pieces' ? 'Piece' : 'KG'),
      unitPlural: isCoconut ? 'Coconuts' : (explicitUnit || 'KG'),
    };
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t.nav.requirements}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Transparent demand posted by wholesale mandis, retail chains, and food processors.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Post Requirement</span>
        </button>
      </div>

      {/* Deterministic Matching Banner */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950">
        <div>
          <span className="font-bold block">
            Deterministic Field Matching Active
          </span>
          <span className="text-emerald-800">
            Matches consider crop variety, available volume, harvest dates, and transit radius. Farmers always decide final fulfillment.
          </span>
        </div>
        <button
          onClick={() => setActiveTab('marketplace')}
          className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-semibold whitespace-nowrap"
        >
          Explore All Crops
        </button>
      </div>

      {/* Requirements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {buyerRequirements.map(req => {
          // Find matching crops in the system
          const matchingCrops = crops.filter(
            c =>
              c.cropName.toLowerCase() === req.cropNeeded.toLowerCase() &&
              c.remainingQuantityKg > 0
          );

          return (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <TrustRingAvatar
                    user={{ name: req.buyerName }}
                    trust={req.buyerTrust}
                    size="md"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{req.buyerName}</h4>
                    <span className="text-xs text-emerald-800 font-medium">
                      {req.buyerTrust.title}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-extrabold text-slate-900 block tabular-nums">
                    ₹{req.targetPricePerKg} / {getReqUnit(req.cropNeeded, req.unit).unitSingular}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Target Price</span>
                </div>
              </div>

              {/* Requirement Box */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-700">
                    Seeking: {language === 'ta' ? req.cropNeededTa : req.cropNeeded}
                  </span>
                  <span className="text-emerald-800 tabular-nums">
                    {req.requiredQuantityKg.toLocaleString('en-IN')} {getReqUnit(req.cropNeeded, req.unit).unitPlural}
                  </span>
                </div>

                <div className="text-slate-600 space-y-1 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Location: {req.preferredLocation}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Required Date: {req.requiredDate}</span>
                  </div>
                  <div>Quality: {req.preferredQuality}</div>
                  <div>Transport: {req.transportRequirement}</div>
                </div>
              </div>

              {/* Matching Farmers / Crops Section */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                  Matching Crops Ready ({matchingCrops.length})
                </span>
                {matchingCrops.length > 0 ? (
                  <div className="space-y-1.5">
                    {matchingCrops.slice(0, 2).map(mc => {
                      const isMcCoconut = mc.cropName.toLowerCase().includes('coconut') || mc.unit === 'Coconuts';
                      const mcUnitSingular = isMcCoconut ? 'Coconut' : (mc.unit === 'Pieces' ? 'Piece' : 'KG');
                      const mcUnitPlural = isMcCoconut ? 'Coconuts' : (mc.unit || 'KG');

                      return (
                        <div
                          key={mc.id}
                          className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-100 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-800">{mc.farmerName}</span>
                            <span className="text-[11px] text-slate-500 ml-1.5">
                              ({mc.remainingQuantityKg.toLocaleString('en-IN')} {mcUnitPlural} available)
                            </span>
                          </div>
                          <span className="font-bold text-emerald-800 tabular-nums">
                            ₹{mc.pricePerKg} / {mcUnitSingular}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    No active crops match this volume right now.
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Post Requirement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Post Commercial Crop Requirement
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostReq} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Crop Needed
                  </label>
                  <select
                    value={cropNeeded}
                    onChange={e => {
                      const mapTa: Record<string, string> = {
                        Tomato: 'தக்காளி',
                        Paddy: 'நெல்',
                        Coconut: 'தேங்காய்',
                        Onion: 'சின்ன வெங்காயம்',
                        Turmeric: 'மஞ்சள்',
                        Maize: 'மக்காச்சோளம்',
                        Banana: 'வாழை',
                      };
                      setCropNeeded(e.target.value);
                      setCropNeededTa(mapTa[e.target.value] || e.target.value);
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                  >
                    <option value="Tomato">Tomato (தக்காளி)</option>
                    <option value="Paddy">Paddy / Rice (நெல்)</option>
                    <option value="Coconut">Coconut (தேங்காய்)</option>
                    <option value="Onion">Small Onion (சின்ன வெங்காயம்)</option>
                    <option value="Turmeric">Turmeric (மஞ்சள்)</option>
                    <option value="Maize">Maize / Corn (மக்காச்சோளம்)</option>
                    <option value="Banana">Banana (வாழை)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Required Quantity ({cropNeeded === 'Coconut' ? 'Coconuts' : 'KG'})
                  </label>
                  <input
                    type="number"
                    min={50}
                    value={qty}
                    onChange={e => setQty(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Target Price / {cropNeeded === 'Coconut' ? 'Coconut' : 'KG'} (₹)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={targetPrice}
                    onChange={e => setTargetPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Required Delivery Date
                  </label>
                  <input
                    type="date"
                    value={reqDate}
                    onChange={e => setReqDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Preferred Location / District
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Quality Requirements
                </label>
                <input
                  type="text"
                  value={quality}
                  onChange={e => setQuality(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Publish Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
