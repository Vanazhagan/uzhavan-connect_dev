import React, { useState } from 'react';
import { Users, Wrench, ShoppingBag, Truck, CloudSun } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WorkerMarketplace } from './WorkerMarketplace';
import { MachineryMarketplace } from './MachineryMarketplace';
import { AgriInputMarketplace } from './AgriInputMarketplace';
import { LogisticsView } from './LogisticsView';
import { FarmWeatherView } from '../farmer/FarmWeatherView';

export const ServicesHub: React.FC = () => {
  const { t } = useApp();
  const [subTab, setSubTab] = useState<'workers' | 'machinery' | 'agriInputs' | 'logistics' | 'weather'>('workers');

  const subTabs = [
    { id: 'workers', label: t.nav.workers, icon: Users },
    { id: 'machinery', label: t.nav.machinery, icon: Wrench },
    { id: 'agriInputs', label: t.nav.agriInputs, icon: ShoppingBag },
    { id: 'logistics', label: t.nav.logistics, icon: Truck },
    { id: 'weather', label: t.nav.weather, icon: CloudSun },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Sub-navigation tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-amber-900/10">
        {subTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                isActive
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Subtab content */}
      <div>
        {subTab === 'workers' && <WorkerMarketplace />}
        {subTab === 'machinery' && <MachineryMarketplace />}
        {subTab === 'agriInputs' && <AgriInputMarketplace />}
        {subTab === 'logistics' && <LogisticsView />}
        {subTab === 'weather' && <FarmWeatherView />}
      </div>
    </div>
  );
};
