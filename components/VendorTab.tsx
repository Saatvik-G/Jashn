"use client";

import { useState } from "react";
import { formatINR } from "@/lib/engine/budget";
import {
  Users,
  CheckSquare,
  AlertTriangle,
  Send,
  Sliders,
  FileText,
  Star,
  Copy,
  Check,
  X,
  Loader2,
} from "lucide-react";

interface VendorQuoteData {
  id: string;
  vendorName: string;
  contactPerson?: string | null;
  contactInfo?: string | null;
  quotedAmount: number;
  status: string;
  weightedScore: number;
  criteriaScores?: string | null;
  notes?: string | null;
}

interface VendorCategoryData {
  id: string;
  category: string;
  checklistJson: string;
  quotes: VendorQuoteData[];
}

interface VendorTabProps {
  categories: VendorCategoryData[];
  eventType: string;
  location: string;
}

export function VendorTab({ categories, eventType, location }: VendorTabProps) {
  // Tunable scoring weights
  const [pricingWeight, setPricingWeight] = useState(40);
  const [qualityWeight, setQualityWeight] = useState(40);
  const [responsivenessWeight, setResponsivenessWeight] = useState(20);

  // Outreach Modal state
  const [isOutreachOpen, setIsOutreachOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [outreachData, setOutreachData] = useState<{
    whatsAppMessage: string;
    formalEmailSubject: string;
    formalEmailBody: string;
    negotiationTips: string[];
    redFlagsToWatch: string[];
  } | null>(null);

  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Calculate dynamic weighted score for a quote based on user's sliders
  const calculateDynamicScore = (criteriaJson?: string | null, quotedAmount?: number) => {
    if (!criteriaJson) return 8.0;
    try {
      const scores = JSON.parse(criteriaJson);
      const priceScore = scores.pricing || 8;
      const qualScore = scores.quality || 8;
      const respScore = scores.responsiveness || 8;

      const totalWeight = pricingWeight + qualityWeight + responsivenessWeight;
      const weighted =
        (priceScore * pricingWeight +
          qualScore * qualityWeight +
          respScore * responsivenessWeight) /
        totalWeight;

      return Number(weighted.toFixed(1));
    } catch {
      return 8.0;
    }
  };

  const handleOpenOutreach = async (catName: string) => {
    setSelectedCategory(catName);
    setIsOutreachOpen(true);
    setIsGenerating(true);
    setOutreachData(null);

    try {
      const res = await fetch("/api/vendors/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: catName, eventType, location }),
      });
      const json = await res.json();
      setOutreachData(json.data);
    } catch (err) {
      console.error("Outreach generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Weighted Quote Scoring Header */}
      <div className="rounded-2xl border border-parchment-200 bg-white p-6 shadow-warm">
        <div className="flex items-center gap-2 mb-2">
          <Sliders className="h-5 w-5 text-oxblood" />
          <h3 className="font-display text-lg font-bold text-ink">
            Tunable Quote Comparison Weights
          </h3>
        </div>
        <p className="text-xs text-ink-muted mb-6">
          Adjust the priority sliders below. Scores for all vendor quotes re-calculate dynamically in real time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-parchment-50 p-4 rounded-xl border border-parchment-200">
          <div>
            <div className="flex justify-between text-xs font-semibold text-ink mb-1.5">
              <span>Pricing & Value</span>
              <span className="text-oxblood font-bold">{pricingWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              value={pricingWeight}
              onChange={(e) => setPricingWeight(Number(e.target.value))}
              className="w-full accent-oxblood"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-ink mb-1.5">
              <span>Quality & Experience</span>
              <span className="text-oxblood font-bold">{qualityWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              value={qualityWeight}
              onChange={(e) => setQualityWeight(Number(e.target.value))}
              className="w-full accent-oxblood"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-ink mb-1.5">
              <span>Responsiveness</span>
              <span className="text-oxblood font-bold">{responsivenessWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={responsivenessWeight}
              onChange={(e) => setResponsivenessWeight(Number(e.target.value))}
              className="w-full accent-oxblood"
            />
          </div>
        </div>
      </div>

      {/* Categories & Quotes */}
      <div className="space-y-6">
        {categories.map((cat) => {
          let questions: string[] = [];
          try {
            questions = JSON.parse(cat.checklistJson);
          } catch {
            questions = ["Verify contract terms and backup contingencies."];
          }

          return (
            <div
              key={cat.id}
              className="rounded-2xl border border-parchment-200 bg-white p-6 shadow-warm space-y-6"
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-parchment-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-oxblood">
                    Vendor Category
                  </span>
                  <h3 className="font-display text-xl font-bold text-ink mt-0.5">
                    {cat.category}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenOutreach(cat.category)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-oxblood-50 border border-oxblood-200 px-3.5 py-2 text-xs font-semibold text-oxblood hover:bg-oxblood-100 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Draft Outreach (WhatsApp/Email)</span>
                </button>
              </div>

              {/* Checklist Section */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2.5 flex items-center gap-1.5">
                  <CheckSquare className="h-4 w-4 text-marigold-600" />
                  Essential Vetting Questions & Contract Must-Haves
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2.5 rounded-lg bg-parchment-50 border border-parchment-200 text-ink-secondary"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-marigold-500 mt-1.5 shrink-0" />
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quotes Section */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2.5 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-sage-600" />
                  Received Quotes & Weighted Ranking
                </h4>

                {cat.quotes.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-parchment-300 text-xs text-ink-muted text-center">
                    No vendor quotes entered yet. Click &quot;Draft Outreach&quot; to reach out to vendors.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cat.quotes.map((quote) => {
                      const dynamicScore = calculateDynamicScore(
                        quote.criteriaScores,
                        quote.quotedAmount
                      );

                      return (
                        <div
                          key={quote.id}
                          className="p-4 rounded-xl border border-parchment-200 bg-white hover:border-parchment-300 transition-all flex flex-col justify-between shadow-sm"
                        >
                          <div>
                            <div className="flex items-start justify-between">
                              <div>
                                <h5 className="font-display text-sm font-bold text-ink">
                                  {quote.vendorName}
                                </h5>
                                {quote.contactPerson && (
                                  <span className="text-[11px] text-ink-muted">
                                    {quote.contactPerson} • {quote.contactInfo}
                                  </span>
                                )}
                              </div>

                              {/* Weighted Score Badge */}
                              <div className="flex items-center gap-1 rounded-lg bg-sage-50 border border-sage-200 px-2 py-1 text-sage-800 text-xs font-bold">
                                <Star className="h-3.5 w-3.5 fill-sage-600 text-sage-600" />
                                <span>{dynamicScore} / 10</span>
                              </div>
                            </div>

                            <div className="mt-3 text-lg font-display font-bold text-oxblood">
                              {formatINR(quote.quotedAmount)}
                            </div>

                            {quote.notes && (
                              <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
                                {quote.notes}
                              </p>
                            )}
                          </div>

                          <div className="mt-4 pt-3 border-t border-parchment-100 flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-ink-muted uppercase">
                              Status: {quote.status}
                            </span>
                            <span className="text-oxblood font-semibold">Verified Quote</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Outreach Generator Modal */}
      {isOutreachOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-parchment-200 p-6 sm:p-8 shadow-warm-lg max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsOutreachOpen(false)}
              className="absolute top-5 right-5 text-ink-muted hover:text-ink p-1"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-oxblood">
                Vendor Outreach Assistant
              </span>
              <h3 className="font-display text-xl font-bold text-ink mt-0.5">
                Inquiry Drafts for {selectedCategory}
              </h3>
              <p className="text-xs text-ink-muted mt-1">
                Generated with privacy placeholders. Copy and personalize on your own device.
              </p>
            </div>

            {isGenerating ? (
              <div className="p-12 text-center text-ink-muted">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-oxblood mb-2" />
                <span className="text-xs">Drafting professional inquiry & negotiation tips...</span>
              </div>
            ) : outreachData ? (
              <div className="space-y-5 text-xs">
                {/* WhatsApp Message */}
                <div className="rounded-xl border border-parchment-200 bg-parchment-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-ink flex items-center gap-1.5 text-xs">
                      💬 Ready-to-Send WhatsApp Inquiry
                    </span>
                    <button
                      onClick={() => copyToClipboard(outreachData.whatsAppMessage, "whatsapp")}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-oxblood hover:underline"
                    >
                      {copiedType === "whatsapp" ? <Check className="h-3.5 w-3.5 text-sage-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedType === "whatsapp" ? "Copied!" : "Copy WhatsApp"}</span>
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-xs text-ink-secondary leading-relaxed bg-white p-3 rounded-lg border border-parchment-200">
                    {outreachData.whatsAppMessage}
                  </pre>
                </div>

                {/* Email Subject & Body */}
                <div className="rounded-xl border border-parchment-200 bg-parchment-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-ink flex items-center gap-1.5 text-xs">
                      ✉️ Formal Email Inquiry
                    </span>
                    <button
                      onClick={() => copyToClipboard(`${outreachData.formalEmailSubject}\n\n${outreachData.formalEmailBody}`, "email")}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-oxblood hover:underline"
                    >
                      {copiedType === "email" ? <Check className="h-3.5 w-3.5 text-sage-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedType === "email" ? "Copied!" : "Copy Email"}</span>
                    </button>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-parchment-200 space-y-2">
                    <p className="font-semibold text-ink">
                      Subject: {outreachData.formalEmailSubject}
                    </p>
                    <pre className="whitespace-pre-wrap font-sans text-xs text-ink-secondary leading-relaxed pt-2 border-t border-parchment-100">
                      {outreachData.formalEmailBody}
                    </pre>
                  </div>
                </div>

                {/* Negotiation Tips & Red Flags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-sage-200 bg-sage-50/50 p-3.5">
                    <span className="font-bold text-sage-900 block mb-1.5">
                      💡 Negotiation Tips
                    </span>
                    <ul className="space-y-1 list-disc list-inside text-sage-800 text-[11px]">
                      {outreachData.negotiationTips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5">
                    <span className="font-bold text-amber-900 block mb-1.5">
                      🚩 Red Flags to Watch
                    </span>
                    <ul className="space-y-1 list-disc list-inside text-amber-800 text-[11px]">
                      {outreachData.redFlagsToWatch.map((flag, i) => (
                        <li key={i}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
