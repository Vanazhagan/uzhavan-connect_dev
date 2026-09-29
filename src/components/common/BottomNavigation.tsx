import React from 'react';
import {
  Home,
  ShoppingBag,
  Calendar,
  Layers,
  Wrench,
  CreditCard,
  User,
  Truck,
  FileText,
  BarChart3,
  Users,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNavigation: React.FC = () => {
  const { currentRole, activeTab, setActiveTab, t } = useApp();

  // Get 4-5 primary tabs for bottom thumb zone
  const getTabs = () => {
    switch (currentRole) {
      case 'farmer':
        return [
          { id: 'home', label: t.nav.home, icon: Home },
          { id: 'marketplace', label: t.nav.marketplaceFarmer, icon: ShoppingBag },
          { id: 'calendar', label: t.nav.calendar, icon: Calendar },
          { id: 'myCrops', label: t.nav.myCrops, icon: Layers },
          { id: 'services', label: t.nav.services, icon: Wrench },
        ];
      case 'buyer':
        return [
          { id: 'home', label: t.nav.home, icon: Home },
          { id: 'marketplace', label: t.nav.marketplace, icon: ShoppingBag },
          { id: 'offers', label: t.nav.offers, icon: Clock },
          { id: 'orders', label: t.nav.orders, icon: CreditCard },
          { id: 'requirements', label: t.nav.requirements, icon: FileText },
        ];
      case 'worker':
        return [
          { id: 'home', label: t.nav.home, icon: Home },
          { id: 'jobRequests', label: t.nav.jobRequests, icon: FileText },
          { id: 'calendar', label: t.nav.calendar, icon: Calendar },
          { id: 'bookings', label: t.nav.bookings, icon: Users },
          { id: 'profile', label: t.nav.profile, icon: User },
        ];
      case 'machinery':
        return [
          { id: 'home', label: t.nav.home, icon: Home },
          { id: 'myMachinery', label: t.nav.myMachinery, icon: Wrench },
          { id: 'calendar', label: t.nav.calendar, icon: Calendar },
          { id: 'bookingRequests', label: t.nav.bookingRequests, icon: Layers },
          { id: 'profile', label: t.nav.profile, icon: User },
        ];
      case 'logistics':
        return [
          { id: 'home', label: t.nav.home, icon: Home },
          { id: 'deliveryRequests', label: t.nav.deliveryRequests, icon: Truck },
          { id: 'bookings', label: t.nav.bookings, icon: Layers },
          { id: 'profile', label: t.nav.profile, icon: User },
        ];
      case 'agri_input':
        return [
          { id: 'home', label: t.nav.home, icon: Home },
          { id: 'products', label: t.nav.products, icon: ShoppingBag },
          { id: 'inventory', label: t.nav.inventory, icon: Layers },
          { id: 'profile', label: t.nav.profile, icon: User },
        ];
      case 'admin':
        return [
          { id: 'overview', label: t.nav.overview, icon: Home },
          { id: 'revenue', label: t.nav.revenue, icon: BarChart3 },
          { id: 'users', label: t.nav.users, icon: Users },
          { id: 'verification', label: t.nav.verification, icon: Layers },
          { id: 'issues', label: t.nav.issues, icon: FileText },
        ];
      default:
        return [{ id: 'home', label: t.nav.home, icon: Home }];
    }
  };

  const tabs = getTabs();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-amber-900/10 pb-safe shadow-lg">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors cursor-pointer ${
                isActive
                  ? 'text-emerald-900 font-bold'
                  : 'text-slate-500 hover:text-emerald-800'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-600" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 truncate max-w-[64px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
