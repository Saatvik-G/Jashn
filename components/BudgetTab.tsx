"use client";

import { useState } from "react";
import { BudgetSummary } from "@/lib/engine/types";
import { formatINR, formatCompactINR } from "@/lib/engine/budget";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ShieldCheck, AlertCircle, AlertOctagon, TrendingDown, Check } from "lucide-react";

interface BudgetTabProps {
  summary: BudgetSummary;
  eventType: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  CATERING: "#D97706", // Marigold
  VENUE: "#4A0E17",    // Oxblood
  DECOR: "#E11D48",    // Rose
  PHOTO: "#0F766E",    // Teal
  ATTIRE: "#9333EA",   // Purple
  ENTERTAINMENT: "#2563EB", // Blue
  PERMITS_SECURITY: "#4B5563", // Gray
  ACTIVITIES: "#F59E0B", // Amber
  CONTINGENCY: "#5F7A61", // Sage
};

export function BudgetTab({ summary, eventType }: BudgetTabProps) {
  const [activeTradeOffs, setActiveTradeOffs] = useState<string[]>([]);

  const toggleTradeOff = (id: string) => {
    setActiveTradeOffs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Compute live simulated savings strictly in TypeScript
  const simulatedSavings = summary.tradeOffs
    .filter((t) => activeTradeOffs.includes(t.id))
    .reduce((acc, curr) => acc + curr.estimatedSavings, 0);

  const adjustedRemaining = summary.remainingBudget + simulatedSavings;

  // Chart data
  const chartData = summary.categories
    .filter((cat) => cat.allocatedAmount > 0)
    .map((cat) => ({
      name: cat.name,
      value: cat.allocatedAmount,
      color: CATEGORY_COLORS[cat.category] || "#8884d8",
      spent: cat.spentAmount,
    }));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget Card */}
        <div className="rounded-2xl border border-parchment-200 bg-white p-5 shadow-warm">
          <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
            Total Budget
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display text-2xl font-bold text-ink">
              {formatINR(summary.totalBudget)}
            </span>
          </div>
          <p className="text-xs text-ink-muted mt-2">
            Cost per head: <span className="font-semibold text-ink">{formatINR(summary.costPerHead)}</span> ({summary.guestCount} guests)
          </p>
        </div>

        {/* Spent Amount Card */}
        <div className="rounded-2xl border border-parchment-200 bg-white p-5 shadow-warm">
          <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
            Total Spent / Locked
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display text-2xl font-bold text-ink">
              {formatINR(summary.totalSpent)}
            </span>
          </div>
          <div className="w-full bg-parchment-100 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                summary.totalSpent > summary.totalBudget ? "bg-red-500" : "bg-oxblood"
              }`}
              style={{
                width: `${Math.min(100, Math.round((summary.totalSpent / summary.totalBudget) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* Remaining Budget Card */}
        <div className="rounded-2xl border border-parchment-200 bg-white p-5 shadow-warm">
          <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
            Remaining Float
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`font-display text-2xl font-bold ${adjustedRemaining < 0 ? "text-red-700" : "text-sage-700"}`}>
              {formatINR(adjustedRemaining)}
            </span>
          </div>
          {simulatedSavings > 0 && (
            <span className="inline-block mt-2 text-[11px] font-medium text-sage-700 bg-sage-50 px-2 py-0.5 rounded border border-sage-200">
              +{formatINR(simulatedSavings)} from active trade-offs
            </span>
          )}
        </div>

        {/* Health Status Card */}
        <div className="rounded-2xl border border-parchment-200 bg-white p-5 shadow-warm">
          <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
            Budget Health
          </span>
          <div className="mt-1 flex items-center gap-2">
            {summary.health === "HEALTHY" && (
              <div className="flex items-center gap-1.5 text-sage-800">
                <ShieldCheck className="h-5 w-5 text-sage-600" />
                <span className="font-display text-xl font-bold">Healthy</span>
              </div>
            )}
            {summary.health === "TIGHT" && (
              <div className="flex items-center gap-1.5 text-amber-800">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <span className="font-display text-xl font-bold">Tight Buffer</span>
              </div>
            )}
            {summary.health === "OVERRUN" && (
              <div className="flex items-center gap-1.5 text-red-800">
                <AlertOctagon className="h-5 w-5 text-red-600" />
                <span className="font-display text-xl font-bold">Over Budget</span>
              </div>
            )}
          </div>
          {summary.overrunAmount > 0 && (
            <p className="text-xs text-red-600 font-semibold mt-2">
              Overrun by {formatINR(summary.overrunAmount)}!
            </p>
          )}
        </div>
      </div>

      {/* Main Budget Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart */}
        <div className="rounded-2xl border border-parchment-200 bg-white p-6 shadow-warm flex flex-col items-center justify-center">
          <h3 className="font-display text-lg font-bold text-ink self-start mb-2">
            Category Percent Distribution
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number | string | Array<number | string> | undefined) => [
                    formatINR(typeof val === "number" ? val : Number(val) || 0),
                    "Allocated",
                  ]}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "0.75rem",
                    border: "1px solid #E5E7EB",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <span className="text-xs text-ink-muted text-center mt-2">
            Hover over donut slices to inspect category allocations
          </span>
        </div>

        {/* Detailed Category Allocations & Spent List */}
        <div className="lg:col-span-2 rounded-2xl border border-parchment-200 bg-white p-6 shadow-warm space-y-4">
          <h3 className="font-display text-lg font-bold text-ink">
            Category Spent vs Allocated
          </h3>

          <div className="space-y-3.5 divide-y divide-parchment-100">
            {summary.categories.map((cat) => {
              const spentPercent =
                cat.allocatedAmount > 0
                  ? Math.min(100, Math.round((cat.spentAmount / cat.allocatedAmount) * 100))
                  : 0;

              return (
                <div key={cat.category} className="pt-3 first:pt-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-ink flex items-center gap-1.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full inline-block"
                        style={{ backgroundColor: CATEGORY_COLORS[cat.category] || "#666" }}
                      />
                      {cat.name} ({cat.percentageOfTotal}%)
                    </span>
                    <span className="text-ink-secondary">
                      <span className="font-semibold text-ink">{formatINR(cat.spentAmount)}</span> / {formatINR(cat.allocatedAmount)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-parchment-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        cat.isOverrun ? "bg-red-500" : "bg-oxblood"
                      }`}
                      style={{ width: `${spentPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Where Can I Save? Trade-Offs (Must-Have Feature 2) */}
      <div className="rounded-2xl border border-parchment-200 bg-white p-6 shadow-warm">
        <div className="flex items-center gap-2 mb-2">
          <TrendingDown className="h-5 w-5 text-oxblood" />
          <h3 className="font-display text-lg font-bold text-ink">
            Where Can I Save? — 3 Code-Computed Trade-Offs
          </h3>
        </div>
        <p className="text-xs text-ink-muted mb-4">
          Rupee impacts are deterministically calculated by our TypeScript engine based on your exact guest count ({summary.guestCount}) and budget ratios. Click to simulate savings on your remaining buffer.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summary.tradeOffs.map((tradeOff) => {
            const isActive = activeTradeOffs.includes(tradeOff.id);
            return (
              <div
                key={tradeOff.id}
                onClick={() => toggleTradeOff(tradeOff.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? "bg-sage-50/60 border-sage-400 ring-2 ring-sage-400/20"
                    : "bg-parchment-50/60 border-parchment-200 hover:border-parchment-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-oxblood">
                      {tradeOff.category}
                    </span>
                    <span className="font-display text-base font-bold text-sage-700">
                      Save {formatINR(tradeOff.estimatedSavings)}
                    </span>
                  </div>
                  <h4 className="font-display text-sm font-bold text-ink mt-1.5">
                    {tradeOff.title}
                  </h4>
                  <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
                    {tradeOff.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-parchment-200 flex items-center justify-between text-xs">
                  <span className="text-ink-muted font-medium">Simulate Trade-off</span>
                  <div
                    className={`h-5 w-5 rounded-md flex items-center justify-center border transition-colors ${
                      isActive ? "bg-sage-600 border-sage-600 text-white" : "border-parchment-300 bg-white"
                    }`}
                  >
                    {isActive && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
