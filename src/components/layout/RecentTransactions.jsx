import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDateShort } from '../../utils/helpers';
import { CATEGORY_COLORS } from '../../data/mockData';

export default function RecentTransactions() {
  const { state, dispatch } = useFinance();
  const recent = [...state.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  if (!recent.length) {
    return (
      <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm dark:shadow-none">
        <h3 className="text-slate-900 dark:text-white font-semibold mb-4">Recent Transactions</h3>
        <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-sm">No transactions yet</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm dark:shadow-none animate-fade-up" style={{ animationDelay: '350ms' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-slate-900 dark:text-white font-semibold text-base">Recent Transactions</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Latest activity</p>
        </div>
        <button
          onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'transactions' })}
          className="text-emerald-600 dark:text-emerald-400 text-xs hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors font-semibold"
        >
          View all →
        </button>
      </div>

      <div className="space-y-1">
        {recent.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
              tx.type === 'income' ? 'bg-emerald-500/10 dark:bg-emerald-500/15' : 'bg-red-500/10 dark:bg-red-500/15'
            }`}>
              {tx.type === 'income'
                ? <ArrowUpRight size={15} className="text-emerald-600 dark:text-emerald-400" />
                : <ArrowDownLeft size={15} className="text-red-600 dark:text-red-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-800 dark:text-slate-200 text-sm font-medium truncate">{tx.description || tx.category}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: (CATEGORY_COLORS[tx.category] || '#64748b') + '22',
                    color: CATEGORY_COLORS[tx.category] || '#94a3b8',
                  }}
                >
                  {tx.category}
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-xs">{formatDateShort(tx.date)}</span>
              </div>
            </div>
            <span className={`text-sm font-mono font-semibold ${
              tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, true)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
