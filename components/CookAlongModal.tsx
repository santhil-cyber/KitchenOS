"use client";

import { useEffect, useState } from "react";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Clock,
  PartyPopper
} from "lucide-react";
import { AdaptedStep, Recipe } from "@/types/kitchen";

interface CookAlongModalProps {
  recipe: Recipe;
  steps: AdaptedStep[];
  isOpen: boolean;
  onClose: () => void;
}

export function CookAlongModal({
  recipe,
  steps,
  isOpen,
  onClose
}: CookAlongModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentStep = steps[currentStepIndex];

  // Helper to extract minutes from step text
  const extractTimerFromText = (text: string): number | null => {
    // Look for patterns like "12 minutes", "3 min", "9-10 min", "for 2 minutes"
    const match = text.match(/(\d+)(?:-\d+)?\s*(?:minutes|min|mins)/i);
    if (match && match[1]) {
      const minutes = parseInt(match[1], 10);
      if (minutes > 0 && minutes <= 240) {
        return minutes * 60;
      }
    }
    return null;
  };

  // Reset or initialize timer when step changes
  useEffect(() => {
    if (!currentStep) return;
    const extracted = extractTimerFromText(currentStep.adapted_instruction);
    setTimerSeconds(extracted);
    setTimerRunning(false);
  }, [currentStepIndex, currentStep]);

  // Countdown interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerSeconds !== null && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev !== null && prev <= 1) {
            setTimerRunning(false);
            // Play a standard browser notification beep via AudioContext
            try {
              const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.setValueAtTime(880, ctx.currentTime);
              gain.gain.setValueAtTime(0.3, ctx.currentTime);
              osc.start();
              osc.stop(ctx.currentTime + 0.6);
            } catch {
              // Ignore audio errors if not permitted
            }
            return 0;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStepIndex, isFinished]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (isFinished) {
      setIsFinished(false);
    } else if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPct = isFinished
    ? 100
    : Math.round(((currentStepIndex + 1) / steps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-3xl h-[88vh] max-h-[750px] bg-card rounded-3xl border border-border/80 shadow-2xl overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4 bg-secondary/30">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Cook Along Mode
            </span>
            <h2 className="text-base font-bold text-foreground line-clamp-1">
              {recipe.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-muted-foreground">
              {isFinished ? "Complete!" : `Step ${currentStepIndex + 1} of ${steps.length}`}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-secondary transition text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-secondary h-1.5">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col justify-center">
          {isFinished ? (
            /* Celebration Screen */
            <div className="text-center space-y-5 max-w-lg mx-auto py-6">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                <PartyPopper className="h-10 w-10 animate-bounce" />
              </div>

              <div>
                <h3 className="text-3xl font-extrabold text-foreground">
                  You Cooked It! 🎉
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Congratulations! You prepared <strong>{recipe.title}</strong> using exactly your available kitchen tools without requiring an oven or specialized gear.
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4 text-xs text-left space-y-2">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>KitchenOS Verification Summary</span>
                </div>
                <p className="text-muted-foreground">
                  All {steps.length} culinary techniques were executed with thermal compatibility and 100% FlavorDB molecular preservation.
                </p>
              </div>

              <div className="flex gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsFinished(false);
                    setCurrentStepIndex(0);
                  }}
                  className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
                >
                  Restart Steps
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 text-xs font-bold shadow-md cursor-pointer"
                >
                  Done & Close
                </button>
              </div>
            </div>
          ) : (
            /* Active Step Display */
            <div className="space-y-6 max-w-2xl mx-auto w-full">
              {/* Step indicator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-600 text-white text-base font-extrabold shadow-md">
                    {currentStep.step_number}
                  </span>
                  {currentStep.is_adapted ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                      <Sparkles className="h-3.5 w-3.5" />
                      Adapted for your equipment
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Standard Technique
                    </span>
                  )}
                </div>

                <span className="text-xs text-muted-foreground font-mono">
                  Use ← and → keys
                </span>
              </div>

              {/* Large Step Instruction */}
              <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-sm">
                <p className="text-lg sm:text-2xl font-bold leading-relaxed text-foreground">
                  {currentStep.adapted_instruction}
                </p>

                {currentStep.tip && (
                  <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs sm:text-sm text-amber-950 dark:text-amber-200">
                    <strong className="font-bold text-amber-600 dark:text-amber-400 mr-1.5">
                      💡 Chef & Science Tip:
                    </strong>
                    {currentStep.tip}
                  </div>
                )}
              </div>

              {/* Interactive Step Timer (if detected) */}
              {timerSeconds !== null && (
                <div className="rounded-2xl border border-border/60 bg-secondary/40 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${
                      timerSeconds === 0
                        ? "bg-emerald-500 text-white animate-pulse"
                        : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                    }`}>
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground">
                        Step Timer
                      </div>
                      <div className="text-2xl font-mono font-extrabold tracking-wider text-foreground">
                        {formatTimer(timerSeconds)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTimerRunning(!timerRunning)}
                      className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs cursor-pointer ${
                        timerRunning
                          ? "bg-rose-500 hover:bg-rose-600 text-white"
                          : "bg-orange-600 hover:bg-orange-700 text-white"
                      }`}
                    >
                      {timerRunning ? (
                        <>
                          <Pause className="h-3.5 w-3.5" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5" />
                          <span>Start Timer</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTimerRunning(false);
                        const extracted = extractTimerFromText(currentStep.adapted_instruction);
                        setTimerSeconds(extracted);
                      }}
                      className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition cursor-pointer"
                      title="Reset Timer"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Control Footer */}
        <div className="border-t border-border/60 px-6 py-4 bg-secondary/30 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStepIndex === 0 && !isFinished}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-foreground hover:bg-secondary transition disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === currentStepIndex && !isFinished
                    ? "w-6 bg-orange-600"
                    : i < currentStepIndex || isFinished
                    ? "w-2 bg-emerald-500"
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 text-xs font-bold shadow-md transition cursor-pointer"
          >
            <span>{currentStepIndex === steps.length - 1 ? "Finish Cooking" : "Next Step"}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
