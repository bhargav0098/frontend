import { subDays, format } from 'date-fns';

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Bonus', 'Rental Income'],
  expense: ['Food & Dining', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Travel', 'Subscriptions', 'Housing'],
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const INITIAL_TRANSACTIONS = [
  // January
  { id: generateId(), date: '2025-01-05', amount: 85000, category: 'Salary', type: 'income', description: 'Monthly salary - January' },
  { id: generateId(), date: '2025-01-07', amount: 12000, category: 'Housing', type: 'expense', description: 'Rent payment' },
  { id: generateId(), date: '2025-01-10', amount: 3200, category: 'Food & Dining', type: 'expense', description: 'Groceries & dining' },
  { id: generateId(), date: '2025-01-12', amount: 1800, category: 'Transport', type: 'expense', description: 'Monthly commute' },
  { id: generateId(), date: '2025-01-15', amount: 15000, category: 'Freelance', type: 'income', description: 'Web design project' },
  { id: generateId(), date: '2025-01-18', amount: 4500, category: 'Shopping', type: 'expense', description: 'Clothes & accessories' },
  { id: generateId(), date: '2025-01-20', amount: 2100, category: 'Entertainment', type: 'expense', description: 'Movies, OTT, gaming' },
  { id: generateId(), date: '2025-01-22', amount: 1200, category: 'Utilities', type: 'expense', description: 'Electricity & internet' },
  { id: generateId(), date: '2025-01-25', amount: 800, category: 'Subscriptions', type: 'expense', description: 'Netflix, Spotify, tools' },
  { id: generateId(), date: '2025-01-28', amount: 2500, category: 'Healthcare', type: 'expense', description: 'Doctor visit & medicines' },

  // February
  { id: generateId(), date: '2025-02-01', amount: 85000, category: 'Salary', type: 'income', description: 'Monthly salary - February' },
  { id: generateId(), date: '2025-02-03', amount: 12000, category: 'Housing', type: 'expense', description: 'Rent payment' },
  { id: generateId(), date: '2025-02-05', amount: 8000, category: 'Investment', type: 'income', description: 'Mutual fund returns' },
  { id: generateId(), date: '2025-02-08', amount: 3800, category: 'Food & Dining', type: 'expense', description: 'Groceries & dining out' },
  { id: generateId(), date: '2025-02-12', amount: 6500, category: 'Travel', type: 'expense', description: 'Weekend trip' },
  { id: generateId(), date: '2025-02-14', amount: 2200, category: 'Shopping', type: 'expense', description: "Valentine's gifts" },
  { id: generateId(), date: '2025-02-18', amount: 1800, category: 'Transport', type: 'expense', description: 'Fuel & cab rides' },
  { id: generateId(), date: '2025-02-20', amount: 1200, category: 'Utilities', type: 'expense', description: 'Electricity & internet' },
  { id: generateId(), date: '2025-02-22', amount: 800, category: 'Subscriptions', type: 'expense', description: 'Monthly subscriptions' },
  { id: generateId(), date: '2025-02-25', amount: 12000, category: 'Freelance', type: 'income', description: 'App development project' },

  // March
  { id: generateId(), date: '2025-03-01', amount: 85000, category: 'Salary', type: 'income', description: 'Monthly salary - March' },
  { id: generateId(), date: '2025-03-03', amount: 12000, category: 'Housing', type: 'expense', description: 'Rent payment' },
  { id: generateId(), date: '2025-03-06', amount: 4200, category: 'Food & Dining', type: 'expense', description: 'Holi celebrations & dining' },
  { id: generateId(), date: '2025-03-10', amount: 5500, category: 'Education', type: 'expense', description: 'Online courses' },
  { id: generateId(), date: '2025-03-14', amount: 20000, category: 'Bonus', type: 'income', description: 'Performance bonus Q1' },
  { id: generateId(), date: '2025-03-16', amount: 8500, category: 'Shopping', type: 'expense', description: 'Electronics upgrade' },
  { id: generateId(), date: '2025-03-20', amount: 1800, category: 'Transport', type: 'expense', description: 'Monthly commute' },
  { id: generateId(), date: '2025-03-22', amount: 3200, category: 'Entertainment', type: 'expense', description: 'Events & outings' },
  { id: generateId(), date: '2025-03-25', amount: 1200, category: 'Utilities', type: 'expense', description: 'Bills' },
  { id: generateId(), date: '2025-03-28', amount: 18000, category: 'Investment', type: 'income', description: 'Stock dividends' },

  // April
  { id: generateId(), date: '2025-04-01', amount: 85000, category: 'Salary', type: 'income', description: 'Monthly salary - April' },
  { id: generateId(), date: '2025-04-04', amount: 12000, category: 'Housing', type: 'expense', description: 'Rent payment' },
  { id: generateId(), date: '2025-04-07', amount: 3500, category: 'Food & Dining', type: 'expense', description: 'Groceries' },
  { id: generateId(), date: '2025-04-10', amount: 15000, category: 'Travel', type: 'expense', description: 'Summer trip planning' },
  { id: generateId(), date: '2025-04-14', amount: 10000, category: 'Freelance', type: 'income', description: 'Logo & branding work' },
  { id: generateId(), date: '2025-04-18', amount: 2800, category: 'Shopping', type: 'expense', description: 'Home essentials' },
  { id: generateId(), date: '2025-04-22', amount: 1800, category: 'Transport', type: 'expense', description: 'Transport expenses' },
  { id: generateId(), date: '2025-04-25', amount: 800, category: 'Subscriptions', type: 'expense', description: 'Subscriptions' },
  { id: generateId(), date: '2025-04-28', amount: 1500, category: 'Healthcare', type: 'expense', description: 'Annual checkup' },

  // May
  { id: generateId(), date: '2025-05-01', amount: 85000, category: 'Salary', type: 'income', description: 'Monthly salary - May' },
  { id: generateId(), date: '2025-05-03', amount: 12000, category: 'Housing', type: 'expense', description: 'Rent payment' },
  { id: generateId(), date: '2025-05-07', amount: 4800, category: 'Food & Dining', type: 'expense', description: 'Dining & groceries' },
  { id: generateId(), date: '2025-05-12', amount: 7500, category: 'Rental Income', type: 'income', description: 'Property rental' },
  { id: generateId(), date: '2025-05-15', amount: 3200, category: 'Entertainment', type: 'expense', description: 'Concert tickets & events' },
  { id: generateId(), date: '2025-05-18', amount: 1800, category: 'Transport', type: 'expense', description: 'Commute' },
  { id: generateId(), date: '2025-05-20', amount: 2500, category: 'Education', type: 'expense', description: 'Course certification' },
  { id: generateId(), date: '2025-05-24', amount: 14000, category: 'Freelance', type: 'income', description: 'Dashboard design project' },
  { id: generateId(), date: '2025-05-27', amount: 1200, category: 'Utilities', type: 'expense', description: 'Monthly bills' },
  { id: generateId(), date: '2025-05-30', amount: 4500, category: 'Shopping', type: 'expense', description: 'Seasonal shopping' },

  // June
  { id: generateId(), date: '2025-06-02', amount: 90000, category: 'Salary', type: 'income', description: 'Monthly salary - June (increment)' },
  { id: generateId(), date: '2025-06-04', amount: 12000, category: 'Housing', type: 'expense', description: 'Rent payment' },
  { id: generateId(), date: '2025-06-08', amount: 5200, category: 'Food & Dining', type: 'expense', description: 'Groceries & restaurants' },
  { id: generateId(), date: '2025-06-11', amount: 7500, category: 'Rental Income', type: 'income', description: 'Property rental' },
  { id: generateId(), date: '2025-06-14', amount: 9000, category: 'Travel', type: 'expense', description: 'Monsoon trip' },
  { id: generateId(), date: '2025-06-18', amount: 1800, category: 'Transport', type: 'expense', description: 'Transport' },
  { id: generateId(), date: '2025-06-22', amount: 800, category: 'Subscriptions', type: 'expense', description: 'Subscriptions' },
  { id: generateId(), date: '2025-06-25', amount: 3500, category: 'Shopping', type: 'expense', description: 'Shopping' },
  { id: generateId(), date: '2025-06-28', amount: 1200, category: 'Utilities', type: 'expense', description: 'Bills' },
];

export const CATEGORY_COLORS = {
  'Salary': '#10b981',
  'Freelance': '#06b6d4',
  'Investment': '#8b5cf6',
  'Bonus': '#f59e0b',
  'Rental Income': '#ec4899',
  'Food & Dining': '#ef4444',
  'Transport': '#f97316',
  'Shopping': '#eab308',
  'Entertainment': '#a855f7',
  'Utilities': '#6366f1',
  'Healthcare': '#14b8a6',
  'Education': '#3b82f6',
  'Travel': '#22c55e',
  'Subscriptions': '#64748b',
  'Housing': '#dc2626',
};

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export { generateId, CATEGORIES };
