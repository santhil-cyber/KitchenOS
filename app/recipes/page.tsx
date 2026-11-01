"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  CookingPot
} from "lucide-react";
import { useKitchenStore } from "@/store/kitchen-store";
import { ScoredRecipe } from "@/types/kitchen";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeCardSkeleton } from "@/components/RecipeCardSkeleton";
import { EquipmentAdvisor } from "@/components/EquipmentAdvisor";

const cuisines = [
  "all",
  "Asian",
  "Indian",
  "Italian",
  "Mediterranean",
  "Fusion",
  "Himalayan / Asian"
];

export default function RecipesPage() {
  const {
    profile,
    searchQuery,
    selectedCuisine,
    minScoreFilter,
    setSearchQuery,
    setSelectedCuisine
  } = useKitchenStore();

  const [recipes, setRecipes] = useState<ScoredRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlyWithinTime, setOnlyWithinTime] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadRecipes() {
      setLoading(true);
      try {
        const res = await fetch("/api/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile,
            query: searchQuery,
            cuisine: selectedCuisine,
            minScore: minScoreFilter
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (!isCancelled) {
            setRecipes(data.recipes || []);
          }
        }
      } catch (err) {
        console.error("Failed to load scored recipes:", err);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadRecipes();

    return () => {
      isCancelled = true;
    };
  }, [profile, searchQuery, selectedCuisine, minScoreFilter]);

  // Apply local time filter if toggled
  const displayedRecipes = useMemo(() => {
    if (!onlyWithinTime) return recipes;
    return recipes.filter((r) => r.is_time_compatible);
  }, [recipes, onlyWithinTime]);

  const perfectCount = recipes.filter((r) => r.tier === "perfect").length;
  const doableCount = recipes.filter((r) => r.tier === "doable").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Bar with back link & active setup summary */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Edit Kitchen Inventory</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Recipes Adapted For Your Kitchen
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Using your setup:{" "}
            <span className="font-semibold text-foreground">
              {profile.heat_sources.map((h) => h.replace("_", " ")).join(", ") || "No heat"}
            </span>{" "}
            ·{" "}
            <span className="font-semibold text-foreground">
              {profile.cookware.map((c) => c.replace("_", " ")).join(", ") || "No cookware"}
            </span>{" "}
            · Max {profile.max_time_minutes} min
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            <span>{perfectCount} Perfect Matches</span>
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            <span>{doableCount} Smartly Adapted</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="mb-8 space-y-4 rounded-2xl border border-border/60 bg-card p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Keyword Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by ingredient, dish or craving (e.g. noodles, egg, garlic)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Time Filter Toggle */}
          <button
            type="button"
            onClick={() => setOnlyWithinTime(!onlyWithinTime)}
            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition cursor-pointer ${
              onlyWithinTime
                ? "border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400"
                : "border-border bg-background text-muted-foreground hover:bg-secondary"
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Only within {profile.max_time_minutes} min limit</span>
          </button>
        </div>

        {/* Cuisine Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
          <span className="text-xs font-semibold text-muted-foreground mr-1">Cuisine:</span>
          {cuisines.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCuisine(c)}
              className={`rounded-lg px-3 py-1 text-xs font-medium capitalize transition cursor-pointer ${
                selectedCuisine === c
                  ? "bg-orange-600 text-white shadow-xs"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Upgrade Advisor */}
      {!loading && recipes.length > 0 && (
        <div className="mb-8">
          <EquipmentAdvisor scoredRecipes={recipes} />
        </div>
      )}

      {/* Results Display */}
      {loading ? (
        <div>
          <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Scoring recipes across equipment & thermal constraints...
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : displayedRecipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <CookingPot className="h-12 w-12 text-muted-foreground mb-3 opacity-60" />
          <h3 className="font-bold text-lg">No recipes found with these constraints</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-md">
            Try broadening your search keyword, adjusting your cooking time slider, or adding an extra pot or pan to your kitchen profile.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCuisine("all");
              setOnlyWithinTime(false);
            }}
            className="mt-4 rounded-xl bg-secondary px-4 py-2 text-xs font-semibold hover:bg-secondary/80"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Showing {displayedRecipes.length} recipe{displayedRecipes.length !== 1 ? "s" : ""} sorted by equipment compatibility
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedRecipes.map((item) => (
              <RecipeCard key={item.recipe.id} scoredRecipe={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
