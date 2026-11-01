"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Utensils,
  Sparkles,
  BookOpen,
  Play
} from "lucide-react";
import { useKitchenStore } from "@/store/kitchen-store";
import { ScoredRecipe } from "@/types/kitchen";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";
import { AdaptedStepComponent } from "@/components/AdaptedStep";
import { FlavorInsight } from "@/components/FlavorInsight";
import { SubstitutionChip } from "@/components/SubstitutionChip";
import { CookAlongModal } from "@/components/CookAlongModal";
import { NutritionDonut } from "@/components/NutritionDonut";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RecipeDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const recipeId = resolvedParams.id;
  const profile = useKitchenStore((s) => s.profile);

  const [scoredRecipe, setScoredRecipe] = useState<ScoredRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCookAlongOpen, setIsCookAlongOpen] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      try {
        const res = await fetch("/api/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile })
        });

        if (res.ok) {
          const data = await res.json();
          const match = data.recipes?.find((r: ScoredRecipe) => r.recipe.id === recipeId);
          if (match) {
            setScoredRecipe(match);
          }
        }
      } catch (err) {
        console.error("Failed to load recipe detail:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDetail();
  }, [recipeId, profile]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        <p className="mt-4 text-sm font-medium text-muted-foreground">
          Adapting culinary instructions to your kitchen...
        </p>
      </div>
    );
  }

  if (!scoredRecipe) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Recipe not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn&apos;t locate this recipe in the active computational dataset.
        </p>
        <Link
          href="/recipes"
          className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to recipes</span>
        </Link>
      </div>
    );
  }

  const { recipe, compatibility_score, tier, matched_equipment, missing_equipment, substitutions, adjusted_time, adapted_instructions } = scoredRecipe;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <Link
          href="/recipes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to matched recipes</span>
        </Link>

        {/* Cook Along CTA */}
        {adapted_instructions && adapted_instructions.length > 0 && (
          <button
            type="button"
            onClick={() => setIsCookAlongOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white px-4 py-2 text-xs font-bold shadow-md shadow-orange-500/20 cursor-pointer transition hover:scale-102"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            <span>Start Cook Along Mode</span>
          </button>
        )}
      </div>

      {/* Header Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-3xl border border-border/70 bg-card overflow-hidden p-6 sm:p-8 shadow-xs mb-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <CompatibilityBadge score={compatibility_score} tier={tier} size="lg" />
            <span className="text-xs uppercase font-bold tracking-wider text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-md">
              {recipe.cuisine} {recipe.region ? `· ${recipe.region}` : ""}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {recipe.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="h-4 w-4 text-orange-500" />
              <span>{adjusted_time} min ready</span>
              {adjusted_time !== recipe.total_time && (
                <span className="text-xs text-muted-foreground font-normal">
                  (adjusted from original {recipe.total_time}m)
                </span>
              )}
            </span>
            {recipe.calories && (
              <span className="flex items-center gap-1.5 font-medium">
                <Flame className="h-4 w-4 text-red-500" />
                <span>{recipe.calories} kcal</span>
              </span>
            )}
            <span className="flex items-center gap-1.5 font-medium">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span>RecipeDB ID: {recipe.id}</span>
            </span>
          </div>

          {/* Adaptation explanation banner */}
          {substitutions.length > 0 ? (
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span>KitchenOS Adaptation Applied:</span>
              </div>
              <p className="leading-relaxed">
                You don&apos;t have: <strong className="capitalize">{missing_equipment.map((m) => m.replace("_", " ")).join(", ")}</strong>. KitchenOS automatically re-routed cooking processes to use your available cookware (<strong>{substitutions[0].substitute_method.replace(/_/g, " ")}</strong>) without sacrificing taste.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>
                <strong>100% Native Match:</strong> Every single technique and utensil required by this RecipeDB dish directly exists in your kitchen profile.
              </span>
            </div>
          )}

          {/* Inline Cook Along Button */}
          {adapted_instructions && adapted_instructions.length > 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsCookAlongOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-orange-500/20 cursor-pointer transition"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Launch Interactive Cook Along (with Timers)</span>
              </button>
            </div>
          )}
        </div>

        {/* Recipe Image */}
        <div className="relative rounded-2xl overflow-hidden h-52 md:h-full bg-muted">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              No Preview
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Left Side Ingredients + Equipment Checklist, Right Side Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Macronutrient Donut Card */}
          {recipe.nutrition && (
            <NutritionDonut nutrition={recipe.nutrition} />
          )}

          {/* Ingredients with FlavorDB chips */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs">
            <h3 className="font-bold text-base mb-1">Ingredients</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Tap any ingredient to view FlavorDB molecular substitutes
            </p>

            <ul className="space-y-2">
              {recipe.ingredients.map((ing, idx) => {
                const text = typeof ing === "string" ? ing : ing.name;
                return (
                  <li key={idx} className="flex flex-col text-sm border-b border-border/40 pb-2">
                    <SubstitutionChip ingredient={text} />
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Equipment Check-off */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Utensils className="h-4 w-4 text-orange-500" />
              <h3 className="font-bold text-base">Equipment Match Matrix</h3>
            </div>

            <div className="space-y-2.5">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Available in Your Kitchen
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matched_equipment.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 capitalize"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {item.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>

              {missing_equipment.length > 0 && (
                <div className="pt-2 border-t border-border/40">
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1.5">
                    Substituted Equipment
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {missing_equipment.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400 capitalize"
                      >
                        <AlertTriangle className="h-3 w-3" />
                        {item.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Step-by-Step Adapted Cooking Flow + Molecular Insight */}
        <div className="lg:col-span-2 space-y-6">
          {/* Flavor Insight Component */}
          <FlavorInsight
            molecules={recipe.flavor_molecules}
            substitutionsCount={substitutions.length}
          />

          {/* Adapted Steps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">
                Adapted Step-by-Step Workflow
              </h3>
              <button
                type="button"
                onClick={() => setIsCookAlongOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary/80 transition cursor-pointer"
              >
                <Play className="h-3 w-3 fill-current text-orange-600" />
                <span>Cook Along</span>
              </button>
            </div>

            <div className="space-y-3">
              {adapted_instructions && adapted_instructions.length > 0 ? (
                adapted_instructions.map((step) => (
                  <AdaptedStepComponent key={step.step_number} step={step} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No instruction steps found.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Guided Cook Along Modal */}
      {adapted_instructions && (
        <CookAlongModal
          recipe={recipe}
          steps={adapted_instructions}
          isOpen={isCookAlongOpen}
          onClose={() => setIsCookAlongOpen(false)}
        />
      )}
    </div>
  );
}
