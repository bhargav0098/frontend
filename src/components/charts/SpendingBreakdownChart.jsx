import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { CATEGORY_COLORS } from '../../data/mockData';
import { formatCurrency } from '../../utils/helpers';

export default function SpendingBreakdownChart() {
  const { state, getCategoryBreakdown } = useFinance();
  const [activeIndex, setActiveIndex] = useState(0);
  const data = getCategoryBreakdown();
  const top6 = data.slice(0, 6);
  const isDark = state.darkMode;

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    return (
      <g>
        <text x={cx} y={cy - 10} textAnchor="middle" fill={isDark ? "#f1f5f9" : "#0f172a"} className="text-sm font-bold" fontSize={13}>
          {payload.name.length > 12 ? payload.name.slice(0, 11) + '…' : payload.name}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#10b981" fontSize={14} fontWeight="800" fontFamily="JetBrains Mono">
          {formatCurrency(value, true)}
        </text>
        <text x={cx} y={cy + 30} textAnchor="middle" fill={isDark ? "#94a3b8" : "#64748b"} fontSize={11} fontWeight="500">
          {(percent * 100).toFixed(1)}%
        </text>
        <Sector
          cx={cx} cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx} cy={cy}
          innerRadius={outerRadius + 12}
          outerRadius={outerRadius + 14}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  if (!top6.length) {
    return (
      <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm dark:shadow-none">
        <h3 className="text-slate-900 dark:text-white font-semibold mb-4">Spending Breakdown</h3>
        <div className="h-48 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">No expense data</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm dark:shadow-none animate-fade-up" style={{ animationDelay: '280ms' }}>
      <div className="mb-4">
        <h3 className="text-slate-900 dark:text-white font-semibold text-base font-display">Spending Breakdown</h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">By category — top 6</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:w-48 flex-shrink-0">
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={top6}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={80}
                stroke="none"
                dataKey="value"
                onMouseEnter={(_, i) => setActiveIndex(i)}
              >
                {top6.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={CATEGORY_COLORS[entry.name] || '#64748b'}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 w-full space-y-2">
          {top6.map((item, i) => {
            const total = top6.reduce((s, d) => s + d.value, 0);
            const pct = total > 0 ? (item.value / total * 100).toFixed(0) : 0;
            const color = CATEGORY_COLORS[item.name] || '#64748b';
            return (
              <button
                key={item.name}
                className="w-full flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg px-2 py-1.5 transition-colors group"
                onMouseEnter={() => setActiveIndex(i)}
              >
                <span
                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="text-slate-700 dark:text-slate-300 text-xs flex-1 text-left truncate font-medium group-hover:text-slate-900 dark:group-hover:text-white">{item.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-slate-100 dark:bg-slate-700 rounded-full h-1 overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className="text-slate-400 dark:text-slate-500 text-[10px] font-mono w-8 text-right font-bold">{pct}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
