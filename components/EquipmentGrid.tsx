"use client";

import {
  Flame,
  CookingPot,
  PlugZap,
  UtensilsCrossed,
  Check,
  Sparkles
} from "lucide-react";
import { useKitchenStore } from "@/store/kitchen-store";
import {
  Appliance,
  BasicTool,
  Cookware,
  HeatSource
} from "@/types/kitchen";
import presetsData from "@/data/presets.json";

interface EquipmentOption<T> {
  id: T;
  label: string;
  iconName?: string;
  badge?: string;
}

const heatSourceOptions: EquipmentOption<HeatSource>[] = [
  { id: "induction", label: "Induction Cooktop", badge: "Student Favorite" },
  { id: "gas_stove", label: "Gas Stove" },
  { id: "microwave", label: "Microwave" },
  { id: "electric_kettle", label: "Electric Kettle" },
  { id: "oven", label: "Oven / Convection" },
  { id: "air_fryer", label: "Air Fryer" },
  { id: "toaster", label: "Bread Toaster" }
];

const cookwareOptions: EquipmentOption<Cookware>[] = [
  { id: "pan", label: "Frying Pan / Skillet", badge: "Essential" },
  { id: "saucepan", label: "Saucepan" },
  { id: "pot", label: "Cooking Pot / Dutch Oven" },
  { id: "pressure_cooker", label: "Pressure Cooker" },
  { id: "wok", label: "Wok / Kadhai" },
  { id: "colander", label: "Colander / Strainer" },
  { id: "baking_tray", label: "Baking Tray" },
  { id: "steamer", label: "Steamer Basket" },
  { id: "deep_pot", label: "Deep Fry Pot" }
];

const applianceOptions: EquipmentOption<Appliance>[] = [
  { id: "blender", label: "Blender / Mixer" },
  { id: "food_processor", label: "Food Processor" },
  { id: "air_fryer", label: "Air Fryer" },
  { id: "toaster", label: "Toaster" }
];

const basicToolOptions: EquipmentOption<BasicTool>[] = [
  { id: "knife", label: "Kitchen Knife" },
  { id: "cutting_board", label: "Cutting Board" },
  { id: "spatula", label: "Spatula / Ladle" },
  { id: "spoon", label: "Spoon" },
  { id: "whisk", label: "Whisk" },
  { id: "peeler", label: "Vegetable Peeler" },
  { id: "rolling_pin", label: "Rolling Pin (Belan)" },
  { id: "grater", label: "Cheese / Ginger Grater" }
];

export function EquipmentGrid() {
  const {
    profile,
    activePresetId,
    toggleHeatSource,
    toggleCookware,
    toggleAppliance,
    toggleBasicTool,
    applyPreset
  } = useKitchenStore();

  return (
    <div className="space-y-8">
      {/* 1-Click Presets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground">
              Instant Kitchen Presets
            </h3>
          </div>
          <span className="text-xs text-muted-foreground">Click to auto-populate</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presetsData.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                className={`flex flex-col text-left p-3.5 rounded-xl border transition relative ${
                  isActive
                    ? "border-orange-500/80 bg-orange-500/10 shadow-xs ring-1 ring-orange-500"
                    : "border-border/60 bg-card hover:bg-secondary/40"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-semibold text-sm">{preset.name}</span>
                  {isActive && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-white text-[10px]">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
                <div className="mt-2 text-[11px] font-medium text-orange-600 dark:text-orange-400">
                  ⏱️ {preset.max_time_minutes} min max
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category 1: Heat Sources */}
      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base">Heat Sources</h3>
            <p className="text-xs text-muted-foreground">
              What heating appliances do you currently have plugged in?
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {heatSourceOptions.map((item) => {
            const isSelected = profile.heat_sources.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleHeatSource(item.id)}
                className={`flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition cursor-pointer text-left ${
                  isSelected
                    ? "border-red-500 bg-red-500/10 text-red-950 dark:text-red-200 font-semibold shadow-xs"
                    : "border-border/50 bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span>{item.label}</span>
                {isSelected ? (
                  <Check className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 ml-1.5" />
                ) : (
                  <span className="h-4 w-4 rounded-full border border-border shrink-0 ml-1.5" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Category 2: Cookware */}
      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <CookingPot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base">Cookware & Pans</h3>
            <p className="text-xs text-muted-foreground">
              Which pots and pans are washed and ready to use?
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {cookwareOptions.map((item) => {
            const isSelected = profile.cookware.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleCookware(item.id)}
                className={`flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition cursor-pointer text-left ${
                  isSelected
                    ? "border-amber-500 bg-amber-500/10 text-amber-950 dark:text-amber-200 font-semibold shadow-xs"
                    : "border-border/50 bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span>{item.label}</span>
                {isSelected ? (
                  <Check className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 ml-1.5" />
                ) : (
                  <span className="h-4 w-4 rounded-full border border-border shrink-0 ml-1.5" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Category 3: Appliances */}
      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <PlugZap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base">Electric Kitchen Appliances</h3>
            <p className="text-xs text-muted-foreground">
              Specialized appliances for grinding, blending, or crisping
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {applianceOptions.map((item) => {
            const isSelected = profile.appliances.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleAppliance(item.id)}
                className={`flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition cursor-pointer text-left ${
                  isSelected
                    ? "border-blue-500 bg-blue-500/10 text-blue-950 dark:text-blue-200 font-semibold shadow-xs"
                    : "border-border/50 bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span>{item.label}</span>
                {isSelected ? (
                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 ml-1.5" />
                ) : (
                  <span className="h-4 w-4 rounded-full border border-border shrink-0 ml-1.5" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Category 4: Basic Tools */}
      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base">Everyday Tools & Prep Utensils</h3>
            <p className="text-xs text-muted-foreground">
              Essential prep tools (knives, cutting boards, spatulas)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {basicToolOptions.map((item) => {
            const isSelected = profile.basic_tools.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleBasicTool(item.id)}
                className={`flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition cursor-pointer text-left ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 font-semibold shadow-xs"
                    : "border-border/50 bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span>{item.label}</span>
                {isSelected ? (
                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-1.5" />
                ) : (
                  <span className="h-4 w-4 rounded-full border border-border shrink-0 ml-1.5" />
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
