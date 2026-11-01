"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { BudgetTab } from "@/components/BudgetTab";
import { TimelineTab } from "@/components/TimelineTab";
import { VendorTab } from "@/components/VendorTab";
import { IdeasTab } from "@/components/IdeasTab";
import { ReplanDrawer } from "@/components/ReplanDrawer";
import { ShareModal } from "@/components/ShareModal";
import { formatINR } from "@/lib/engine/budget";
import { BudgetSummary, TimelineSummary } from "@/lib/engine/types";
import {
  Calendar,
  Users,
  MapPin,
  Sparkles,
  Share2,
  Printer,
  Download,
  SlidersHorizontal,
  ChevronLeft,
  ArrowRight,
  Loader2,
  Trash2,
} from "lucide-react";

export default function EventWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [data, setData] = useState<{
    event: any;
    budgetSummary: BudgetSummary;
    timelineSummary: TimelineSummary;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"BUDGET" | "TIMELINE" | "VENDORS" | "IDEAS">("BUDGET");
  const [isReplanOpen, setIsReplanOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.event) setData(json);
      })
      .catch((err) => console.error("Failed to load celebration:", err))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment-50">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-oxblood mx-auto" />
          <p className="text-xs text-ink-muted font-medium">
            Loading Celebration Workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!data || !data.event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment-50 p-4">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="font-display text-2xl font-bold text-ink">Celebration Not Found</h2>
          <p className="text-xs text-ink-muted">
            The requested celebration plan could not be located in the local database.
          </p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-oxblood px-4 py-2 text-xs font-semibold text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  const { event, budgetSummary, timelineSummary } = data;
  const eventDateStr = new Date(event.eventDate).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Navbar
        eventTitle={event.title}
        eventType={event.eventType}
      />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Workspace Top Header Card */}
        <section className="rounded-3xl border border-parchment-200 bg-white p-6 sm:p-8 shadow-warm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
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

              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
                {event.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-ink-muted pt-1">
                <span className="flex items-center gap-1.5 font-medium text-ink">
                  <Calendar className="h-4 w-4 text-oxblood" />
                  <span>{eventDateStr}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium text-ink">
                  <Users className="h-4 w-4 text-oxblood" />
                  <span>{event.guestCount} Guests</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium text-ink">
                  <MapPin className="h-4 w-4 text-oxblood" />
                  <span>{event.location}</span>
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="no-print flex flex-wrap items-center gap-2.5">
              {/* Replan Button (Must-Have Feature 5) */}
              <button
                type="button"
                onClick={() => setIsReplanOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-oxblood px-4 py-2.5 text-xs font-semibold text-parchment-50 shadow-warm hover:bg-oxblood-600 transition-all cursor-pointer"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Replan Plan</span>
              </button>

              {/* ICS Export (Stretch Feature) */}
              <a
                href={`/api/events/${event.id}/export/ics`}
                download
                className="inline-flex items-center gap-1.5 rounded-xl border border-parchment-300 bg-white px-3 py-2.5 text-xs font-semibold text-ink-secondary hover:bg-parchment-100 transition-colors"
                title="Download .ics calendar with all backward milestones"
              >
                <Download className="h-4 w-4" />
                <span>Export .ics</span>
              </a>

              {/* Print View (Stretch Feature) */}
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-parchment-300 bg-white px-3 py-2.5 text-xs font-semibold text-ink-secondary hover:bg-parchment-100 transition-colors"
                title="Print celebration summary / save to PDF"
              >
                <Printer className="h-4 w-4" />
                <span>Print / PDF</span>
              </button>

              {/* Share Link (Stretch Feature) */}
              <button
                type="button"
                onClick={() => setIsShareOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-parchment-300 bg-white px-3 py-2.5 text-xs font-semibold text-ink-secondary hover:bg-parchment-100 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>Share Link</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="no-print mt-8 flex border-b border-parchment-200 gap-6 text-sm">
            {[
              { id: "BUDGET", label: "📊 Budget & Trade-Offs" },
              { id: "TIMELINE", label: "⏱️ Timeline & Schedule" },
              { id: "VENDORS", label: "🤝 Vendors & Quotes" },
              { id: "IDEAS", label: "💡 Ideas & Menus" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 font-semibold transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-oxblood text-oxblood"
                    : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Tab Content Display */}
        <section>
          {activeTab === "BUDGET" && (
            <BudgetTab summary={budgetSummary} eventType={event.eventType} />
          )}

          {activeTab === "TIMELINE" && (
            <TimelineTab summary={timelineSummary} eventId={event.id} />
          )}

          {activeTab === "VENDORS" && (
            <VendorTab
              categories={event.vendorCategories || []}
              eventType={event.eventType}
              location={event.location}
            />
          )}

          {activeTab === "IDEAS" && (
            <IdeasTab ideas={event.ideas || []} eventId={event.id} />
          )}
        </section>
      </main>

      {/* Modals & Drawers */}
      <ReplanDrawer
        eventId={event.id}
        isOpen={isReplanOpen}
        onClose={() => setIsReplanOpen(false)}
        currentGuestCount={event.guestCount}
        currentTotalBudget={event.totalBudget}
        currentEventDate={event.eventDate.toString().split("T")[0]}
      />

      <ShareModal
        eventId={event.id}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        existingToken={event.shareToken}
        existingExpiry={event.shareTokenExpiry}
      />
    </>
  );
}
