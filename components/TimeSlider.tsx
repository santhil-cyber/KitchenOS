"use client";

import { Clock } from "lucide-react";
import { useKitchenStore } from "@/store/kitchen-store";

const quickTimes = [15, 20, 30, 45, 60];

export function TimeSlider() {
  const maxTime = useKitchenStore((s) => s.profile.max_time_minutes);
  const setMaxTime = useKitchenStore((s) => s.setMaxTime);

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Available Cooking Time</h3>
            <p className="text-xs text-muted-foreground">KitchenOS will prioritize recipes within this limit</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold tracking-tight text-orange-600 dark:text-orange-400">
            {maxTime}
          </span>
          <span className="text-xs font-semibold text-muted-foreground ml-1">min</span>
        </div>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={5}
        max={120}
        step={5}
        value={maxTime}
        onChange={(e) => setMaxTime(Number(e.target.value))}
        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-orange-600"
      />

      {/* Quick selection pills */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/40">
        <span className="text-xs text-muted-foreground">Quick pick:</span>
        <div className="flex gap-1.5">
          {quickTimes.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => setMaxTime(time)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                maxTime === time
                  ? "bg-orange-600 text-white shadow-xs"
                  : "bg-secondary/70 text-secondary-foreground hover:bg-secondary"
              }`}
            >
              {time}m
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

