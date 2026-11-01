"use client";

import { useState } from "react";
import { Sparkles, Eye, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { AdaptedStep as AdaptedStepType } from "@/types/kitchen";

interface AdaptedStepProps {
  step: AdaptedStepType;
}

export function AdaptedStepComponent({ step }: AdaptedStepProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <div
      className={`rounded-2xl border transition p-4 sm:p-5 ${
        step.is_adapted
          ? "border-amber-500/50 bg-amber-500/5 shadow-xs"
          : "border-border/60 bg-card"
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Step Badge */}
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold text-sm shadow-xs ${
            step.is_adapted
              ? "bg-amber-500 text-white"
              : "bg-secondary text-foreground"
          }`}
        >
          {step.step_number}
        </div>

        {/* Step Body */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            {step.is_adapted ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <Sparkles className="h-3 w-3" />
                Equipment Adapted Step
              </span>
            ) : (
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Standard Step
              </span>
            )}

            {step.is_adapted && (
              <button
                type="button"
                onClick={() => setShowOriginal(!showOriginal)}
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition"
              >
                <Eye className="h-3 w-3" />
                <span>{showOriginal ? "Hide original" : "Show original"}</span>
                {showOriginal ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
            )}
          </div>

          {/* Active adapted instruction */}
          <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
            {step.adapted_instruction}
          </p>

          {/* Tip / Flavor retention rationale */}
          {step.tip && (
            <div className="rounded-lg bg-background/80 border border-amber-500/20 p-2.5 text-xs text-muted-foreground">
              <strong className="text-amber-600 dark:text-amber-400 font-semibold mr-1">
                KitchenOS Science:
              </strong>
              {step.tip}
            </div>
          )}

          {/* Collapsible Original Recipe Text */}
          {showOriginal && step.is_adapted && (
            <div className="mt-2 rounded-lg bg-secondary/50 p-3 text-xs text-muted-foreground border border-border">
              <div className="font-semibold text-foreground mb-0.5">
                Original Recipe Text:
              </div>
              <p className="italic">&ldquo;{step.original_instruction}&rdquo;</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
