import Link from "next/link";
import { Clock, Flame, ChevronRight, Check, AlertCircle, Sparkles } from "lucide-react";
import { ScoredRecipe } from "@/types/kitchen";
import { CompatibilityBadge } from "./CompatibilityBadge";
import { NutritionDonut } from "./NutritionDonut";

interface RecipeCardProps {
  scoredRecipe: ScoredRecipe;
}

export function RecipeCard({ scoredRecipe }: RecipeCardProps) {
  const { recipe, compatibility_score, tier, substitutions, adjusted_time, is_time_compatible } =
    scoredRecipe;

  const isTimeAdjusted = adjusted_time !== recipe.total_time;

  return (
    <div className="group flex flex-col rounded-2xl border border-border/70 bg-card overflow-hidden shadow-xs hover:shadow-md hover:border-orange-500/40 transition duration-200">
      {/* Image Banner */}
      <div className="relative h-44 w-full bg-muted overflow-hidden">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground">
            No Image
          </div>
        )}

        <div className="absolute top-3 left-3">
          <CompatibilityBadge score={compatibility_score} tier={tier} />
        </div>

        {substitutions.length > 0 && (
          <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md text-amber-300 text-xs px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 border border-amber-500/30">
            <Sparkles className="h-3 w-3" />
            <span>{substitutions.length} smart adaptation{substitutions.length > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span className="font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            {recipe.cuisine} {recipe.region ? `· ${recipe.region}` : ""}
          </span>
          {recipe.calories && (
            <span className="flex items-center gap-1">
              <Flame className="h-3 w-3 text-red-500" />
              {recipe.calories} kcal
            </span>
          )}
        </div>

        <h3 className="font-bold text-lg text-foreground tracking-tight group-hover:text-orange-600 transition line-clamp-1 mb-2">
          {recipe.title}
        </h3>

        {/* Time and equipment readiness indicator */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md font-medium ${
            is_time_compatible
              ? "bg-secondary text-secondary-foreground"
              : "bg-red-500/10 text-red-600 dark:text-red-400 font-semibold"
          }`}>
            <Clock className="h-3.5 w-3.5" />
            <span>{adjusted_time} min</span>
            {isTimeAdjusted && (
              <span className="text-[10px] text-muted-foreground font-normal">
                (orig. {recipe.total_time}m)
              </span>
            )}
          </div>

          {/* Processes preview */}
          {recipe.processes.slice(0, 2).map((proc) => (
            <span
              key={proc}
              className="text-[11px] bg-secondary/60 text-muted-foreground px-2 py-0.5 rounded capitalize"
            >
              {proc.replace("_", " ")}
            </span>
          ))}
        </div>

        {/* Compact Nutrition Donut */}
        {recipe.nutrition && (
          <div className="mb-3 p-2.5 rounded-xl border border-border/50 bg-secondary/20">
            <NutritionDonut nutrition={recipe.nutrition} compact />
          </div>
        )}

        {/* Substitutions or Tool Match details */}
        {substitutions.length > 0 ? (
          <div className="mb-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-xs text-amber-900 dark:text-amber-200">
            <div className="font-semibold flex items-center gap-1 mb-1">
              <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
              Method Adaptation:
            </div>
            <p className="line-clamp-2 text-amber-800/90 dark:text-amber-300">
              Missing {substitutions[0].missing_equipment.replace("_", " ")} → Replaced with{" "}
              {substitutions[0].substitute_method.replace(/_/g, " ")} ({substitutions[0].flavor_impact.replace("_", " ")})
            </p>
          </div>
        ) : (
          <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>All utensils & heat sources already in your kitchen!</span>
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">
            {recipe.ingredients.length} ingredients · {recipe.instructions.length} steps
          </span>
          <Link
            href={`/recipe/${recipe.id}`}
            className="inline-flex items-center gap-1 rounded-lg bg-orange-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-orange-700 transition"
          >
            <span>View Recipe</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
