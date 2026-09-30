import React, { useState } from 'react';
import {
  Bell,
  Globe,
  UserCheck,
  ChevronDown,
  Sparkles,
  LogOut,
  Settings,
  HelpCircle,
  Mic,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrustRingAvatar } from './TrustRingAvatar';
import { UserRole } from '../../types';

interface TopNavigationProps {
  onOpenAuthModal?: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({ onOpenAuthModal }) => {
  const {
    t,
    language,
    setLanguage,
    currentRole,
    switchRole,
    currentUser,
    activeTab,
    setActiveTab,
    notifications,
    markNotificationRead,
    setIsVoiceAssistantOpen,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.isRead);

  // Dynamic nav links tailored to current active role
  const getNavLinks = () => {
    switch (currentRole) {
      case 'farmer':
        return [
          { id: 'home', label: t.nav.home },
          { id: 'marketplace', label: t.nav.marketplaceFarmer },
          { id: 'calendar', label: t.nav.calendar },
          { id: 'myCrops', label: t.nav.myCrops },
          { id: 'services', label: t.nav.services },
          { id: 'orders', label: t.nav.orders },
        ];
      case 'buyer':
        return [
          { id: 'home', label: t.nav.home },
          { id: 'marketplace', label: t.nav.marketplace },
          { id: 'requirements', label: t.nav.requirements },
          { id: 'offers', label: t.nav.offers },
          { id: 'orders', label: t.nav.orders },
          { id: 'favFarmers', label: t.nav.favFarmers },
        ];
      case 'worker':
        return [
          { id: 'home', label: t.nav.home },
          { id: 'jobRequests', label: t.nav.jobRequests },
          { id: 'calendar', label: t.nav.calendar },
          { id: 'bookings', label: t.nav.bookings },
          { id: 'profile', label: t.nav.profile },
        ];
      case 'machinery':
        return [
          { id: 'home', label: t.nav.home },
          { id: 'myMachinery', label: t.nav.myMachinery },
          { id: 'bookingRequests', label: t.nav.bookingRequests },
          { id: 'calendar', label: t.nav.calendar },
          { id: 'profile', label: t.nav.profile },
        ];
      case 'logistics':
        return [
          { id: 'home', label: t.nav.home },
          { id: 'deliveryRequests', label: t.nav.deliveryRequests },
          { id: 'bookings', label: t.nav.bookings },
          { id: 'profile', label: t.nav.profile },
        ];
      case 'agri_input':
        return [
          { id: 'home', label: t.nav.home },
          { id: 'products', label: t.nav.products },
          { id: 'inventory', label: t.nav.inventory },
          { id: 'profile', label: t.nav.profile },
        ];
      case 'admin':
        return [
          { id: 'overview', label: t.nav.overview },
          { id: 'users', label: t.nav.users },
          { id: 'revenue', label: t.nav.revenue },
          { id: 'verification', label: t.nav.verification },
          { id: 'issues', label: t.nav.issues },
          { id: 'rewards', label: t.nav.rewards },
        ];
      default:
        return [{ id: 'home', label: t.nav.home }];
    }
  };

  const roleLabels: Record<UserRole, string> = {
    farmer: t.roles.farmer,
    buyer: t.roles.buyer,
    worker: t.roles.worker,
    machinery: t.roles.machinery,
    logistics: t.roles.logistics,
    agri_input: t.roles.agri_input,
    admin: t.roles.admin,
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-amber-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single Text Element Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-amber-200 font-bold text-lg shadow-sm border border-emerald-700/50">
              உ
            </div>
            <span className="text-xl font-bold tracking-tight text-emerald-950 group-hover:text-emerald-800 transition-colors">
              {t.appName}
            </span>
          </button>

          {/* Quiet prototype label */}
          <span className="hidden sm:inline text-[11px] font-semibold tracking-wider text-amber-800/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            {t.demoBadge}
          </span>
        </div>

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
          {getNavLinks().map(link => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`py-1 relative transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-emerald-900 font-bold'
                    : 'text-slate-600 hover:text-emerald-800'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (Voice Assistant, Language switch, Notifications, Role Switcher / Profile) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Voice Assistant Trigger Button */}
          <button
            onClick={() => setIsVoiceAssistantOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-xs font-bold text-amber-950 transition-colors cursor-pointer shadow-2xs"
            title="Uzhavan Voice Assistant / குரல் உதவி"
          >
            <Mic className="w-3.5 h-3.5 text-amber-800 animate-pulse" />
            <span>{language === 'ta' ? 'குரல் உதவி' : 'Voice Assistant'}</span>
          </button>

          {/* Bilingual Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
            title="Toggle Language / மொழி மாற்றம்"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.languageName}</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowRoleMenu(false);
              }}
              className="relative p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {/* Notifications Menu */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    {unreadNotifs.length} new
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                  {notifications.slice(0, 5).map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.linkTab) setActiveTab(n.linkTab);
                        setShowNotifMenu(false);
                      }}
                      className={`p-3 text-left hover:bg-slate-50 cursor-pointer transition-colors ${
                        !n.isRead ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">
                          {language === 'ta' ? n.titleTa : n.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {language === 'ta' ? n.messageTa : n.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher & Profile Avatar with Trust Ring */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowNotifMenu(false);
              }}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <TrustRingAvatar user={currentUser} size="sm" interactive={false} />
              <div className="hidden sm:block text-left text-xs leading-tight">
                <div className="font-semibold text-slate-900 truncate max-w-[100px]">
                  {currentUser.name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-emerald-800 font-medium">
                  {roleLabels[currentRole]}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Role switch popover */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {currentUser.district} · {roleLabels[currentRole]}
                  </div>
                </div>

                <div className="py-2">
                  <div className="px-3 pb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Prototype Role
                  </div>
                  {(['farmer', 'buyer', 'worker', 'machinery', 'logistics', 'agri_input', 'admin'] as UserRole[]).map(
                    r => (
                      <button
                        key={r}
                        onClick={() => {
                          switchRole(r);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                          currentRole === r
                            ? 'bg-emerald-50 text-emerald-900 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{roleLabels[r]}</span>
                        {currentRole === r && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        )}
                      </button>
                    )
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{t.nav.profile}</span>
                  </button>
                  {onOpenAuthModal && (
                    <button
                      onClick={() => {
                        onOpenAuthModal();
                        setShowRoleMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{t.login} / Register</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
