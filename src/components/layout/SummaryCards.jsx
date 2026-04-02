import React from 'react';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, cn } from '../../utils/helpers';

function StatCard({ label, amount, icon: Icon, color, trend, trendLabel, delay = 0 }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-5 border transition-all duration-300',
        'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600/70',
        'hover:shadow-md dark:hover:shadow-lg hover:-translate-y-0.5 cursor-default shadow-sm dark:shadow-none',
        'animate-fade-up'
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background glow */}
      <div className={cn('absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 dark:opacity-20', color)} />

      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-2.5 rounded-xl', color.replace('-500', '-500/10'))}>
          <Icon size={18} className={color.replace('bg-', 'text-')} />
        </div>
        {trend !== undefined && (
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg',
            trend >= 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
          )}>
            {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{label}</p>
      <p className={cn('text-2xl font-bold font-mono tracking-tight', color.replace('bg-', 'text-'))}>
        {formatCurrency(amount)}
      </p>
      {trendLabel && (
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-1.5">{trendLabel}</p>
      )}
    </div>
  );
}

export default function SummaryCards() {
  const { getSummary, getMonthlyData } = useFinance();
  const { income, expense, balance } = getSummary();
  const monthly = getMonthlyData();

  const lastMonth = monthly[monthly.length - 1];
  const prevMonth = monthly[monthly.length - 2];

  const expenseTrend = prevMonth && prevMonth.expense > 0
    ? +((lastMonth.expense - prevMonth.expense) / prevMonth.expense * 100).toFixed(1)
    : null;

  const incomeTrend = prevMonth && prevMonth.income > 0
    ? +((lastMonth.income - prevMonth.income) / prevMonth.income * 100).toFixed(1)
    : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Total Balance"
        amount={balance}
        icon={Wallet}
        color="bg-cyan-500"
        trendLabel="Net savings to date"
        delay={0}
      />
      <StatCard
        label="Total Income"
        amount={income}
        icon={TrendingUp}
        color="bg-emerald-500"
        trend={incomeTrend}
        trendLabel={lastMonth ? `Last month: ${formatCurrency(lastMonth.income, true)}` : undefined}
        delay={80}
      />
      <StatCard
        label="Total Expenses"
        amount={expense}
        icon={TrendingDown}
        color="bg-red-500"
        trend={expenseTrend}
        trendLabel={lastMonth ? `Last month: ${formatCurrency(lastMonth.expense, true)}` : undefined}
        delay={160}
      />
    </div>
  );
}
