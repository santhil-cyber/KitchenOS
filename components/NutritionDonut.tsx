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
  const radius = compact ? 26 : 42;
  const strokeWidth = compact ? 7 : 10;
  const circumference = 2 * Math.PI * radius;

  const proteinStroke = (proteinPct / 100) * circumference;
  const carbsStroke = (carbsPct / 100) * circumference;
  const fatStroke = (fatPct / 100) * circumference;

  const carbsOffset = -proteinStroke;
  const fatOffset = -(proteinStroke + carbsStroke);

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center">
          <svg width="68" height="68" viewBox="0 0 68 68" className="-rotate-90">
            {/* Background ring */}
            <circle
              cx="34"
              cy="34"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-muted/40"
            />
            {/* Protein (Blue) */}
            <circle
              cx="34"
              cy="34"
              r={radius}
              fill="transparent"
              stroke="#3b82f6"
              strokeWidth={strokeWidth}
              strokeDasharray={`${proteinStroke} ${circumference}`}
              strokeDashoffset="0"
            />
            {/* Carbs (Amber) */}
            <circle
              cx="34"
              cy="34"
              r={radius}
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth={strokeWidth}
              strokeDasharray={`${carbsStroke} ${circumference}`}
              strokeDashoffset={carbsOffset}
            />
            {/* Fat (Rose) */}
            <circle
              cx="34"
              cy="34"
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

        <div className="text-[11px] space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">P:</span>
            <span className="font-semibold">{protein_g}g</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">C:</span>
            <span className="font-semibold">{carbs_g}g</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span className="text-muted-foreground">F:</span>
            <span className="font-semibold">{fat_g}g</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base">Macronutrient Distribution</h3>
          <p className="text-xs text-muted-foreground">
            Estimated computational gastronomy breakdown per serving
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-extrabold text-foreground">{calories}</span>
          <span className="text-xs font-semibold text-muted-foreground ml-1">kcal</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* SVG Donut */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg width="110" height="110" viewBox="0 0 110 110" className="-rotate-90">
            <circle
              cx="55"
              cy="55"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-muted/40"
            />
            {/* Protein */}
            <circle
              cx="55"
              cy="55"
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
              cx="55"
              cy="55"
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
              cx="55"
              cy="55"
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
            <div className="text-xs font-semibold text-muted-foreground">Energy</div>
            <div className="text-sm font-bold text-foreground">{calories}</div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Protein</span>
            </div>
            <div className="text-lg font-bold text-foreground">{protein_g}g</div>
            <div className="text-[11px] text-muted-foreground">{proteinPct}% of cals</div>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Carbs</span>
            </div>
            <div className="text-lg font-bold text-foreground">{carbs_g}g</div>
            <div className="text-[11px] text-muted-foreground">{carbsPct}% of cals</div>
          </div>

          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">Fats</span>
            </div>
            <div className="text-lg font-bold text-foreground">{fat_g}g</div>
            <div className="text-[11px] text-muted-foreground">{fatPct}% of cals</div>
          </div>

          {fiber_g !== undefined && (
            <div className="col-span-2 sm:col-span-3 rounded-xl border border-border/50 bg-secondary/30 px-3 py-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Dietary Fiber</span>
              <span className="font-semibold text-foreground">{fiber_g}g</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
