import React, { useState } from 'react';
import {
  Plus,
  Layers,
  Sparkles,
  CheckCircle,
  Tag,
  Users,
  MessageSquare,
  ArrowRight,
  Shield,
  Clock,
  DollarSign,
  Share2,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LiveSaleProgress } from '../common/LiveSaleProgress';
import { TrustRingAvatar } from '../common/TrustRingAvatar';
import { ASSET_IMAGES } from '../../assets/images';
import { CropListing, CropOffer } from '../../types';

export const MyCropsView: React.FC = () => {
  const {
    t,
    language,
    crops,
    addCropListing,
    offers,
    respondToOffer,
    currentUser,
  } = useApp();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedOfferForCounter, setSelectedOfferForCounter] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState<number>(32);
  const [offerFeedback, setOfferFeedback] = useState<{
    [offerId: string]: { type: 'success' | 'error'; message: string };
  }>({});

  const handleAcceptOffer = (offer: CropOffer, cropRemainingKg: number, isCropSoldOut: boolean) => {
    const offerUnit = offer.unit || 'Coconuts';
    if (isCropSoldOut || cropRemainingKg <= 0) {
      setOfferFeedback(prev => ({
        ...prev,
        [offer.id]: { type: 'error', message: `Crop is already SOLD OUT. 0 ${offerUnit} remaining.` },
      }));
      return;
    }

    if (offer.offeredQuantityKg > cropRemainingKg) {
      setOfferFeedback(prev => ({
        ...prev,
        [offer.id]: {
          type: 'error',
          message: `Only ${cropRemainingKg} ${offerUnit} is currently available.`,
        },
      }));
      return;
    }

    const res = respondToOffer(offer.id, 'accept');
    if (res) {
      setOfferFeedback(prev => ({
        ...prev,
        [offer.id]: { type: res.success ? 'success' : 'error', message: res.message },
      }));
      if (res.success) {
        setTimeout(() => {
          setOfferFeedback(prev => {
            const next = { ...prev };
            delete next[offer.id];
            return next;
          });
        }, 4000);
      }
    }
  };

  // Form states
  const [formCrop, setFormCrop] = useState('Coconut');
  const [formCropTa, setFormCropTa] = useState('தேங்காய்');
  const [variety, setVariety] = useState('Pollachi Tall Hybrid Grade 1');
  const [quantity, setQuantity] = useState(2000);
  const [pricePerKg, setPricePerKg] = useState(30);
  const [harvestDate, setHarvestDate] = useState('2026-10-08');
  const [qualityGrade, setQualityGrade] = useState<'Grade A - Premium' | 'Grade B - Standard' | 'Fair Average'>('Grade A - Premium');
  const [cultivationType, setCultivationType] = useState<'Natural / Organic' | 'Integrated Pest Management' | 'Conventional'>('Natural / Organic');
  const [desc, setDesc] = useState('Fresh farm-gate mature Pollachi coconuts, rich copra yield, sweet water, and thick kernel. Ready for farm gate pickup.');

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const cropUnit = formCrop === 'Coconut' ? 'Coconuts' : 'KG';
    addCropListing({
      cropName: formCrop,
      cropNameTa: formCropTa,
      variety,
      totalQuantityKg: quantity,
      pricePerKg,
      unit: cropUnit,
      harvestDate,
      qualityGrade,
      cultivationType,
      description: desc,
      imageUrl:
        formCrop === 'Paddy'
          ? ASSET_IMAGES.cropPaddyField
          : formCrop === 'Coconut'
          ? ASSET_IMAGES.cropCoconutHarvest
          : formCrop === 'Banana'
          ? 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80'
          : ASSET_IMAGES.cropTomatoHarvest,
    });
    setShowAddForm(false);
  };

  const myCrops = crops.filter(c => c.farmerId === currentUser.id);
  const activeLots = myCrops.filter(c => !c.isSoldOut && c.remainingQuantityKg > 0);
  const completedLots = myCrops.filter(c => c.isSoldOut || c.remainingQuantityKg === 0);

  // Offers received for my crops
  const myOffers = offers.filter(o => myCrops.some(c => c.id === o.cropListingId));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t.farmer.myCrops}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              {t.crops.freeSellingBanner}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage your harvest listings, review offers, and track live partial selling.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowGroupModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Users className="w-4 h-4 text-amber-700" />
            <span>Group Bulk Lot (Digital Pooling)</span>
          </button>

          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.farmer.sellCrop}</span>
          </button>
        </div>
      </div>

      {/* Group Selling Bulk Lot Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Digital Group Lot (Farmers Pooling Together)
                </h3>
              </div>
              <button
                onClick={() => setShowGroupModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Allows multiple neighboring farmers to combine individual yields into a single digital bulk lot to attract high-volume institutional and export buyers without requiring a physical collection centre.
            </p>

            {/* Pooled Lot Sample */}
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-950">Pollachi Coconut Bulk Lot #GRP-204</span>
                <span className="font-extrabold text-amber-900">Total: 2,000 Coconuts</span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-amber-100">
                  <span>Kumar Thangavel (You)</span>
                  <span className="font-bold">500 Coconuts</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-amber-100">
                  <span>Ravi Chandran</span>
                  <span className="font-bold">700 Coconuts</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-amber-100">
                  <span>Selvam Palanisamy</span>
                  <span className="font-bold">800 Coconuts</span>
                </div>
              </div>

              <div className="text-[11px] text-amber-800 font-medium">
                Target Bulk Price: ₹32 / Coconut · Individual farmers receive direct buyer settlement for their exact contributed lot.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowGroupModal(false)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Pooling Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Crop Listing Modal Form */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {t.crops.sellCropTitle}
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    {t.crops.cropName} (English)
                  </label>
                  <select
                    value={formCrop}
                    onChange={e => {
                      const selected = e.target.value;
                      const mapTa: Record<string, string> = {
                        Tomato: 'தக்காளி',
                        Paddy: 'நெல்',
                        Coconut: 'தேங்காய்',
                        Onion: 'சின்ன வெங்காயம்',
                        Turmeric: 'மஞ்சள்',
                        Maize: 'மக்காச்சோளம்',
                        Banana: 'வாழை',
                      };
                      const mapVariety: Record<string, string> = {
                        Tomato: 'Shivam Hybrid Grade 1',
                        Paddy: 'BPT 5204 Deluxe Ponni',
                        Coconut: 'Pollachi Tall Hybrid Grade 1',
                        Banana: 'Grand Naine Cavendish Grade 1',
                        Turmeric: 'Erode Salem Curcumin Grade 1',
                        Onion: 'Bellary / Small Red Grade 1',
                        Maize: 'Coimbatore Hybrid Grain',
                      };
                      const mapDesc: Record<string, string> = {
                        Tomato: 'Firm red tomatoes harvested early morning in wooden crates. Ideal for wholesale mandis.',
                        Paddy: 'Traditional Cauvery Delta Ponni paddy, grain moisture 13.5%, high head rice recovery.',
                        Coconut: 'Fresh farm-gate mature Pollachi coconuts, rich copra yield, sweet water, and thick kernel.',
                        Banana: 'Freshly harvested mature Grand Naine bananas from river basin groves. Uniform cluster bunch size, spotless peel, rich sweet pulp.',
                        Turmeric: 'High curcumin farm-cured turmeric fingers from Erode fertile belt.',
                        Onion: 'Pungent small red onions, well cured and dried, ideal for long storage.',
                        Maize: 'Quality yellow hybrid maize grain, moisture below 14%, rich starch content.',
                      };
                      setFormCrop(selected);
                      setFormCropTa(mapTa[selected] || selected);
                      if (mapVariety[selected]) setVariety(mapVariety[selected]);
                      if (mapDesc[selected]) setDesc(mapDesc[selected]);
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800"
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
                    {t.crops.variety}
                  </label>
                  <input
                    type="text"
                    value={variety}
                    onChange={e => setVariety(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-medium text-slate-800"
                    placeholder="e.g. Shivam Hybrid Grade 1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    {t.crops.quantityKg}
                  </label>
                  <input
                    type="number"
                    min={50}
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    {t.crops.pricePerKg}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={pricePerKg}
                    onChange={e => setPricePerKg(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    {t.crops.harvestDate}
                  </label>
                  <input
                    type="date"
                    value={harvestDate}
                    onChange={e => setHarvestDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-medium text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    {t.crops.qualityGrade}
                  </label>
                  <select
                    value={qualityGrade}
                    onChange={e => setQualityGrade(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800"
                  >
                    <option value="Grade A - Premium">Grade A - Premium</option>
                    <option value="Grade B - Standard">Grade B - Standard</option>
                    <option value="Fair Average">Fair Average Quality</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {t.crops.cultivationType}
                </label>
                <select
                  value={cultivationType}
                  onChange={e => setCultivationType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800"
                >
                  <option value="Natural / Organic">Natural / Organic</option>
                  <option value="Integrated Pest Management">Integrated Pest Management (IPM)</option>
                  <option value="Conventional">Conventional Field Practice</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {t.crops.description}
                </label>
                <textarea
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-medium text-slate-800"
                  required
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
                <strong>Zero Commission Guarantee:</strong> Farmer crop-sale commission = 0%. You keep 100% of agreed produce value.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
                >
                  {t.crops.publishListing}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Crop Listings with Live Sale Progress */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          {t.crops.activeListings} ({myCrops.length})
        </h3>

        <div className="space-y-6">
          {myCrops.map(crop => (
            <div
              key={crop.id}
              className="bg-white rounded-3xl border border-amber-900/10 shadow-xs overflow-hidden"
            >
              <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Crop Photo & Basic Info */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100">
                    <img
                      src={crop.imageUrl}
                      alt={crop.cropName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-slate-900 shadow">
                      ₹{crop.pricePerKg} / KG
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-slate-900">
                      {language === 'ta' ? crop.cropNameTa : crop.cropName}
                      <span className="text-xs font-semibold text-slate-500 ml-2">
                        {crop.variety}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">{crop.description}</p>

                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-600">
                      <span className="px-2 py-0.5 bg-slate-100 rounded">{crop.qualityGrade}</span>
                      <span className="px-2 py-0.5 bg-slate-100 rounded">{crop.cultivationType}</span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-semibold rounded">
                        Harvest: {crop.harvestDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Signature Live Sale Progress Bar & Controls */}
                <div className="lg:col-span-7 flex flex-col justify-center">
                  <LiveSaleProgress crop={crop} allowDirectSale={true} />
                </div>
              </div>

              {/* Connected Buyer Offers for this crop */}
              {myOffers.filter(o => o.cropListingId === crop.id).length > 0 && (
                <div className="p-5 bg-slate-50/80 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{t.crops.viewOffers}</span>
                    </h5>
                    <span className="text-[11px] text-slate-500">
                      Farmer decides. Never automatically accepted.
                    </span>
                  </div>

                  <div className="space-y-2">
                    {myOffers
                      .filter(o => o.cropListingId === crop.id)
                      .map(offer => {
                        const isCropSoldOut = crop.isSoldOut || crop.remainingQuantityKg <= 0;
                        return (
                          <div
                            key={offer.id}
                            className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-2 text-xs"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <TrustRingAvatar user={{ name: offer.buyerName }} trust={offer.buyerTrust} size="sm" />
                                <div>
                                  <div className="font-bold text-slate-900">{offer.buyerName}</div>
                                  <div className="text-[11px] text-slate-500">{offer.pickupTerms}</div>
                                  {offer.message && (
                                    <p className="text-[11px] text-slate-600 italic mt-0.5">
                                      &ldquo;{offer.message}&rdquo;
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <span className="text-sm font-bold text-emerald-800 block tabular-nums">
                                    ₹{offer.offeredPricePerKg} / {offer.unit === 'Coconuts' ? 'Coconut' : offer.unit || crop.unit || 'KG'}
                                  </span>
                                  <span className="text-[11px] text-slate-500 tabular-nums">
                                    Qty: {offer.offeredQuantityKg.toLocaleString('en-IN')} {offer.unit || crop.unit || 'KG'}
                                  </span>
                                </div>

                                {offer.status === 'pending' ? (
                                  <div className="flex items-center gap-1.5">
                                    {isCropSoldOut ? (
                                      <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[11px] font-semibold border border-slate-200">
                                        Sold Out (0 {crop.unit || 'KG'} Remaining)
                                      </span>
                                    ) : (
                                      <>
                                        <button
                                          onClick={() => handleAcceptOffer(offer, crop.remainingQuantityKg, isCropSoldOut)}
                                          className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                                        >
                                          {t.crops.acceptOffer}
                                        </button>
                                        <button
                                          onClick={() => {
                                            setSelectedOfferForCounter(offer.id);
                                            setCounterPrice(offer.offeredPricePerKg + 2);
                                          }}
                                          className="px-2.5 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                                        >
                                          {t.crops.counterOffer}
                                        </button>
                                        <button
                                          onClick={() => respondToOffer(offer.id, 'reject')}
                                          className="px-2.5 py-1.5 text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                        >
                                          {t.crops.rejectOffer}
                                        </button>
                                      </>
                                    )}
                                  </div>
                                ) : (
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                      offer.status === 'accepted'
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                        : offer.status === 'countered'
                                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                                    }`}
                                  >
                                    {offer.status}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Validation feedback & remaining quantity handler */}
                            {offerFeedback[offer.id] && (
                              <div
                                className={`p-2.5 rounded-lg text-xs flex flex-wrap items-center justify-between gap-2 ${
                                  offerFeedback[offer.id].type === 'success'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                                }`}
                              >
                                <div className="flex items-center gap-1.5">
                                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
                                  <span className="font-semibold">{offerFeedback[offer.id].message}</span>
                                </div>
                                {offerFeedback[offer.id].type === 'error' &&
                                  crop.remainingQuantityKg > 0 &&
                                  offer.offeredQuantityKg > crop.remainingQuantityKg && (
                                    <button
                                      onClick={() => {
                                        setSelectedOfferForCounter(offer.id);
                                        setCounterPrice(offer.offeredPricePerKg);
                                      }}
                                      className="px-2.5 py-1 bg-amber-800 hover:bg-amber-900 text-white text-[11px] font-bold rounded-lg cursor-pointer transition-colors"
                                    >
                                      Counter with {crop.remainingQuantityKg} {crop.unit || 'KG'} Available
                                    </button>
                                  )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>

                  {/* Counter Offer Box */}
                  {selectedOfferForCounter && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span>Propose Counter Price / KG:</span>
                        <input
                          type="number"
                          value={counterPrice}
                          onChange={e => setCounterPrice(Number(e.target.value))}
                          className="w-20 p-1.5 bg-white border border-slate-300 rounded font-bold text-slate-900"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOfferForCounter(null)}
                          className="text-slate-500 hover:text-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            respondToOffer(selectedOfferForCounter, 'counter', counterPrice);
                            setSelectedOfferForCounter(null);
                          }}
                          className="px-3 py-1 bg-amber-800 text-white rounded font-semibold"
                        >
                          Send Counter
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Completed & Sold Out Lots */}
      {completedLots.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            {t.crops.completedLots} ({completedLots.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedLots.map(crop => (
              <div
                key={crop.id}
                className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {language === 'ta' ? crop.cropNameTa : crop.cropName}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-200 text-emerald-950 font-bold rounded-full text-[10px]">
                      100% SOLD
                    </span>
                  </div>
                  <div className="text-slate-600 mt-0.5">
                    {crop.totalQuantityKg.toLocaleString('en-IN')} KG · ₹{crop.pricePerKg}/KG
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-slate-900 block tabular-nums">
                    ₹{(crop.totalQuantityKg * crop.pricePerKg).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-emerald-800 font-medium">Contracted</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
