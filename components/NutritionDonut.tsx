"use client";

import { RecipeNutrition } from "@/types/kitchen";

interface NutritionDonutProps {
  nutrition?: RecipeNutrition;
  compact?: boolean;
}

export function NutritionDonut({ nutrition, compact = false }: NutritionDonutProps) {
  if (!nutrition) return null;

  const { calories, protein_g, carbs_g, fat_g, fiber_g } = nutrition;

  // Calorie calculation from macros:
  // Protein: 4 cal/g, Carbs: 4 cal/g, Fat: 9 cal/g
  const proteinCals = protein_g * 4;
  const carbsCals = carbs_g * 4;
  const fatCals = fat_g * 9;
  const totalMacroCals = Math.max(proteinCals + carbsCals + fatCals, 1);

  const proteinPct = Math.round((proteinCals / totalMacroCals) * 100);
  const carbsPct = Math.round((carbsCals / totalMacroCals) * 100);
  const fatPct = Math.max(100 - proteinPct - carbsPct, 0);

  // SVG Donut metrics
  const radius = compact ? 26 : 38;
  const strokeWidth = compact ? 7 : 9;
  const circumference = 2 * Math.PI * radius;

  const proteinStroke = (proteinPct / 100) * circumference;
  const carbsStroke = (carbsPct / 100) * circumference;
  const fatStroke = (fatPct / 100) * circumference;

  const carbsOffset = -proteinStroke;
  const fatOffset = -(proteinStroke + carbsStroke);

  if (compact) {
    return (
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="relative flex items-center justify-center shrink-0">
          <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
            {/* Background ring */}
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-muted/40"
            />
            {/* Protein (Blue) */}
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="transparent"
              stroke="#3b82f6"
              strokeWidth={strokeWidth}
              strokeDasharray={`${proteinStroke} ${circumference}`}
              strokeDashoffset="0"
            />
            {/* Carbs (Amber) */}
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth={strokeWidth}
              strokeDasharray={`${carbsStroke} ${circumference}`}
              strokeDashoffset={carbsOffset}
            />
            {/* Fat (Rose) */}
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="transparent"
              stroke="#f43f5e"
              strokeWidth={strokeWidth}
              strokeDasharray={`${fatStroke} ${circumference}`}
              strokeDashoffset={fatOffset}
            />
          </svg>
          <div className="absolute text-[10px] font-bold text-foreground">
            {calories}
          </div>
        </div>

        <div className="text-[11px] space-y-0.5 min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <span className="flex items-center gap-1 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
              <span>Protein</span>
            </span>
            <span className="font-semibold text-foreground">{protein_g}g</span>
          </div>
          <div className="flex items-center justify-between gap-1">
            <span className="flex items-center gap-1 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
              <span>Carbs</span>
            </span>
            <span className="font-semibold text-foreground">{carbs_g}g</span>
          </div>
          <div className="flex items-center justify-between gap-1">
            <span className="flex items-center gap-1 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
              <span>Fat</span>
            </span>
            <span className="font-semibold text-foreground">{fat_g}g</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 sm:p-5 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-foreground">
            Macronutrient Distribution
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Computational breakdown per serving
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xl sm:text-2xl font-extrabold text-foreground">{calories}</span>
          <span className="text-xs font-semibold text-muted-foreground ml-1">kcal</span>
        </div>
      </div>

      {/* Donut Chart (Centered) */}
      <div className="flex justify-center my-3">
        <div className="relative flex items-center justify-center">
          <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-muted/40"
            />
            {/* Protein */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#3b82f6"
              strokeWidth={strokeWidth}
              strokeDasharray={`${proteinStroke} ${circumference}`}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
            {/* Carbs */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth={strokeWidth}
              strokeDasharray={`${carbsStroke} ${circumference}`}
              strokeDashoffset={carbsOffset}
              strokeLinecap="round"
            />
            {/* Fat */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#f43f5e"
              strokeWidth={strokeWidth}
              strokeDasharray={`${fatStroke} ${circumference}`}
              strokeDashoffset={fatOffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute text-center">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Energy</div>
            <div className="text-sm font-bold text-foreground">{calories}</div>
          </div>
        </div>
      </div>

      {/* 3-Column Macro Grid (fits in any narrow sidebar or mobile view) */}
      <div className="grid grid-cols-3 gap-2 w-full mt-3">
        {/* Protein */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-2 text-center flex flex-col justify-between">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 truncate">
              Protein
            </span>
          </div>
          <div className="text-base font-extrabold text-foreground">{protein_g}g</div>
          <div className="text-[10px] text-muted-foreground">{proteinPct}% of cals</div>
        </div>

        {/* Carbs */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-2 text-center flex flex-col justify-between">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 truncate">
              Carbs
            </span>
          </div>
          <div className="text-base font-extrabold text-foreground">{carbs_g}g</div>
          <div className="text-[10px] text-muted-foreground">{carbsPct}% of cals</div>
        </div>

        {/* Fat */}
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-2 text-center flex flex-col justify-between">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 truncate">
              Fats
            </span>
          </div>
          <div className="text-base font-extrabold text-foreground">{fat_g}g</div>
          <div className="text-[10px] text-muted-foreground">{fatPct}% of cals</div>
        </div>
      </div>

      {/* Dietary Fiber (if present) */}
      {fiber_g !== undefined && (
        <div className="mt-2.5 rounded-xl border border-border/50 bg-secondary/30 px-3 py-1.5 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Dietary Fiber</span>
          <span className="font-semibold text-foreground">{fiber_g}g</span>
        </div>
      )}
    </div>
  );
}
