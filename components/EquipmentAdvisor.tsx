"use client";

import { useMemo } from "react";
import { TrendingUp, Plus } from "lucide-react";
import { useKitchenStore } from "@/store/kitchen-store";
import { ScoredRecipe, Cookware, Appliance, HeatSource, BasicTool } from "@/types/kitchen";

interface EquipmentAdvisorProps {
  scoredRecipes: ScoredRecipe[];
}

interface UpgradeCandidate {
  id: string;
  name: string;
  category: "cookware" | "appliances" | "heat_sources" | "basic_tools";
  estimatedCost: string;
  unlockedRecipes: string[];
  scoreBoost: number;
}

const UPGRADE_METADATA: Record<string, { name: string; cost: string; category: "cookware" | "appliances" | "heat_sources" | "basic_tools" }> = {
  saucepan: { name: "Small Saucepan", cost: "₹299", category: "cookware" },
  colander: { name: "Mesh Colander / Strainer", cost: "₹149", category: "cookware" },
  pot: { name: "Cooking Pot (2L)", cost: "₹399", category: "cookware" },
  steamer: { name: "Steamer Basket insert", cost: "₹199", category: "cookware" },
  blender: { name: "Immersion Hand Blender", cost: "₹699", category: "appliances" },
  pressure_cooker: { name: "Mini Pressure Cooker (1.5L)", cost: "₹799", category: "cookware" },
  toaster: { name: "Pop-up Toaster", cost: "₹599", category: "appliances" },
  whisk: { name: "Stainless Steel Whisk", cost: "₹99", category: "basic_tools" }
};

export function EquipmentAdvisor({ scoredRecipes }: EquipmentAdvisorProps) {
  const {
    toggleCookware,
    toggleAppliance,
    toggleHeatSource,
    toggleBasicTool
  } = useKitchenStore();

  // Compute unlock value for all missing items
  const recommendations = useMemo(() => {
    const candidateMap = new Map<string, { count: number; recipes: string[]; boostTotal: number }>();

    for (const item of scoredRecipes) {
      if (item.missing_equipment && item.missing_equipment.length > 0) {
        for (const missing of item.missing_equipment) {
          const meta = UPGRADE_METADATA[missing];
          if (!meta) continue;

          const existing = candidateMap.get(missing) || { count: 0, recipes: [], boostTotal: 0 };
          existing.count += 1;
          if (!existing.recipes.includes(item.recipe.title)) {
            existing.recipes.push(item.recipe.title);
          }
          existing.boostTotal += (100 - item.compatibility_score);
          candidateMap.set(missing, existing);
        }
      }
    }

    const list: UpgradeCandidate[] = [];
    candidateMap.forEach((val, id) => {
      const meta = UPGRADE_METADATA[id];
      if (meta) {
        list.push({
          id,
          name: meta.name,
          category: meta.category,
          estimatedCost: meta.cost,
          unlockedRecipes: val.recipes,
          scoreBoost: Math.round(val.boostTotal / val.count)
        });
      }
    });

    // Sort by most recipes unlocked
    return list.sort((a, b) => b.unlockedRecipes.length - a.unlockedRecipes.length);
  }, [scoredRecipes]);

  if (recommendations.length === 0) return null;

  const topRec = recommendations[0];

  const handleSimulateAdd = (candidate: UpgradeCandidate) => {
    if (candidate.category === "cookware") {
      toggleCookware(candidate.id as Cookware);
    } else if (candidate.category === "appliances") {
      toggleAppliance(candidate.id as Appliance);
    } else if (candidate.category === "heat_sources") {
      toggleHeatSource(candidate.id as HeatSource);
    } else if (candidate.category === "basic_tools") {
      toggleBasicTool(candidate.id as BasicTool);
    }
  };

  return (
    <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-background p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-foreground">
                Equipment Upgrade Advisor
              </h3>
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Smart ROI
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              What single affordable utensil unlocks the most culinary variety for you?
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 self-start sm:self-auto">
          {recommendations.length} upgrades analyzed
        </div>
      </div>

      {/* Top ROI Highlight */}
      <div className="rounded-2xl border border-amber-500/30 bg-background/80 p-4 sm:p-5 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-foreground">{topRec.name}</span>
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                approx. {topRec.estimatedCost}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Adding this immediately unlocks <strong className="text-foreground">{topRec.unlockedRecipes.length} recipes</strong> to 100% native compatibility:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {topRec.unlockedRecipes.map((title) => (
                <span
                  key={title}
                  className="rounded-md bg-secondary/80 px-2 py-0.5 text-[11px] font-medium text-foreground"
                >
                  {title}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSimulateAdd(topRec)}
            className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 text-xs font-bold shadow-xs transition shrink-0 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Simulate Adding to My Kitchen</span>
          </button>
        </div>
      </div>

      {/* Other candidates grid */}
      {recommendations.length > 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {recommendations.slice(1, 4).map((rec) => (
            <div
              key={rec.id}
              className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-card/60 text-xs"
            >
              <div>
                <div className="font-semibold text-foreground">{rec.name}</div>
                <div className="text-muted-foreground text-[11px]">
                  Unlocks {rec.unlockedRecipes.length} dishes · {rec.estimatedCost}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSimulateAdd(rec)}
                className="p-1.5 rounded-lg bg-secondary hover:bg-orange-500 hover:text-white transition cursor-pointer text-muted-foreground"
                title="Add to kitchen"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
