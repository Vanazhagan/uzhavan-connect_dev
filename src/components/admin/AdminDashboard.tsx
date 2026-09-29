import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminOverview } from './AdminOverview';
import { AdminUsersView } from './AdminUsersView';
import { AdminRevenueAnalytics } from './AdminRevenueAnalytics';
import { AdminVerificationView } from './AdminVerificationView';
import { AdminDisputesView } from './AdminDisputesView';
import { AdminRewardsView } from './AdminRewardsView';

export const AdminDashboard: React.FC = () => {
  const { activeTab } = useApp();

  switch (activeTab) {
    case 'overview':
      return <AdminOverview />;
    case 'users':
      return <AdminUsersView />;
    case 'revenue':
      return <AdminRevenueAnalytics />;
    case 'verification':
      return <AdminVerificationView />;
    case 'issues':
      return <AdminDisputesView />;
    case 'rewards':
      return <AdminRewardsView />;
    default:
      return <AdminOverview />;
  }
};

