import React from 'react';
import {
  Heart,
  MapPin,
  ShoppingBag,
  ShieldCheck,
  Phone,
  Layers,
  Star,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrustRingAvatar } from '../common/TrustRingAvatar';
import { SEED_FARMERS } from '../../data/seedData';

export const FavouriteFarmersView: React.FC = () => {
  const {
    favourites,
    toggleFavourite,
    crops,
    setActiveTab,
    language,
  } = useApp();

  // Combine seeded farmers with farmers who have crops
  const allKnownFarmers = SEED_FARMERS;

  // Filter to favorited farmers
  const favFarmers = allKnownFarmers.filter(f =>
    favourites.farmers.includes(f.id)
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Favourite & Regular Farmers
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Your saved producer network for direct repeat sourcing and reliable harvest contracts across Tamil Nadu.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('marketplace')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Discover More Farmers in Market</span>
        </button>
      </div>

      {/* Direct Partnership Benefit Banner */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>
            <strong>Direct Sourcing Agreement:</strong> Regular trade with trusted farmers ensures consistent produce quality, zero broker markups, and verified land records.
          </span>
        </div>
        <span className="text-emerald-800 font-bold shrink-0">
          {favFarmers.length} Saved Producer{favFarmers.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Empty State */}
      {favFarmers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4">
          <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
            <Heart className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">
              No Favourite Farmers Saved Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Click the heart icon on any farmer card in the Crop Marketplace to save them here for quick re-orders and direct harvest updates.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                // Add first 2 farmers as demo
                toggleFavourite('farmers', 'user_farmer_kumar');
                toggleFavourite('farmers', 'user_farmer_selvam');
              }}
              className="px-4 py-2 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              + Quick-Add Top Verified Farmers (Demo)
            </button>
          </div>
        </div>
      ) : (
        /* Farmer Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favFarmers.map(farmer => {
            const activeFarmerCrops = crops.filter(
              c => c.farmerId === farmer.id && !c.isSoldOut && c.remainingQuantityKg > 0
            );

            return (
              <div
                key={farmer.id}
                className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition-shadow space-y-4"
              >
                <div className="space-y-4">
                  {/* Top Farmer Identity + Remove Button */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <TrustRingAvatar user={{ name: farmer.name }} trust={farmer.trust} size="lg" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{farmer.name}</h4>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-emerald-700" />
                          <span>
                            {farmer.village ? `${farmer.village}, ` : ''}{farmer.taluk ? `${farmer.taluk}, ` : ''}{farmer.district}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mt-1 inline-block">
                          {farmer.trust.title}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFavourite('farmers', farmer.id)}
                      className="p-2 rounded-full hover:bg-rose-50 text-rose-500 transition-colors cursor-pointer"
                      title="Remove from Favourites"
                    >
                      <Heart className="w-5 h-5 fill-rose-500" />
                    </button>
                  </div>

                  {/* Farm Details */}
                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Farm Holdings</span>
                      <span className="font-semibold text-slate-800">{farmer.farmSize || '5 Acres'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Irrigation</span>
                      <span className="font-semibold text-slate-800">{farmer.irrigationType || 'Canal & Borewell'}</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-200/60">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Main Produce</span>
                      <span className="font-semibold text-emerald-900">
                        {farmer.mainCrops?.join(', ') || 'Coconut, Paddy, Tomato'}
                      </span>
                    </div>
                  </div>

                  {/* Active Produce on Sale */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Active Produce Lots ({activeFarmerCrops.length})
                    </span>

                    {activeFarmerCrops.length > 0 ? (
                      <div className="space-y-1.5">
                        {activeFarmerCrops.map(crop => {
                          const isCoconut = crop.cropName.toLowerCase().includes('coconut') || crop.unit === 'Coconuts';
                          const unitSingular = isCoconut ? 'Coconut' : (crop.unit === 'Pieces' ? 'Piece' : 'KG');
                          const unitPlural = isCoconut ? 'Coconuts' : (crop.unit || 'KG');

                          return (
                            <div
                              key={crop.id}
                              className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-bold text-slate-900">
                                  {language === 'ta' && crop.cropNameTa ? crop.cropNameTa : crop.cropName}
                                </span>
                                <span className="text-[11px] text-slate-500 ml-1">
                                  ({crop.remainingQuantityKg.toLocaleString('en-IN')} {unitPlural})
                                </span>
                              </div>
                              <span className="font-bold text-emerald-800 tabular-nums">
                                ₹{crop.pricePerKg} / {unitSingular}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-xl text-center text-[11px] text-slate-400 italic">
                        No active harvest listed today. Upcoming harvest expected soon.
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setActiveTab('marketplace')}
                    className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Browse All Producer Lots</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
