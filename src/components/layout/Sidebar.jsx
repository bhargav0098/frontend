import React, { useState } from 'react';
import { LayoutDashboard, ArrowLeftRight, Lightbulb, Shield, Sun, Moon, RotateCcw, TrendingUp, ChevronDown } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { cn } from '../../utils/helpers';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { state, dispatch } = useFinance();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const handleTabChange = (tab) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
    onClose?.();
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 z-50 flex flex-col',
        'bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800',
        'transition-transform duration-300 ease-in-out',
        'lg:translate-x-0 lg:static lg:z-auto',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <TrendingUp size={18} className="text-white" />
          </div>
          <div>
            <span className="text-slate-900 dark:text-white font-display font-bold text-lg tracking-tight">FinFlow</span>
            <p className="text-slate-400 dark:text-slate-500 text-xs">Finance Dashboard</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-wider px-3 mb-3">Menu</p>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                state.activeTab === id
                  ? 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-inner'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              <Icon size={18} className={state.activeTab === id ? 'text-emerald-500 dark:text-emerald-400' : ''} />
              {label}
              {state.activeTab === id && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              )}
            </button>
          ))}
        </nav>

        {/* Role Switcher */}
        <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800">
          <p className="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-wider mb-2 px-1">Role</p>
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="w-full flex items-center gap-2 bg-slate-100 dark:bg-slate-800/60 rounded-xl p-2 text-slate-800 dark:text-white text-sm transition-all hover:bg-slate-200 dark:hover:bg-slate-800 font-medium"
            >
              <Shield size={14} className="text-emerald-500 dark:text-emerald-400 ml-1" />
              <span className="flex-1 text-left capitalize">{state.role}</span>
              <ChevronDown size={14} className={cn("text-slate-400 transition-transform duration-200", showRoleDropdown && "rotate-180")} />
            </button>
            
            {showRoleDropdown && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-xl z-50 animate-fade-in-up">
                {['viewer', 'admin'].map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      dispatch({ type: 'SET_ROLE', payload: r });
                      setShowRoleDropdown(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm transition-colors",
                      state.role === r 
                        ? "bg-emerald-500 text-white font-semibold" 
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
          {state.role === 'admin' && (
            <p className="text-emerald-600 dark:text-emerald-400/70 text-[10px] mt-1.5 px-1 flex items-center gap-1 uppercase font-bold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse inline-block" />
              Admin mode
            </p>
          )}
        </div>

        {/* Bottom actions */}
        <div className="px-4 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors font-medium"
          >
            {state.darkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{state.darkMode ? 'Light' : 'Dark'} mode</span>
          </button>
          <button
            onClick={() => {
              if (window.confirm('Reset all data to defaults?')) {
                dispatch({ type: 'RESET_DATA' });
              }
            }}
            className="text-slate-400 dark:text-slate-500 hover:text-red-500 transition-colors"
            title="Reset data"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </aside>
    </>
  );
}
