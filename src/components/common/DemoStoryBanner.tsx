import React, { useState } from 'react';
import { Play, RotateCcw, ChevronRight, CheckCircle2, Sparkles, MapPin, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DemoStoryBanner: React.FC = () => {
  const {
    currentRole,
    switchRole,
    activeTab,
    setActiveTab,
    runDemoStory,
    resetToDefaults,
    t,
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(false);

  const demoSteps = [
    {
      step: 1,
      role: 'farmer' as const,
      tab: 'weather',
      title: '1. Farm Weather',
      desc: 'Check Pollachi rain probability (DEMO WEATHER).',
    },
    {
      step: 2,
      role: 'farmer' as const,
      tab: 'calendar',
      title: '2. Harvest Calendar',
      desc: 'Create 2,000 Coconut Harvest Plan & review weather alerts.',
    },
    {
      step: 3,
      role: 'farmer' as const,
      tab: 'services',
      title: '3. Pre-book Fleet & Workers',
      desc: 'Book Tractor and Marimuthu 6-Worker Team.',
    },
    {
      step: 4,
      role: 'farmer' as const,
      tab: 'myCrops',
      title: '4. Live Crop Sales',
      desc: 'Watch 2,000 Coconuts -> 1,200 -> 500 -> 0 Coconuts (SOLD OUT!).',
    },
    {
      step: 5,
      role: 'buyer' as const,
      tab: 'marketplace',
      title: '5. Buyer Discovery',
      desc: 'Murugan Mandi / Annapoorna send offers & requirements.',
    },
    {
      step: 6,
      role: 'farmer' as const,
      tab: 'orders',
      title: '6. Direct Settlement',
      desc: 'Verify buyer direct UPI/Bank payment & view transaction record.',
    },
    {
      step: 7,
      role: 'admin' as const,
      tab: 'revenue',
      title: '7. Admin Revenue',
      desc: 'Verify 2% Buyer fee, 0% Farmer crop fee, 0% Agri fee.',
    },
  ];

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-amber-950 text-white border-b border-amber-500/20 text-xs">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Indicator & Quick Trigger */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold uppercase tracking-wider text-[10px]">
            HACKATHON DEMO STORY
          </span>
          <span className="text-amber-200/90 font-medium hidden sm:inline">
            Farmer Kumar’s 2,000 Coconut Harvest Journey (Weather → Machinery → Workers → Partial Sales → Settlement)
          </span>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2">
          {/* 1-Click Interactive Demo */}
          <button
            onClick={runDemoStory}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            title="Auto-simulates 3 buyer sales down to 0 Coconuts and triggers SOLD OUT celebration"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>Simulate Live Sales (SOLD OUT!)</span>
          </button>

          {/* Toggle Guided Steps */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1 rounded-lg bg-emerald-700/60 hover:bg-emerald-700 text-emerald-100 font-medium transition-colors cursor-pointer"
          >
            {isExpanded ? 'Hide Steps' : 'Guided Steps (1–7)'}
          </button>

          {/* Reset State */}
          <button
            onClick={resetToDefaults}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Reset to default seed state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Guided Steps Drawer */}
      {isExpanded && (
        <div className="border-t border-white/10 bg-black/25 px-4 py-3 animate-in fade-in duration-150">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {demoSteps.map(step => (
                <button
                  key={step.step}
                  onClick={() => {
                    switchRole(step.role);
                    setActiveTab(step.tab);
                  }}
                  className="text-left p-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 transition-all cursor-pointer group"
                >
                  <div className="font-bold text-amber-300 text-[11px] group-hover:text-amber-200 truncate">
                    {step.title}
                  </div>
                  <div className="text-[10px] text-emerald-100/70 line-clamp-2 mt-0.5 leading-snug">
                    {step.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
