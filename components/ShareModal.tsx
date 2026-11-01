"use client";

import { useState } from "react";
import { Share2, Copy, Check, ShieldCheck, Trash2, X, Loader2 } from "lucide-react";

interface ShareModalProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
  existingToken?: string | null;
  existingExpiry?: string | null;
}

export function ShareModal({
  eventId,
  isOpen,
  onClose,
  existingToken,
  existingExpiry,
}: ShareModalProps) {
  const [token, setToken] = useState<string | null>(existingToken || null);
  const [expiry, setExpiry] = useState<string | null>(existingExpiry || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl =
    typeof window !== "undefined" && token
      ? `${window.location.origin}/share/${token}`
      : "";

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/share`, { method: "POST" });
      const json = await res.json();
      setToken(json.shareToken);
      setExpiry(json.expiry);
    } catch (err) {
      console.error("Failed to generate share link:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevoke = async () => {
    setIsLoading(true);
    try {
      await fetch(`/api/events/${eventId}/share`, { method: "DELETE" });
      setToken(null);
      setExpiry(null);
    } catch (err) {
      console.error("Failed to revoke share link:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyUrl = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-parchment-200 p-6 sm:p-8 shadow-warm-lg">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-ink-muted hover:text-ink p-1"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-sage-50 border border-sage-200 px-3 py-1 mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-sage-600" />
            <span className="text-[10px] font-bold text-sage-800 tracking-wide uppercase">
              128-Bit Cryptographic Share Link
            </span>
          </div>
          <h3 className="font-display text-xl font-bold text-ink">
            Share Read-Only Event Plan
          </h3>
          <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
            Generate an unguessable 128-bit random token link for family or committee members. Shared views are strictly read-only and never expose editable parameters or contact PII.
          </p>
        </div>

        {token ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-parchment-300 bg-parchment-50 p-3">
              <span className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                Public Read-Only URL
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-white border border-parchment-200 rounded-lg px-2.5 py-1.5 text-xs text-ink select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={copyUrl}
                  className="inline-flex items-center gap-1 rounded-lg bg-oxblood px-3 py-1.5 text-xs font-semibold text-white hover:bg-oxblood-600 transition-colors"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{isCopied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {expiry && (
              <p className="text-[11px] text-ink-muted">
                Link expires on: <span className="font-semibold text-ink">{new Date(expiry).toLocaleDateString("en-IN")}</span>
              </p>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-parchment-200">
              <button
                type="button"
                onClick={handleRevoke}
                disabled={isLoading}
                className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Revoke Link Immediately</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-parchment-100 hover:bg-parchment-200 px-4 py-2 text-xs font-semibold text-ink transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <Share2 className="h-10 w-10 text-oxblood/40 mx-auto mb-3" />
            <p className="text-xs text-ink-muted mb-4">
              No active share token exists for this event yet.
            </p>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-oxblood px-5 py-2.5 text-xs font-semibold text-parchment-50 shadow-warm hover:bg-oxblood-600 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              <span>Create 128-Bit Share Link</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
