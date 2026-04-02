import React, { useState } from 'react';
import {
  Search, Filter, SortAsc, SortDesc, Plus, Pencil, Trash2,
  Download, ChevronDown, ArrowUpDown, X
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate, exportToCSV, exportToJSON, cn } from '../../utils/helpers';
import { CATEGORY_COLORS } from '../../data/mockData';

export default function TransactionsPage() {
  const { state, dispatch, getFilteredTransactions, getCategories } = useFinance();
  const { filters, role } = state;
  const [showExport, setShowExport] = useState(false);

  const transactions = getFilteredTransactions();
  const categories = getCategories();
  const isAdmin = role === 'admin';

  const setFilter = (updates) => dispatch({ type: 'SET_FILTER', payload: updates });

  const toggleSort = (field) => {
    if (filters.sortBy === field) {
      setFilter({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      setFilter({ sortBy: field, sortOrder: 'desc' });
    }
  };

  const SortIcon = ({ field }) => {
    if (filters.sortBy !== field) return <ArrowUpDown size={13} className="text-slate-500" />;
    return filters.sortOrder === 'asc'
      ? <SortAsc size={13} className="text-emerald-400" />
      : <SortDesc size={13} className="text-emerald-400" />;
  };

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={filters.search}
            onChange={e => setFilter({ search: e.target.value })}
            placeholder="Search transactions..."
            className="w-full bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors shadow-sm dark:shadow-none"
          />
          {filters.search && (
            <button
              onClick={() => setFilter({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Type filter */}
          <div className="flex bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden text-xs shadow-sm dark:shadow-none">
            {['all', 'income', 'expense'].map(t => (
              <button
                key={t}
                onClick={() => setFilter({ type: t })}
                className={cn(
                  'px-3 py-2 capitalize font-medium transition-colors',
                  filters.type === t
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                {t === 'all' ? 'All' : t}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="relative">
            <select
              value={filters.category}
              onChange={e => setFilter({ category: e.target.value })}
              className="appearance-none bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 rounded-xl pl-3 pr-8 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors shadow-sm dark:shadow-none"
            >
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Reset filters */}
          {(filters.search || filters.type !== 'all' || filters.category !== 'all') && (
            <button
              onClick={() => dispatch({ type: 'RESET_FILTERS' })}
              className="text-xs text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 flex items-center gap-1 px-2 py-2 rounded-xl border border-red-200 dark:border-red-400/20 hover:bg-red-50 transition-colors"
            >
              <X size={12} /> Clear
            </button>
          )}

          {/* Export */}
          <div className="relative">
            <button
              onClick={() => setShowExport(!showExport)}
              className="flex items-center gap-1.5 bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl px-3 py-2 text-xs font-medium transition-colors shadow-sm dark:shadow-none"
            >
              <Download size={13} />
              Export
              <ChevronDown size={12} />
            </button>
            {showExport && (
              <div className="absolute right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600/50 rounded-xl shadow-xl z-10 overflow-hidden w-32 animate-fade-in">
                <button
                  onClick={() => { exportToCSV(transactions); setShowExport(false); }}
                  className="w-full text-left px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs transition-colors"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => { exportToJSON(transactions); setShowExport(false); }}
                  className="w-full text-left px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs transition-colors"
                >
                  Export JSON
                </button>
              </div>
            )}
          </div>

          {/* Add (Admin only) */}
          {isAdmin && (
            <button
              onClick={() => dispatch({ type: 'SET_SHOW_ADD_MODAL', payload: true })}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl px-3 py-2 text-xs font-bold transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Plus size={14} />
              Add
            </button>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
        <span>{transactions.length} transaction{transactions.length !== 1 ? 's' : ''}</span>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <span className="text-emerald-600 dark:text-emerald-400">
          +{formatCurrency(transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), true)}
        </span>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <span className="text-red-600 dark:text-red-400">
          -{formatCurrency(transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), true)}
        </span>
      </div>

      {/* Table */}
      {transactions.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-16 text-center shadow-sm dark:shadow-none">
          <Filter size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">No transactions found</p>
          <p className="text-slate-400 dark:text-slate-600 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <div className="col-span-2 hidden sm:block">
              <button
                onClick={() => toggleSort('date')}
                className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-300 transition-colors"
              >
                Date <SortIcon field="date" />
              </button>
            </div>
            <div className="col-span-4 sm:col-span-3">Description</div>
            <div className="col-span-3 sm:col-span-3">Category</div>
            <div className="col-span-2 sm:col-span-2 text-right">
              <button
                onClick={() => toggleSort('amount')}
                className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-300 transition-colors ml-auto"
              >
                Amount <SortIcon field="amount" />
              </button>
            </div>
            <div className="col-span-1">Type</div>
            {isAdmin && <div className="col-span-2 sm:col-span-1 text-right text-slate-400/50">Actions</div>}
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-50 dark:divide-slate-700/30">
            {transactions.map((tx, idx) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                isAdmin={isAdmin}
                dispatch={dispatch}
                idx={idx}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TransactionRow({ tx, isAdmin, dispatch, idx }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (confirmDelete) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: tx.id });
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const color = CATEGORY_COLORS[tx.category] || '#64748b';

  return (
    <div
      className="grid grid-cols-12 gap-2 px-5 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors animate-slide-in"
      style={{ animationDelay: `${idx * 20}ms` }}
    >
      {/* Date */}
      <div className="col-span-2 hidden sm:block text-slate-500 dark:text-slate-400 text-xs font-mono">
        {formatDate(tx.date)}
      </div>

      {/* Description */}
      <div className="col-span-4 sm:col-span-3">
        <p className="text-slate-900 dark:text-slate-200 text-sm font-semibold truncate">{tx.description || tx.category}</p>
        <p className="text-slate-400 dark:text-slate-500 text-[10px] sm:hidden font-mono">{formatDate(tx.date)}</p>
      </div>

      {/* Category */}
      <div className="col-span-3">
        <span
          className="text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wider inline-block truncate max-w-full"
          style={{ backgroundColor: color + '15', color }}
        >
          {tx.category}
        </span>
      </div>

      {/* Amount */}
      <div className={cn(
        'col-span-2 text-right font-mono text-sm font-bold',
        tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
      )}>
        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, true)}
      </div>

      {/* Type badge */}
      <div className="col-span-1">
        <span className={cn(
          'text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider hidden sm:inline-block',
          tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
        )}>
          {tx.type === 'income' ? 'Inc' : 'Exp'}
        </span>
      </div>

      {/* Actions */}
      {isAdmin && (
        <div className="col-span-2 sm:col-span-1 flex items-center justify-end gap-1">
          <button
            onClick={() => dispatch({ type: 'SET_EDITING', payload: tx })}
            className="p-1.5 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-400/10 rounded-lg transition-colors border border-transparent hover:border-cyan-100 dark:hover:border-transparent"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={handleDelete}
            className={cn(
              'p-1.5 rounded-lg transition-colors border border-transparent',
              confirmDelete
                ? 'text-white bg-red-500 border-red-600 shadow-sm'
                : 'text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 hover:border-red-100 dark:hover:border-transparent'
            )}
            title={confirmDelete ? 'Click again to confirm' : 'Delete'}
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
