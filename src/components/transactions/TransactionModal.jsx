import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { CATEGORIES } from '../../data/mockData';

const EMPTY_FORM = {
  date: new Date().toISOString().slice(0, 10),
  amount: '',
  category: '',
  type: 'expense',
  description: '',
};

export default function TransactionModal() {
  const { state, dispatch } = useFinance();
  const isOpen = state.showAddModal || !!state.editingTransaction;
  const isEditing = !!state.editingTransaction;

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (state.editingTransaction) {
      setForm({ ...state.editingTransaction, amount: state.editingTransaction.amount.toString() });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [state.editingTransaction, state.showAddModal]);

  const validate = () => {
    const e = {};
    if (!form.date) e.date = 'Required';
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) e.amount = 'Valid amount required';
    if (!form.category) e.category = 'Required';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const payload = { ...form, amount: +form.amount };
    if (isEditing) {
      dispatch({ type: 'UPDATE_TRANSACTION', payload });
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload });
    }
  };

  const handleClose = () => {
    dispatch({ type: 'SET_SHOW_ADD_MODAL', payload: false });
    dispatch({ type: 'SET_EDITING', payload: null });
  };

  const cats = form.type === 'income' ? CATEGORIES.income : CATEGORIES.expense;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl animate-fade-up overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-slate-900 dark:text-white font-bold text-lg font-display">
            {isEditing ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Type toggle */}
          <div>
            <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block">Type</label>
            <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 shadow-sm">
              {['expense', 'income'].map(t => (
                <button
                  key={t}
                  onClick={() => setForm(f => ({ ...f, type: t, category: '' }))}
                  className={`flex-1 py-2.5 text-sm font-bold capitalize transition-all ${
                    form.type === t
                      ? t === 'income'
                        ? 'bg-emerald-500 text-white shadow-inner'
                        : 'bg-red-500 text-white shadow-inner'
                      : 'bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block">Amount (₹)</label>
            <div className="relative">
              <input
                type="number"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="0.00"
                className="w-full bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono font-bold"
              />
            </div>
            {errors.amount && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium">{errors.amount}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div className="col-span-1">
              <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-all cursor-pointer font-medium"
              >
                <option value="">Select</option>
                {cats.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium">{errors.category}</p>}
            </div>

            {/* Date */}
            <div className="col-span-1">
              <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
              />
              {errors.date && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium">{errors.date}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block">Description <span className="text-slate-400 dark:text-slate-600 text-[10px] ml-1">(Optional)</span></label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="What was this for?"
              className="w-full bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-5 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 text-sm font-bold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            {isEditing ? 'Save Changes' : 'Create Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
}
