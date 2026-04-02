import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  TrendingUp, TrendingDown, Flame, PiggyBank,
  Zap, Calendar, Target, Activity
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { getCategoryBreakdown } from '../../context/FinanceContext';
import { formatCurrency, cn } from '../../utils/helpers';
import { CATEGORY_COLORS } from '../../data/mockData';

function InsightCard({ icon: Icon, title, value, subtitle, color, delay = 0 }) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 animate-fade-up',
        'hover:border-slate-300 dark:hover:border-slate-600/70 transition-all duration-300 hover:-translate-y-0.5 shadow-sm dark:shadow-none'
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color.replace('-500', '-500/10')}`}>
        <Icon size={17} className={color.replace('bg-', 'text-')} />
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">{title}</p>
      <p className="text-slate-900 dark:text-white text-xl font-bold font-mono leading-tight">{value}</p>
      {subtitle && <p className="text-slate-400 dark:text-slate-500 text-xs mt-1.5">{subtitle}</p>}
    </div>
  );
}

const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600/50 rounded-xl p-3 shadow-xl text-sm">
      <p className="text-slate-900 dark:text-slate-300 font-semibold mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.fill }} className="flex justify-between gap-4">
          <span className="capitalize">{p.name}:</span>
          <span className="font-mono">{formatCurrency(p.value, true)}</span>
        </p>
      ))}
    </div>
  );
};

export default function InsightsPage() {
  const { state, getInsights, getCategoryBreakdown, getMonthlyData, getSummary } = useFinance();
  const insights = getInsights();
  const catBreakdown = getCategoryBreakdown();
  const monthly = getMonthlyData();
  const { income, expense } = getSummary();
  const isDark = state.darkMode;

  const savingsRate = income > 0 ? (((income - expense) / income) * 100).toFixed(1) : 0;
  const avgSaving = monthly.length > 0
    ? Math.round(monthly.reduce((s, m) => s + (m.income - m.expense), 0) / monthly.length)
    : 0;

  const lastTwo = monthly.slice(-2);
  const expenseChange = lastTwo.length === 2 && lastTwo[0].expense > 0
    ? +((lastTwo[1].expense - lastTwo[0].expense) / lastTwo[0].expense * 100).toFixed(1)
    : 0;

  const top3cats = catBreakdown.slice(0, 3);
  const totalExpense = catBreakdown.reduce((s, c) => s + c.value, 0);

  return (
    <div className="space-y-6 animate-fade-up">

      {/* Summary insight cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard
          icon={Flame}
          title="Top Spending Category"
          value={insights.topCategory?.name || '—'}
          subtitle={insights.topCategory ? formatCurrency(insights.topCategory.value, true) + ' total' : 'No data'}
          color="bg-orange-500"
          delay={0}
        />
        <InsightCard
          icon={PiggyBank}
          title="Savings Rate"
          value={`${savingsRate}%`}
          subtitle="of total income saved"
          color="bg-emerald-500"
          delay={80}
        />
        <InsightCard
          icon={expenseChange >= 0 ? TrendingUp : TrendingDown}
          title="Monthly Expense Change"
          value={`${expenseChange >= 0 ? '+' : ''}${expenseChange}%`}
          subtitle={lastTwo.length === 2 ? `${lastTwo[0].month} → ${lastTwo[1].month}` : 'Not enough data'}
          color={expenseChange > 5 ? 'bg-red-500' : 'bg-cyan-500'}
          delay={160}
        />
        <InsightCard
          icon={Target}
          title="Avg Monthly Savings"
          value={formatCurrency(avgSaving, true)}
          subtitle="across all months"
          color="bg-purple-500"
          delay={240}
        />
      </div>

      {/* Additional insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InsightCard
          icon={Activity}
          title="Total Transactions"
          value={insights.totalTransactions}
          subtitle="recorded entries"
          color="bg-blue-500"
          delay={320}
        />
        <InsightCard
          icon={Zap}
          title="Income Streams"
          value={insights.incomeStreams}
          subtitle="active categories"
          color="bg-yellow-500"
          delay={380}
        />
        <InsightCard
          icon={Calendar}
          title="Avg Monthly Expense"
          value={formatCurrency(insights.avgMonthlyExpense, true)}
          subtitle="across all months"
          color="bg-pink-500"
          delay={440}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly comparison bar chart */}
        <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 animate-fade-up shadow-sm dark:shadow-none" style={{ animationDelay: '300ms' }}>
          <h3 className="text-slate-900 dark:text-white font-semibold mb-1">Monthly Comparison</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mb-5">Income vs Expenses by month</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<BarTooltip />} />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-5 mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block shadow-sm" /> Income</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block shadow-sm" /> Expenses</span>
          </div>
        </div>

        {/* Category breakdown horizontal bar */}
        <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 animate-fade-up shadow-sm dark:shadow-none" style={{ animationDelay: '380ms' }}>
          <h3 className="text-slate-900 dark:text-white font-semibold mb-1">Expense Categories</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mb-5">Ranked by total spending</p>
          <div className="space-y-3">
            {catBreakdown.slice(0, 7).map((item, i) => {
              const pct = totalExpense > 0 ? (item.value / totalExpense * 100) : 0;
              const color = CATEGORY_COLORS[item.name] || '#64748b';
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium">
                      <span className="w-2 h-2 rounded-sm inline-block flex-shrink-0" style={{ backgroundColor: color }} />
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2 text-right">
                      <span className="text-slate-600 dark:text-slate-400 font-mono font-semibold">{formatCurrency(item.value, true)}</span>
                      <span className="text-slate-400 dark:text-slate-500 w-9 font-medium">{pct.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: color, transitionDelay: `${i * 80}ms` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Observation callout */}
      <div className="bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 dark:from-emerald-500/10 dark:to-cyan-500/10 border border-emerald-500/20 dark:border-emerald-500/20 rounded-2xl p-6 animate-fade-up shadow-sm dark:shadow-none" style={{ animationDelay: '450ms' }}>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-xl flex-shrink-0 shadow-sm">
            <Zap size={20} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-1.5 text-base italic">Smart Observation</h4>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">
              {parseFloat(savingsRate) >= 20
                ? `You're saving ${savingsRate}% of your income — excellent financial health! Your top expense category is ${insights.topCategory?.name || 'unknown'}. Consider diversifying your ${insights.incomeStreams} income stream${insights.incomeStreams !== 1 ? 's' : ''} to build more resilience.`
                : parseFloat(savingsRate) > 0
                ? `Your current savings rate of ${savingsRate}% has room to grow. ${insights.topCategory ? `${insights.topCategory.name} is your biggest expense at ${formatCurrency(insights.topCategory.value, true)}.` : ''} Aim for 20%+ savings to build long-term wealth.`
                : `Your expenses are exceeding your income. Review your spending in ${insights.topCategory?.name || 'top categories'} to find areas to cut back.`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
