"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { IntakeModal } from "@/components/IntakeModal";
import { formatINR } from "@/lib/engine/budget";
import {
  Sparkles,
  Calendar,
  Users,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  PlusCircle,
  Clock,
  HeartHandshake,
} from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  totalBudget: number;
  location: string;
  theme?: string | null;
  notes?: string | null;
}

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
      })
      .catch((err) => console.error("Failed to load events:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <Navbar onOpenIntake={() => setIsIntakeOpen(true)} />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Editorial Hero Section */}
        <section className="relative rounded-3xl border border-parchment-200 bg-gradient-to-b from-white to-parchment-50 p-8 sm:p-12 shadow-warm overflow-hidden">
          {/* Subtle decorative filigree background */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-marigold-100/40 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-oxblood-100/30 blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-oxblood-50 border border-oxblood-200 px-3.5 py-1 text-xs font-semibold text-oxblood">
              <Sparkles className="h-3.5 w-3.5 text-oxblood" />
              <span>Free-Tier GenAI Celebration Planner</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-ink leading-tight">
              Where Festivities Meet <span className="text-oxblood italic">Flawless Math</span>.
            </h1>

            <p className="text-base sm:text-lg text-ink-secondary leading-relaxed">
              Describe your Indian wedding, milestone birthday, or residential festival in plain language. EventSense generates an editable plan with pure deterministic budgeting, backward timeline schedules, quote comparisons, and visible replan diffs.
            </p>

            {/* Hero CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsIntakeOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-oxblood px-6 py-3.5 text-sm font-semibold text-parchment-50 shadow-warm hover:bg-oxblood-600 transition-all cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Start New Celebration Intake</span>
              </button>

              <a
                href="#demo-events"
                className="inline-flex items-center gap-2 rounded-xl border border-parchment-300 bg-white px-5 py-3.5 text-sm font-semibold text-ink-secondary hover:bg-parchment-100 transition-colors"
              >
                <span>Explore Seed Events</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Security & Architectural Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-ink-muted">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-sage-600" />
                Deterministic Arithmetic (Zero AI Hallucinations)
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Lock className="h-4 w-4 text-oxblood" />
                Client-Side PII Scrubbing
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-4 w-4 text-marigold-600" />
                Offline-Ready Fallbacks
              </span>
            </div>
          </div>
        </section>

        {/* Demo Celebrations Section */}
        <section id="demo-events" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-parchment-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-oxblood">
                Active Celebrations
              </span>
              <h2 className="font-display text-2xl font-bold text-ink mt-0.5">
                Your Event Plans & Seed Demonstrations
              </h2>
            </div>
            <span className="text-xs text-ink-muted">
              {events.length} celebrations configured in local SQLite database
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-64 rounded-2xl bg-parchment-100 animate-pulse border border-parchment-200"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => {
                const dateObj = new Date(event.eventDate);
                const formattedDate = dateObj.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                const badgeColor =
                  event.eventType === "WEDDING"
                    ? "bg-oxblood-50 text-oxblood border-oxblood-200"
                    : event.eventType === "BIRTHDAY"
                    ? "bg-rose-50 text-rose-800 border-rose-200"
                    : "bg-teal-50 text-teal-800 border-teal-200";

                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="group rounded-2xl border border-parchment-200 bg-white p-6 shadow-warm hover:shadow-warm-lg hover:border-oxblood/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}
                        >
                          {event.eventType}
                        </span>
                        <span className="text-xs font-semibold text-oxblood">
                          {formatINR(event.totalBudget)}
                        </span>
                      </div>

                      <h3 className="font-display text-lg font-bold text-ink mt-3 group-hover:text-oxblood transition-colors line-clamp-1">
                        {event.title}
                      </h3>

                      <p className="text-xs text-ink-muted mt-1 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-ink-muted" />
                        <span>{formattedDate}</span>
                        <span>•</span>
                        <Users className="h-3.5 w-3.5 text-ink-muted" />
                        <span>{event.guestCount} Guests</span>
                      </p>

                      <p className="text-xs text-ink-secondary mt-3 line-clamp-2 leading-relaxed">
                        {event.notes || event.location}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-parchment-100 flex items-center justify-between text-xs font-semibold text-oxblood">
                      <span>Open Workspace</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <IntakeModal isOpen={isIntakeOpen} onClose={() => setIsIntakeOpen(false)} />
    </>
  );
}
