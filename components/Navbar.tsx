"use client";

import Link from "next/link";
import { Sparkles, Calendar, PlusCircle, ShieldAlert, WifiOff } from "lucide-react";

interface NavbarProps {
  isOffline?: boolean;
  onOpenIntake?: () => void;
  eventTitle?: string;
  eventType?: string;
}

export function Navbar({ isOffline = false, onOpenIntake, eventTitle, eventType }: NavbarProps) {
  // Theme badge styling
  const badgeColor =
    eventType === "WEDDING"
      ? "bg-oxblood-50 text-oxblood-800 border-oxblood-200"
      : eventType === "BIRTHDAY"
      ? "bg-rose-50 text-rose-800 border-rose-200"
      : "bg-teal-50 text-teal-800 border-teal-200";

  return (
    <header className="no-print sticky top-0 z-40 w-full border-b border-parchment-200 bg-parchment-50/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-oxblood text-marigold-300 shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold tracking-tight text-oxblood">
                  EventSense
                </span>
                <span className="rounded bg-marigold-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-marigold-800">
                  Jashn
                </span>
              </div>
              <p className="text-[11px] text-ink-muted">GenAI Celebration Assistant</p>
            </div>
          </Link>

          {eventTitle && (
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-parchment-300 ml-4">
              <span className="text-xs text-ink-muted font-medium">Active:</span>
              <span className="text-xs font-semibold text-ink truncate max-w-[200px]">
                {eventTitle}
              </span>
              {eventType && (
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${badgeColor}`}>
                  {eventType}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Offline Mode Badge (Rule 5) */}
          {isOffline && (
            <div
              className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 border border-amber-200"
              title="Running on local deterministic celebration templates (free-tier guard active)"
            >
              <WifiOff className="h-3.5 w-3.5 text-amber-600" />
              <span>Offline Mode</span>
            </div>
          )}

          {onOpenIntake && (
            <button
              onClick={onOpenIntake}
              className="inline-flex items-center gap-1.5 rounded-lg bg-oxblood px-3.5 py-2 text-xs font-semibold text-parchment-50 shadow-warm transition-all duration-150 hover:bg-oxblood-600 focus:outline-none focus:ring-2 focus:ring-oxblood focus:ring-offset-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>New Celebration</span>
            </button>
          )}

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-parchment-300 bg-white px-3 py-2 text-xs font-medium text-ink-secondary hover:bg-parchment-100 transition-colors"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>All Events</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
