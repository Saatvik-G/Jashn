"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatINR } from "@/lib/engine/budget";
import { ReplanDiff } from "@/lib/engine/types";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  X,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  MessageSquare,
  Sliders,
  Check,
} from "lucide-react";

interface ReplanDrawerProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
  currentGuestCount: number;
  currentTotalBudget: number;
  currentEventDate: string;
}

export function ReplanDrawer({
  eventId,
  isOpen,
  onClose,
  currentGuestCount,
  currentTotalBudget,
  currentEventDate,
}: ReplanDrawerProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diffResult, setDiffResult] = useState<ReplanDiff | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick inputs
  const [customGuests, setCustomGuests] = useState<number>(currentGuestCount);
  const [customBudget, setCustomBudget] = useState<number>(currentTotalBudget);

  if (!isOpen) return null;

  const handleCalculateDiff = async (useDirectValues = false) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setDiffResult(null);

    try {
      const payload = useDirectValues
        ? { guestCount: customGuests, totalBudget: customBudget }
        : { prompt };

      const res = await fetch(`/api/events/${eventId}/replan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to calculate replan diff");

      setDiffResult(json.diff);
      setExplanation(json.explanation);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyDiff = async () => {
    if (!diffResult) return;
    setIsApplying(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/events/${eventId}/replan/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestCount: diffResult.guestCount.after,
          totalBudget: diffResult.totalBudget.after,
          eventDate: diffResult.eventDate?.after,
          categoryDeltas: diffResult.categoryDeltas.map((d) => ({
            category: d.category,
            afterAllocated: d.afterAllocated,
          })),
          newTasks: diffResult.newTasks.map((t) => ({
            title: t.title,
            category: t.category,
            dueDate: t.dueDate,
            offsetDays: t.offsetDays,
            priority: t.priority,
            isCriticalPath: t.isCriticalPath,
            notes: t.notes,
          })),
          reason: explanation || "Replanned via conversational assistant.",
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to apply plan changes");

      onClose();
      router.refresh();
      window.location.reload();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to commit changes");
      setIsApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white border border-parchment-200 p-6 sm:p-8 shadow-warm-lg max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-ink-muted hover:text-ink p-1"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-oxblood-50 border border-oxblood-200 px-3 py-1 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-oxblood" />
            <span className="text-xs font-semibold text-oxblood tracking-wide uppercase">
              AI Replanning & Diff Engine
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold text-ink">
            Replan Celebration & Inspect Changes
          </h2>
          <p className="text-xs text-ink-secondary mt-1">
            Tell EventSense what shifted (e.g. &quot;Guests increased from 150 to 220&quot; or &quot;Increase budget by 2 Lakh&quot;). No changes are applied without your explicit confirmation.
          </p>
        </div>

        {/* Replan Method Tabs: Conversational vs Direct Inputs */}
        <div className="space-y-4">
          <div className="rounded-xl border border-parchment-200 bg-parchment-50 p-4 space-y-3">
            <label className="text-xs font-bold text-ink flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-oxblood" />
              <span>Describe the change in plain language:</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. My maternal family RSVP'd yes, guests increased from 150 to 220..."
                className="flex-1 rounded-xl border border-parchment-300 bg-white px-3.5 py-2.5 text-xs text-ink placeholder:text-ink-muted focus:border-oxblood focus:outline-none focus:ring-1 focus:ring-oxblood"
              />
              <button
                type="button"
                onClick={() => handleCalculateDiff(false)}
                disabled={isAnalyzing || prompt.trim().length < 3}
                className="inline-flex items-center gap-1.5 rounded-xl bg-oxblood px-4 py-2.5 text-xs font-semibold text-parchment-50 shadow-sm hover:bg-oxblood-600 disabled:opacity-50 transition-colors"
              >
                {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                <span>Calculate Diff</span>
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] text-ink-muted self-center">Try:</span>
              {[
                "Guests increased from 150 to 220",
                "Increase total budget to 15 Lakh",
                "Reduce guest count to 100",
              ].map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setPrompt(s);
                  }}
                  className="rounded-md bg-white border border-parchment-200 px-2 py-0.5 text-[11px] text-ink-secondary hover:border-parchment-400"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
            {errorMessage}
          </div>
        )}

        {/* Visible Before / After Diff Modal (Must-Have Feature 5 & AI Rule 4) */}
        {diffResult && (
          <div className="mt-6 pt-6 border-t border-parchment-200 space-y-5 animate-fadeIn">
            {explanation && (
              <div className="p-3.5 rounded-xl bg-oxblood-50/70 border border-oxblood-200 text-xs text-oxblood-900 flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-oxblood shrink-0 mt-0.5" />
                <span>{explanation}</span>
              </div>
            )}

            {/* Side-by-Side Key Metric Diff */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Guests Diff */}
              <div className="rounded-xl border border-parchment-200 bg-white p-3.5 shadow-sm">
                <span className="text-[11px] font-semibold text-ink-muted uppercase">
                  Guest Headcount
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold text-ink-muted line-through">
                    {diffResult.guestCount.before}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-ink-muted" />
                  <span className="font-display text-lg font-bold text-ink">
                    {diffResult.guestCount.after}
                  </span>
                </div>
                {diffResult.guestCount.delta !== 0 && (
                  <span
                    className={`inline-flex items-center text-[11px] font-bold mt-1 ${
                      diffResult.guestCount.delta > 0 ? "text-amber-700" : "text-sage-700"
                    }`}
                  >
                    {diffResult.guestCount.delta > 0 ? "+" : ""}
                    {diffResult.guestCount.delta} Guests
                  </span>
                )}
              </div>

              {/* Total Budget Diff */}
              <div className="rounded-xl border border-parchment-200 bg-white p-3.5 shadow-sm">
                <span className="text-[11px] font-semibold text-ink-muted uppercase">
                  Total Budget
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold text-ink-muted line-through">
                    {formatINR(diffResult.totalBudget.before)}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-ink-muted" />
                  <span className="font-display text-lg font-bold text-oxblood">
                    {formatINR(diffResult.totalBudget.after)}
                  </span>
                </div>
                {diffResult.totalBudget.delta !== 0 && (
                  <span
                    className={`inline-flex items-center text-[11px] font-bold mt-1 ${
                      diffResult.totalBudget.delta > 0 ? "text-sage-700" : "text-amber-700"
                    }`}
                  >
                    {diffResult.totalBudget.delta > 0 ? "+" : ""}
                    {formatINR(diffResult.totalBudget.delta)}
                  </span>
                )}
              </div>

              {/* Cost Per Head Diff */}
              <div className="rounded-xl border border-parchment-200 bg-white p-3.5 shadow-sm">
                <span className="text-[11px] font-semibold text-ink-muted uppercase">
                  Cost Per Head
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold text-ink-muted line-through">
                    {formatINR(diffResult.costPerHead.before)}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-ink-muted" />
                  <span className="font-display text-lg font-bold text-ink">
                    {formatINR(diffResult.costPerHead.after)}
                  </span>
                </div>
                {diffResult.costPerHead.delta !== 0 && (
                  <span
                    className={`inline-flex items-center text-[11px] font-bold mt-1 ${
                      diffResult.costPerHead.delta < 0 ? "text-amber-700" : "text-sage-700"
                    }`}
                  >
                    {diffResult.costPerHead.delta > 0 ? "+" : ""}
                    {formatINR(diffResult.costPerHead.delta)} / guest
                  </span>
                )}
              </div>
            </div>

            {/* Warnings list */}
            {diffResult.warnings.length > 0 && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 space-y-1.5">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Important Rebalancing Notices & Warnings:
                </span>
                <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
                  {diffResult.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Injected Tasks */}
            {diffResult.newTasks.length > 0 && (
              <div className="rounded-xl border border-parchment-200 bg-white p-4">
                <span className="text-xs font-bold text-ink uppercase tracking-wider block mb-2">
                  New Recommended Tasks Generated:
                </span>
                <div className="space-y-2">
                  {diffResult.newTasks.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-parchment-50 border border-parchment-200 text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-ink">{t.title}</span>
                        <p className="text-[11px] text-ink-muted mt-0.5">{t.notes}</p>
                      </div>
                      <span className="text-[10px] font-bold text-oxblood bg-oxblood-50 px-2 py-0.5 rounded">
                        {t.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirmation Buttons (AI Rule 4: No change without user confirmation) */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-parchment-200">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-parchment-300 px-4 py-2.5 text-xs font-semibold text-ink-secondary hover:bg-parchment-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyDiff}
                disabled={isApplying}
                className="inline-flex items-center gap-2 rounded-xl bg-oxblood px-6 py-2.5 text-xs font-semibold text-parchment-50 shadow-warm hover:bg-oxblood-600 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isApplying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Committing Plan Updates...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Confirm & Apply Changes to Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
