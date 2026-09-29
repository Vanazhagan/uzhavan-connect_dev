import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Search, Store, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MarketPriceItem } from '../../types';

interface MarketPricesWidgetProps {
  role?: 'farmer' | 'buyer' | 'general';
  defaultCropNames?: string[];
  title?: string;
  subtitle?: string;
}

export const MarketPricesWidget: React.FC<MarketPricesWidgetProps> = ({
  role = 'general',
  defaultCropNames,
  title,
  subtitle,
}) => {
  const { marketPrices, crops, currentUser, language } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCrops, setShowAllCrops] = useState(false);

  // If farmer, prioritize their active crops
  const farmerActiveCrops =
    role === 'farmer' || currentUser.role === 'farmer'
      ? crops
          .filter(c => c.farmerId === currentUser.id && c.remainingQuantityKg > 0)
          .map(c => c.cropName.toLowerCase())
      : [];

  const priorityCropNames = defaultCropNames?.map(n => n.toLowerCase()) || (farmerActiveCrops.length > 0 ? farmerActiveCrops : ['coconut', 'paddy', 'groundnut']);

  const filteredPrices = marketPrices.filter(item => {
    const matchesSearch =
      item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cropNameTa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    if (searchQuery.trim().length > 0) {
      return matchesSearch;
    }

    if (showAllCrops) {
      return true;
    }

    // Default view prioritizes relevant crops
    return priorityCropNames.includes(item.cropName.toLowerCase());
  });

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return (
          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            + Trend
          </span>
        );
      case 'down':
        return (
          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-800 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
            <TrendingDown className="w-3 h-3 text-rose-600" />
            - Trend
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            <Minus className="w-3 h-3 text-slate-500" />
            Stable
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-800" />
            <h3 className="text-base font-bold text-slate-900">
              {title || (role === 'farmer' ? 'Mandi Reference Rates for Your Crops' : 'Commercial Market Reference Rates')}
            </h3>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
              Demo Reference
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            {subtitle || 'Indicative wholesale mandi price benchmarks across Tamil Nadu agricultural trading centres'}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search crop or mandi..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
        </div>
      </div>

      {/* Grid of Price Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredPrices.map(item => {
          const isCoconut = item.cropName.toLowerCase().includes('coconut') || item.unit.toLowerCase().includes('coconut');
          const unitLabel = isCoconut ? 'Coconut' : item.unit;

          return (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-slate-50/70 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-200 transition-colors flex flex-col justify-between space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {language === 'ta' && item.cropNameTa ? item.cropNameTa : item.cropName}
                  </h4>
                  <span className="text-[11px] text-slate-600 font-medium block">
                    {item.marketName}
                  </span>
                  <span className="text-[10px] text-slate-600 block">{item.location}</span>
                </div>
                {getTrendIcon(item.priceTrend)}
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-600 block">Benchmark Rate</span>
                  <span className="text-lg font-extrabold text-emerald-800 tabular-nums">
                    ₹{item.referencePrice}
                    <span className="text-xs font-semibold text-slate-600 ml-1">/ {unitLabel}</span>
                  </span>
                </div>
                <span className="text-[10px] text-slate-600">{item.lastUpdated}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer controls: Show All / Collapse */}
      {searchQuery.trim().length === 0 && marketPrices.length > priorityCropNames.length && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            Showing prioritized crops. Reference only; actual contract price agreed directly between farmer and buyer.
          </span>
          <button
            onClick={() => setShowAllCrops(!showAllCrops)}
            className="text-emerald-800 hover:text-emerald-900 font-bold underline cursor-pointer whitespace-nowrap ml-2"
          >
            {showAllCrops ? 'Show Prioritized Crops Only' : `View All ${marketPrices.length} Crops`}
          </button>
        </div>
      )}
    </div>
  );
};
