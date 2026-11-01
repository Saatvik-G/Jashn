"use client";

import { useState } from "react";
import { formatINR } from "@/lib/engine/budget";
import { Sparkles, Plus, Check, Utensils, Palette, PartyPopper, Mail, Compass } from "lucide-react";

interface IdeaItemData {
  id: string;
  type: string;
  title: string;
  description: string;
  category: string;
  minCost: number;
  maxCost: number;
  isAdded: boolean;
}

interface IdeasTabProps {
  ideas: IdeaItemData[];
  eventId: string;
}

const TYPE_ICONS: Record<string, typeof Sparkles> = {
  THEME: Palette,
  MENU: Utensils,
  DECOR: Sparkles,
  ACTIVITY: PartyPopper,
  INVITATION: Mail,
};

export function IdeasTab({ ideas: initialIdeas, eventId }: IdeasTabProps) {
  const [ideas, setIdeas] = useState<IdeaItemData[]>(initialIdeas);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  const toggleAddToPlan = (ideaId: string) => {
    setIdeas((prev) =>
      prev.map((item) =>
        item.id === ideaId ? { ...item, isAdded: !item.isAdded } : item
      )
    );
  };

  const filteredIdeas =
    activeFilter === "ALL"
      ? ideas
      : ideas.filter((item) => item.type === activeFilter);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Filter Buttons */}
      <div className="rounded-2xl border border-parchment-200 bg-white p-6 shadow-warm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-oxblood" />
              <h3 className="font-display text-lg font-bold text-ink">
                Personalized Celebration Ideas & Menus
              </h3>
            </div>
            <p className="text-xs text-ink-muted mt-1">
              Curated concepts for themes, dietary menus (Jain/Vegan), interactive activities, and bespoke invites. Click &quot;Add to Plan&quot; to incorporate into your event.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 self-start">
            {["ALL", "THEME", "MENU", "DECOR", "ACTIVITY", "INVITATION"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setActiveFilter(type)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                  activeFilter === type
                    ? "bg-oxblood text-parchment-50"
                    : "bg-parchment-100 text-ink-secondary hover:bg-parchment-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIdeas.map((idea) => {
          const Icon = TYPE_ICONS[idea.type] || Compass;

          return (
            <div
              key={idea.id}
              className={`rounded-2xl border p-5 transition-all flex flex-col justify-between shadow-warm ${
                idea.isAdded
                  ? "bg-sage-50/40 border-sage-300 ring-1 ring-sage-300"
                  : "bg-white border-parchment-200 hover:border-parchment-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-parchment-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-oxblood">
                    <Icon className="h-3 w-3" />
                    <span>{idea.type}</span>
                  </span>

                  <span className="text-xs font-semibold text-ink-muted">
                    Affects: <span className="text-oxblood font-bold">{idea.category}</span>
                  </span>
                </div>

                <h4 className="font-display text-base font-bold text-ink mt-3">
                  {idea.title}
                </h4>

                <p className="text-xs text-ink-secondary mt-1.5 leading-relaxed">
                  {idea.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-parchment-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-ink-muted uppercase block">
                    Estimated Cost Range
                  </span>
                  <span className="font-display text-sm font-bold text-ink">
                    {formatINR(idea.minCost)} – {formatINR(idea.maxCost)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleAddToPlan(idea.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    idea.isAdded
                      ? "bg-sage-600 text-white hover:bg-sage-700"
                      : "bg-oxblood text-parchment-50 hover:bg-oxblood-600 shadow-sm"
                  }`}
                >
                  {idea.isAdded ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Added to Plan</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add to Plan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
