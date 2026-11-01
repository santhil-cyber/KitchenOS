"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ChefHat, Flame, Clock } from "lucide-react";
import { EquipmentGrid } from "@/components/EquipmentGrid";
import { TimeSlider } from "@/components/TimeSlider";
import { useKitchenStore } from "@/store/kitchen-store";

export default function HomePage() {
  const profile = useKitchenStore((s) => s.profile);

  const totalSelected =
    profile.heat_sources.length +
    profile.cookware.length +
    profile.appliances.length +
    profile.basic_tools.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-3.5 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400 mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Equipment-Aware Computational Gastronomy</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          Your Kitchen, <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Your Rules.</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          Most recipes assume you own an oven, a 4-burner stove, and a blender.
          KitchenOS scans your actual pots, induction, and utensils, then automatically adapts 
          world recipes from <strong>RecipeDB</strong> and <strong>FlavorDB</strong> to fit what you actually have.
        </p>

        {/* Quick Stat Pill */}
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 font-medium">
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            {profile.heat_sources.length} Heat Source{profile.heat_sources.length !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 font-medium">
            <ChefHat className="h-3.5 w-3.5 text-amber-500" />
            {profile.cookware.length} Pot/Pan{profile.cookware.length !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 font-medium">
            <Clock className="h-3.5 w-3.5 text-blue-500" />
            Max {profile.max_time_minutes} min
          </span>
        </div>
      </div>

      {/* Main Grid: Left side Time + Navigation, Right side Equipment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Constraints & Fast Action */}
        <div className="lg:col-span-1 space-y-6">
          <div className="sticky top-24 space-y-6">
            <TimeSlider />

            {/* Launch Search Card */}
            <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-card to-background p-6 shadow-sm">
              <h3 className="font-bold text-lg text-foreground mb-1">
                Ready to find recipes?
              </h3>
              <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                KitchenOS will query RecipeDB, calculate equipment match scores, and rewrite preparation steps for your setup.
              </p>

              <Link
                href="/recipes"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3.5 font-bold text-sm text-white shadow-md shadow-orange-500/20 hover:bg-orange-700 transition"
              >
                <span>Find Recipes ({totalSelected} tools selected)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Equipment Selector */}
        <div className="lg:col-span-2">
          <EquipmentGrid />
        </div>
      </div>
    </div>
  );
}
