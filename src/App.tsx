import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopNavigation } from './components/common/TopNavigation';
import { BottomNavigation } from './components/common/BottomNavigation';
import { DemoStoryBanner } from './components/common/DemoStoryBanner';
import { WhyTrustRingModal } from './components/common/WhyTrustRingModal';
import { GuardianAI } from './components/common/GuardianAI';
import { VoiceAssistantModal } from './components/common/VoiceAssistantModal';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/landing/LandingPage';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { FarmWeatherView } from './components/farmer/FarmWeatherView';
import { FarmCalendarView } from './components/farmer/FarmCalendarView';
import { MyCropsView } from './components/farmer/MyCropsView';
import { CropMarketplace } from './components/marketplace/CropMarketplace';
import { MarketOpportunitiesView } from './components/marketplace/MarketOpportunitiesView';
import { BuyerRequirementsView } from './components/marketplace/BuyerRequirementsView';
import { BuyerOffersView } from './components/marketplace/BuyerOffersView';
import { BuyerDashboard } from './components/marketplace/BuyerDashboard';
import { FavouriteFarmersView } from './components/marketplace/FavouriteFarmersView';
import { ServicesHub } from './components/services/ServicesHub';
import { WorkerMarketplace } from './components/services/WorkerMarketplace';
import { WorkerDashboard } from './components/worker/WorkerDashboard';
import { WorkerJobRequestsView } from './components/worker/WorkerJobRequestsView';
import { WorkerBookingsView } from './components/worker/WorkerBookingsView';
import { MachineryMarketplace } from './components/services/MachineryMarketplace';
import { MachineryProviderDashboard } from './components/machinery/MachineryProviderDashboard';
import { MachineryFleetView } from './components/machinery/MachineryFleetView';
import { MachineryBookingRequestsView } from './components/machinery/MachineryBookingRequestsView';
import { AgriInputMarketplace } from './components/services/AgriInputMarketplace';
import { LogisticsView } from './components/services/LogisticsView';
import { LogisticsDashboard } from './components/logistics/LogisticsDashboard';
import { LogisticsDeliveriesView } from './components/logistics/LogisticsDeliveriesView';
import { LogisticsBookingRequestsView } from './components/logistics/LogisticsBookingRequestsView';
import { LogisticsProfileView } from './components/logistics/LogisticsProfileView';
import { OrdersAndSettlementView } from './components/orders/OrdersAndSettlementView';
import { UzhavanRewardsView } from './components/rewards/UzhavanRewardsView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserProfileView } from './components/profile/UserProfileView';

const MainAppContent: React.FC = () => {
  const {
    currentRole,
    activeTab,
    setActiveTab,
    t,
    isVoiceAssistantOpen,
    setIsVoiceAssistantOpen,
    setVoicePreFill,
    setVoiceTranscriptForGuardian,
  } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLandingView, setShowLandingView] = useState(false);

  // Render view by active tab & role
  const renderCurrentView = () => {
    if (showLandingView) {
      return (
        <LandingPage
          onGetStarted={() => {
            setShowLandingView(false);
            setActiveTab('home');
          }}
          onOpenLogin={() => setShowAuthModal(true)}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        if (currentRole === 'farmer') return <FarmerDashboard />;
        if (currentRole === 'buyer') return <BuyerDashboard />;
        if (currentRole === 'worker') return <WorkerDashboard />;
        if (currentRole === 'machinery') return <MachineryProviderDashboard />;
        if (currentRole === 'logistics') return <LogisticsDashboard />;
        if (currentRole === 'agri_input') return <AgriInputMarketplace />;
        if (currentRole === 'admin') return <AdminDashboard />;
        return <FarmerDashboard />;

      case 'marketplace':
        if (currentRole === 'farmer') return <MarketOpportunitiesView />;
        return <CropMarketplace />;

      case 'favFarmers':
        return <FavouriteFarmersView />;

      case 'calendar':
        return <FarmCalendarView />;

      case 'weather':
        return <FarmWeatherView />;

      case 'myCrops':
        return <MyCropsView />;

      case 'requirements':
        if (currentRole === 'worker') return <WorkerJobRequestsView />;
        return <BuyerRequirementsView />;

      case 'jobRequests':
        if (currentRole === 'worker') return <WorkerJobRequestsView />;
        return <BuyerRequirementsView />;

      case 'services':
        return <ServicesHub />;

      case 'workers':
        return <WorkerMarketplace />;

      case 'machinery':
      case 'myMachinery':
        if (currentRole === 'machinery') return <MachineryFleetView />;
        return <MachineryMarketplace />;

      case 'agriInputs':
      case 'products':
      case 'inventory':
        return <AgriInputMarketplace />;

      case 'logistics':
      case 'deliveryRequests':
        if (currentRole === 'logistics') return <LogisticsDeliveriesView />;
        return <LogisticsView />;

      case 'offers':
        return <BuyerOffersView />;

      case 'orders':
        if (currentRole === 'worker') return <WorkerBookingsView />;
        return <OrdersAndSettlementView />;

      case 'bookings':
      case 'bookingRequests':
        if (currentRole === 'machinery') return <MachineryBookingRequestsView />;
        if (currentRole === 'worker') return <WorkerBookingsView />;
        if (currentRole === 'logistics') return <LogisticsBookingRequestsView />;
        return <OrdersAndSettlementView />;

      case 'rewards':
        return <UzhavanRewardsView />;

      case 'profile':
        if (currentRole === 'logistics') return <LogisticsProfileView />;
        return <UserProfileView />;

      case 'overview':
      case 'revenue':
      case 'users':
      case 'verification':
      case 'issues':
        return <AdminDashboard />;

      default:
        return <FarmerDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F4] text-[#1E2922]">
      {/* Demo Walkthrough Story Banner */}
      <DemoStoryBanner />

      {/* Top Bar Contract (Wordmark, Links, Actions) */}
      <TopNavigation onOpenAuthModal={() => setShowAuthModal(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Landing Page Toggle for evaluators */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLandingView(!showLandingView)}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 underline underline-offset-2 cursor-pointer"
            >
              {showLandingView ? '← Back to Active App Dashboard' : 'View Public Landing Page'}
            </button>
          </div>
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            Active User: <strong className="text-slate-800">{currentRole.toUpperCase()}</strong>
          </span>
        </div>

        {renderCurrentView()}
      </main>

      {/* Thumb-Zone Bottom Navigation for Mobile */}
      <BottomNavigation />

      {/* Signature "Why this ring?" Modal */}
      <WhyTrustRingModal />

      {/* Guardian AI Safety & App Assistant Drawer */}
      <GuardianAI />

      {/* Uzhavan Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        onConfirmPreFill={interpretation => {
          setVoicePreFill(interpretation);
        }}
        onAskGuardian={transcript => {
          setVoiceTranscriptForGuardian(transcript);
        }}
      />

      {/* Authentication & Role Registration Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Footer */}
      <footer className="mt-auto border-t border-amber-900/10 bg-[#FAF8F5] py-6 text-xs text-slate-500 text-center pb-20 lg:pb-6">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <div className="font-semibold text-slate-700">
            {t.appName} — {t.tagline}
          </div>
          <div className="text-[11px] text-slate-400">
            Tamil Nadu Digital Agriculture Ecosystem · 0% Commission for Farmers · Direct Direct Settlement
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
