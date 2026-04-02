import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { INITIAL_TRANSACTIONS, generateId } from '../data/mockData';

const FinanceContext = createContext(null);

const STORAGE_KEY = 'finflow_transactions';
const ROLE_KEY = 'finflow_role';
const THEME_KEY = 'finflow_theme';

const loadTransactions = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : INITIAL_TRANSACTIONS;
  } catch {
    return INITIAL_TRANSACTIONS;
  }
};

const initialState = {
  transactions: loadTransactions(),
  role: localStorage.getItem(ROLE_KEY) || 'viewer',
  darkMode: localStorage.getItem(THEME_KEY) === 'dark',
  filters: {
    search: '',
    type: 'all',
    category: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  },
  activeTab: 'dashboard',
  editingTransaction: null,
  showAddModal: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      localStorage.setItem(ROLE_KEY, action.payload);
      return { ...state, role: action.payload };

    case 'TOGGLE_DARK_MODE': {
      const next = !state.darkMode;
      localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
      return { ...state, darkMode: next };
    }

    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case 'RESET_FILTERS':
      return { ...state, filters: { ...initialState.filters } };

    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };

    case 'ADD_TRANSACTION': {
      const newTx = { ...action.payload, id: generateId() };
      const updated = [newTx, ...state.transactions];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { ...state, transactions: updated, showAddModal: false };
    }

    case 'UPDATE_TRANSACTION': {
      const updated = state.transactions.map(t =>
        t.id === action.payload.id ? action.payload : t
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { ...state, transactions: updated, editingTransaction: null };
    }

    case 'DELETE_TRANSACTION': {
      const updated = state.transactions.filter(t => t.id !== action.payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { ...state, transactions: updated };
    }

    case 'SET_EDITING':
      return { ...state, editingTransaction: action.payload };

    case 'SET_SHOW_ADD_MODAL':
      return { ...state, showAddModal: action.payload };

    case 'RESET_DATA':
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
      return { ...state, transactions: INITIAL_TRANSACTIONS };

    default:
      return state;
  }
}

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  const getFilteredTransactions = () => {
    let txs = [...state.transactions];
    const { search, type, category, sortBy, sortOrder } = state.filters;

    if (search) {
      const q = search.toLowerCase();
      txs = txs.filter(t =>
        t.category.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.amount.toString().includes(q)
      );
    }
    if (type !== 'all') txs = txs.filter(t => t.type === type);
    if (category !== 'all') txs = txs.filter(t => t.category === category);

    txs.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'date') cmp = new Date(a.date) - new Date(b.date);
      else if (sortBy === 'amount') cmp = a.amount - b.amount;
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return txs;
  };

  const getSummary = () => {
    const income = state.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = state.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  };

  const getMonthlyData = () => {
    const months = {};
    state.transactions.forEach(t => {
      const m = t.date.slice(0, 7);
      if (!months[m]) months[m] = { income: 0, expense: 0 };
      months[m][t.type] += t.amount;
    });
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleString('default', { month: 'short' }),
        fullMonth: month,
        income: data.income,
        expense: data.expense,
        balance: data.income - data.expense,
      }));
  };

  const getCategoryBreakdown = () => {
    const cats = {};
    state.transactions.filter(t => t.type === 'expense').forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + t.amount;
    });
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const getInsights = () => {
    const { income, expense } = getSummary();
    const catBreakdown = getCategoryBreakdown();
    const monthly = getMonthlyData();
    const savingsRate = income > 0 ? ((income - expense) / income * 100).toFixed(1) : 0;

    const lastTwo = monthly.slice(-2);
    const monthlyChange = lastTwo.length === 2
      ? ((lastTwo[1].expense - lastTwo[0].expense) / lastTwo[0].expense * 100).toFixed(1)
      : 0;

    const avgMonthlyExpense = monthly.length > 0
      ? Math.round(monthly.reduce((s, m) => s + m.expense, 0) / monthly.length)
      : 0;

    return {
      topCategory: catBreakdown[0] || null,
      savingsRate,
      monthlyChange,
      avgMonthlyExpense,
      monthLabels: lastTwo.map(m => m.month),
      totalTransactions: state.transactions.length,
      incomeStreams: [...new Set(state.transactions.filter(t => t.type === 'income').map(t => t.category))].length,
    };
  };

  const getCategories = () => {
    return [...new Set(state.transactions.map(t => t.category))].sort();
  };

  return (
    <FinanceContext.Provider value={{
      state,
      dispatch,
      getFilteredTransactions,
      getSummary,
      getMonthlyData,
      getCategoryBreakdown,
      getInsights,
      getCategories,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
};
