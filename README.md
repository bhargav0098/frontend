# FinFlow — Finance Dashboard

A modern, responsive personal finance dashboard built with React and Tailwind CSS. Track income, expenses, and spending patterns with a clean, intuitive interface.

![FinFlow Dashboard](https://via.placeholder.com/1200x600/0B0F1A/10b981?text=FinFlow+Finance+Dashboard)

---

## Features

### Dashboard Overview
- **Summary Cards** — Total Balance, Income, and Expenses with month-over-month trend indicators
- **Balance Trend Chart** — Area chart showing monthly income vs expense over time (Recharts)
- **Spending Breakdown** — Interactive donut chart with category hover states
- **Recent Transactions** — Quick-glance list of the 6 most recent entries

### Transactions
- Full transaction table with Date, Description, Category, Amount, and Type
- **Search** — Filter by keyword, category name, or amount
- **Type filter** — All / Income / Expense toggle
- **Category filter** — Dropdown with all used categories
- **Sorting** — Sort by date or amount (ascending / descending)
- **Export** — Download filtered transactions as CSV or JSON
- **Admin only**: Add, edit, and delete transactions

### Role-Based UI
- **Viewer** — Read-only access to all data
- **Admin** — Full CRUD: add, edit, delete transactions
- Role switcher in sidebar; role persists via localStorage

### Insights
- Highest spending category
- Monthly expense comparison (% change between last two months)
- Savings rate (income − expenses / income)
- Average monthly savings
- Total transactions & income stream count
- Category breakdown ranked bar chart
- Monthly comparison bar chart
- Smart AI-style observation based on financial health

### UX & Design
- Dark-first design with optional light mode toggle
- Fully responsive (mobile, tablet, desktop)
- Color-coded: green for income, red for expenses
- Smooth CSS animations and hover micro-interactions
- Empty state handling throughout
- Confirm-on-delete pattern for transaction rows
- LocalStorage persistence for transactions, role, and theme

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Styling | Tailwind CSS |
| Charts | Recharts |
| State Management | React Context + useReducer |
| Icons | Lucide React |
| Date Utilities | date-fns |
| Typography | Sora + JetBrains Mono (Google Fonts) |
| Persistence | localStorage |

---

## Getting Started

### Prerequisites
- Node.js v16 or higher
- npm v8 or higher

### Installation

```bash
# 1. Clone or unzip the project
cd finance-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will open at **http://localhost:3000**

### Build for Production

```bash
npm run build
```

Output is in the `/build` folder — ready to deploy to Netlify, Vercel, or any static host.

---

## Project Structure

```
src/
├── components/
│   ├── charts/
│   │   ├── BalanceTrendChart.jsx     # Area chart — monthly trend
│   │   └── SpendingBreakdownChart.jsx # Donut chart — categories
│   ├── insights/
│   │   └── InsightsPage.jsx          # Full insights view
│   ├── layout/
│   │   ├── DashboardPage.jsx         # Main overview page
│   │   ├── Header.jsx                # Top bar with role badge
│   │   ├── RecentTransactions.jsx    # Dashboard transaction list
│   │   ├── Sidebar.jsx               # Navigation + role switcher
│   │   └── SummaryCards.jsx          # Balance / income / expense cards
│   └── transactions/
│       ├── TransactionModal.jsx      # Add / edit modal (Admin)
│       └── TransactionsPage.jsx      # Full table with filters
├── context/
│   └── FinanceContext.js             # Global state via Context + useReducer
├── data/
│   └── mockData.js                   # 60+ mock transactions (Jan–Jun 2025)
├── utils/
│   └── helpers.js                    # formatCurrency, exportCSV, exportJSON
├── App.js
├── index.css                         # Tailwind + custom globals
└── index.js
```

---

## Architecture & Design Decisions

### State Management
Used **React Context + useReducer** for a Flux-like unidirectional data flow. All mutations go through typed actions (`ADD_TRANSACTION`, `SET_FILTER`, etc.), making state changes predictable and easy to debug. Chosen over Zustand/Redux to keep the dependency footprint minimal while still being fully scalable.

### Role-Based UI
Roles are simulated entirely on the frontend — no backend needed. The `role` value in global state gates all write operations: the Add button, Edit/Delete icons, and the modal only render when `role === 'admin'`. Switching roles via the sidebar dropdown updates localStorage and re-renders immediately.

### Data Persistence
Every mutation (add/edit/delete transaction, role change, theme toggle) writes to **localStorage**. On app load, data is hydrated from storage with a fallback to the built-in mock dataset. A "Reset Data" button in the sidebar restores the defaults.

### Responsive Layout
The sidebar is fixed on desktop (lg: breakpoint) and slides in as a drawer on mobile, with a backdrop overlay. The transaction table degrades gracefully — the date column hides on small screens, with the date shown inline below the description instead.

### Chart Strategy
- **AreaChart** for the balance trend — effective for showing cumulative change and the gap between income and expenses
- **PieChart with active shape** for spending breakdown — the active shape pattern gives richer hover feedback than a static tooltip
- **BarChart** in Insights for direct monthly comparison — easier to compare values side-by-side than stacked areas

---

## Mock Data

60+ transactions spanning January–June 2025 across 10 expense categories and 5 income categories, including:
- Monthly salary with a mid-year increment
- Freelance project income
- Investment returns and dividends
- Realistic expense distribution across Housing, Food, Travel, Shopping, etc.

---

## Optional Enhancements Implemented

- [x] Dark mode toggle (persisted)
- [x] LocalStorage data persistence
- [x] Export CSV / Export JSON
- [x] Modular reusable components
- [x] Clean folder structure
- [x] Confirm-before-delete UX
- [x] Animated transitions and hover effects
- [x] Empty state handling

---

## Deployment

The build output is a standard static React app. Deploy to:

- **Vercel**: `vercel --prod` or connect GitHub repo
- **Netlify**: Drag `/build` folder into Netlify dashboard
- **GitHub Pages**: Use `gh-pages` package

---

## License

Built as an internship assignment submission. All code is original.
