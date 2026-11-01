"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, AlertTriangle, ArrowRight, Loader2, X, CheckCircle2 } from "lucide-react";
import { IntakeParseResult } from "@/lib/gemini/schemas";
import { formatINR } from "@/lib/engine/budget";

interface IntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_PROMPTS = [
  "Grand heritage wedding in Jaipur in Nov 2027, around 12 lakh budget, 150 guests.",
  "Aarav's 7th space explorer birthday in Bangalore, 45 kids and parents, budget 45K next month.",
  "Gulmohar Enclave Diwali Mela in Delhi, 400 families, 3.5 lakh budget with stage and prasad.",
  "Big wedding in Nov, around 2 lakh, 500 guests (Test contradiction flag)",
];

export function IntakeModal({ isOpen, onClose }: IntakeModalProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [parseResult, setParseResult] = useState<IntakeParseResult | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [offlineNotice, setOfflineNotice] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!prompt.trim() || prompt.length < 5) return;
    setIsLoading(true);
    setErrorMessage(null);
    setParseResult(null);

    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to analyze celebration details");
      }

      setParseResult(json.data);
      setIsOffline(json.isOffline);
      setOfflineNotice(json.offlineReason || null);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!parseResult) return;
    setIsCreating(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: parseResult.title,
          eventType: parseResult.eventType,
          guestCount: parseResult.guestCount,
          totalBudget: parseResult.totalBudget,
          eventDate: parseResult.eventDate,
          location: parseResult.location,
          theme: parseResult.theme,
          notes: parseResult.notes,
        }),
      });

      const newEvent = await res.json();
      if (!res.ok) throw new Error(newEvent.error || "Failed to create event plan");

      onClose();
      router.push(`/events/${newEvent.id}`);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to persist celebration");
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-parchment-200 p-6 sm:p-8 shadow-warm-lg max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-ink-muted hover:text-ink transition-colors p-1"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-oxblood-50 border border-oxblood-200 px-3 py-1 mb-2.5">
            <Sparkles className="h-4 w-4 text-oxblood" />
            <span className="text-xs font-semibold text-oxblood tracking-wide uppercase">
              AI Event Intake
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold text-ink">Describe Your Celebration</h2>
          <p className="text-sm text-ink-secondary mt-1">
            Tell EventSense about your event in plain language (type, guests, budget, location, date). We’ll extract parameters and compute your plan deterministically.
          </p>
        </div>

        {/* Prompt Input */}
        <div className="space-y-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Planning a grand traditional wedding in Jaipur for 150 guests in December, budget is around 12 lakh..."
            className="w-full h-28 rounded-xl border border-parchment-300 p-3.5 text-sm text-ink placeholder:text-ink-muted focus:border-oxblood focus:outline-none focus:ring-2 focus:ring-oxblood/20 resize-none transition-colors"
          />

          {/* Quick Prompts */}
          <div>
            <span className="text-xs font-medium text-ink-muted">Try a sample prompt:</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {SAMPLE_PROMPTS.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPrompt(sample)}
                  className="rounded-lg bg-parchment-100 hover:bg-parchment-200 px-2.5 py-1 text-xs text-ink-secondary transition-colors text-left"
                >
                  {sample.length > 50 ? `${sample.slice(0, 48)}...` : sample}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs text-ink-muted">
            {isOffline && "✨ Offline Mode active"}
          </span>
          <button
            onClick={handleAnalyze}
            disabled={isLoading || prompt.trim().length < 5}
            className="inline-flex items-center gap-2 rounded-xl bg-oxblood px-5 py-2.5 text-sm font-semibold text-parchment-50 shadow-warm hover:bg-oxblood-600 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing Celebration...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Analyze & Plan</span>
              </>
            )}
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
            {errorMessage}
          </div>
        )}

        {/* Offline notice */}
        {offlineNotice && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{offlineNotice}</span>
          </div>
        )}

        {/* Parsed Plan Review / Contradiction Flag */}
        {parseResult && (
          <div className="mt-6 pt-6 border-t border-parchment-200 space-y-4 animate-fadeIn">
            {/* Contradiction Warning (Must-Have Feature 1) */}
            {parseResult.isContradiction ? (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-900">
                      Feasibility Warning & Contradiction Detected
                    </h4>
                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                      {parseResult.contradictionReason}
                    </p>

                    {parseResult.clarifyingQuestions && parseResult.clarifyingQuestions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-amber-200/80">
                        <span className="text-xs font-semibold text-amber-900">
                          Recommended Clarifications:
                        </span>
                        <ul className="mt-1 space-y-1 text-xs text-amber-800 list-disc list-inside">
                          {parseResult.clarifyingQuestions.map((q, idx) => (
                            <li key={idx}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-sage-200 bg-sage-50 p-3.5 flex items-center gap-2 text-xs text-sage-800">
                <CheckCircle2 className="h-4 w-4 text-sage-600 shrink-0" />
                <span>Plan parameters verified! Budget per head aligns with celebration standards.</span>
              </div>
            )}

            {/* Extracted Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-parchment-50 p-4 rounded-xl border border-parchment-200 text-xs">
              <div>
                <span className="text-ink-muted">Event Type</span>
                <p className="font-semibold text-ink mt-0.5">{parseResult.eventType}</p>
              </div>
              <div>
                <span className="text-ink-muted">Expected Headcount</span>
                <p className="font-semibold text-ink mt-0.5">{parseResult.guestCount} Guests</p>
              </div>
              <div>
                <span className="text-ink-muted">Total Budget</span>
                <p className="font-semibold text-oxblood mt-0.5">{formatINR(parseResult.totalBudget)}</p>
              </div>
              <div>
                <span className="text-ink-muted">Cost Per Head</span>
                <p className="font-semibold text-ink mt-0.5">
                  {formatINR(Math.round(parseResult.totalBudget / parseResult.guestCount))}
                </p>
              </div>
            </div>

            {/* Confirm Generation Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleCreateEvent}
                disabled={isCreating}
                className="inline-flex items-center gap-2 rounded-xl bg-oxblood px-6 py-2.5 text-sm font-semibold text-parchment-50 shadow-warm hover:bg-oxblood-600 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating Deterministic Plan...</span>
                  </>
                ) : (
                  <>
                    <span>{parseResult.isContradiction ? "Proceed Anyway & Generate Plan" : "Generate Editable Celebration Plan"}</span>
                    <ArrowRight className="h-4 w-4" />
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
