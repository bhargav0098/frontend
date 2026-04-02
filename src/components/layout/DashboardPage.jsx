import React from 'react';
import SummaryCards from '../layout/SummaryCards';
import BalanceTrendChart from '../charts/BalanceTrendChart';
import SpendingBreakdownChart from '../charts/SpendingBreakdownChart';
import RecentTransactions from '../layout/RecentTransactions';

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <SummaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <BalanceTrendChart />
        </div>
        <div className="lg:col-span-2">
          <SpendingBreakdownChart />
        </div>
      </div>
      <RecentTransactions />
    </div>
  );
}
