import React from 'react';
import { Menu, UserCircle } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

const TAB_LABELS = {
  dashboard: 'Overview',
  transactions: 'Transactions',
  insights: 'Insights',
};

export default function Header({ onMenuClick }) {
  const { state } = useFinance();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-16 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-slate-900 dark:text-white font-display font-semibold text-lg">
            {TAB_LABELS[state.activeTab]}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs hidden sm:block">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${
          state.role === 'admin'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${state.role === 'admin' ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-slate-400 dark:bg-slate-500'}`} />
          {state.role === 'admin' ? 'Admin' : 'Viewer'}
        </div>
        <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {state.role === 'admin' ? 'A' : 'V'}
          </div>
        </button>
      </div>
    </header>
  );
}
