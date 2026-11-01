"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { FlavorSubstitutionResult } from "@/lib/flavordb";

interface SubstitutionChipProps {
  ingredient: string;
}

export function SubstitutionChip({ ingredient }: SubstitutionChipProps) {
  const [loading, setLoading] = useState(false);
  const [substitute, setSubstitute] = useState<FlavorSubstitutionResult | null>(null);
  const [expanded, setExpanded] = useState(false);

  const fetchSubstitute = async () => {
    if (substitute) {
      setExpanded(!expanded);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/substitute?ingredient=${encodeURIComponent(ingredient)}`);
      const data = await res.json();
      if (data.substitute) {
        setSubstitute(data.substitute);
        setExpanded(true);
      } else {
        setExpanded(true);
      }
    } catch (err) {
      console.error("Failed to query substitute:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-block my-1">
      <button
        type="button"
        onClick={fetchSubstitute}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-full bg-secondary hover:bg-secondary/80 border border-border px-3 py-1 text-xs font-medium text-foreground transition cursor-pointer"
      >
        <span>{ingredient}</span>
        {loading ? (
          <Loader2 className="h-3 w-3 animate-spin text-orange-500" />
        ) : (
          <Sparkles className="h-3 w-3 text-amber-500" />
        )}
      </button>

      {expanded && (
        <div className="mt-2 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-950 dark:text-amber-100 max-w-md shadow-xs animate-in fade-in duration-200">
          {substitute ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1">
                  <span>Swap for: </span>
                  <span className="text-orange-600 dark:text-orange-400 font-bold">
                    {substitute.substitute_ingredient}
                  </span>
                </span>
                <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] text-orange-600 dark:text-orange-300 font-bold">
                  {Math.round(substitute.pairing_score * 100)}% Flavor Overlap
                </span>
              </div>
              <p className="text-muted-foreground">{substitute.tasting_notes}</p>
              {substitute.shared_compounds.length > 0 && (
                <div className="text-[11px] text-muted-foreground font-mono">
                  Shared molecules: {substitute.shared_compounds.join(", ")}
                </div>
              )}
            </div>
          ) : (
            <div className="text-muted-foreground">
              No direct molecular substitute needed — this is a core or basic pantry staple.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
