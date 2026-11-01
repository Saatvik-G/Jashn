"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/engine/budget";
import { BudgetSummary, TimelineSummary } from "@/lib/engine/types";
import {
  Sparkles,
  Calendar,
  Users,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Loader2,
  ArrowRight,
} from "lucide-react";

export default function SharedEventPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [data, setData] = useState<{
    event: any;
    budgetSummary: BudgetSummary;
    timelineSummary: TimelineSummary;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/share/${token}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load shared event");
        setData(json);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment-50">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-oxblood mx-auto" />
          <p className="text-xs text-ink-muted">Loading Shared Celebration Plan...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment-50 p-4">
        <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-2xl border border-parchment-200 shadow-warm">
          <Lock className="h-10 w-10 text-oxblood mx-auto" />
          <h2 className="font-display text-xl font-bold text-ink">Link Inaccessible</h2>
          <p className="text-xs text-ink-muted">
            {error || "This read-only link has either expired or been revoked by the celebration organizer."}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-oxblood px-4 py-2 text-xs font-semibold text-white"
          >
            <span>Visit EventSense</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  const { event, budgetSummary, timelineSummary } = data;

  return (
    <div className="min-h-screen bg-parchment-50 pb-16">
      {/* Top Banner */}
      <div className="border-b border-parchment-200 bg-white py-3 px-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-sage-600" />
            <span className="font-semibold text-ink">
              Read-Only Celebration Projection (128-Bit Secure Link)
            </span>
          </div>
          <Link
            href="/"
            className="text-oxblood font-semibold hover:underline flex items-center gap-1"
          >
            <span>Powered by EventSense</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        {/* Main Event Card */}
        <section className="rounded-3xl border border-parchment-200 bg-white p-6 sm:p-8 shadow-warm space-y-4">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-oxblood-50 border border-oxblood-200 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-oxblood">
              {event.eventType}
            </span>
            {event.theme && (
              <span className="text-xs text-ink-muted flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-marigold-600" />
                <span>Theme: {event.theme}</span>
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl font-extrabold text-ink">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-ink-muted">
            <span className="flex items-center gap-1.5 text-ink font-medium">
              <Calendar className="h-4 w-4 text-oxblood" />
              <span>{event.eventDate}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-ink font-medium">
              <Users className="h-4 w-4 text-oxblood" />
              <span>{event.guestCount} Guests</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-ink font-medium">
              <MapPin className="h-4 w-4 text-oxblood" />
              <span>{event.location}</span>
            </span>
          </div>

          {event.notes && (
            <p className="text-xs text-ink-secondary pt-2 leading-relaxed border-t border-parchment-100">
              {event.notes}
            </p>
          )}
        </section>

        {/* Budget Overview */}
        <section className="rounded-2xl border border-parchment-200 bg-white p-6 shadow-warm space-y-4">
          <h3 className="font-display text-lg font-bold text-ink">
            Budget Allocation Summary
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-parchment-50 border border-parchment-200">
              <span className="text-[10px] text-ink-muted uppercase block">Total Budget</span>
              <span className="font-display text-lg font-bold text-oxblood">
                {formatINR(budgetSummary.totalBudget)}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-parchment-50 border border-parchment-200">
              <span className="text-[10px] text-ink-muted uppercase block">Cost Per Head</span>
              <span className="font-display text-lg font-bold text-ink">
                {formatINR(budgetSummary.costPerHead)}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-parchment-50 border border-parchment-200">
              <span className="text-[10px] text-ink-muted uppercase block">Budget Status</span>
              <span className="font-display text-lg font-bold text-sage-700">
                {budgetSummary.health}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {budgetSummary.categories.map((cat) => (
              <div
                key={cat.category}
                className="p-3 rounded-lg border border-parchment-200 flex items-center justify-between text-xs"
              >
                <span className="font-medium text-ink">{cat.name}</span>
                <span className="font-bold text-ink">{formatINR(cat.allocatedAmount)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline Schedule */}
        <section className="rounded-2xl border border-parchment-200 bg-white p-6 shadow-warm space-y-4">
          <h3 className="font-display text-lg font-bold text-ink">
            Celebration Milestones
          </h3>

          <div className="space-y-2">
            {timelineSummary.allTasks.map((t, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-parchment-200 bg-parchment-50/50 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-ink">{t.title}</span>
                  <p className="text-[11px] text-ink-muted mt-0.5">Due: {t.dueDate}</p>
                </div>
                <span className="text-[10px] font-bold text-oxblood bg-white border border-parchment-200 px-2 py-0.5 rounded">
                  {t.category}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
