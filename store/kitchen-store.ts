"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Appliance,
  BasicTool,
  Cookware,
  HeatSource,
  KitchenProfile
} from "@/types/kitchen";
import presetsData from "@/data/presets.json";

interface KitchenState {
  profile: KitchenProfile;
  activePresetId: string | null;
  searchQuery: string;
  selectedCuisine: string;
  minScoreFilter: number;

  // Actions
  toggleHeatSource: (item: HeatSource) => void;
  toggleCookware: (item: Cookware) => void;
  toggleAppliance: (item: Appliance) => void;
  toggleBasicTool: (item: BasicTool) => void;
  setMaxTime: (minutes: number) => void;
  applyPreset: (presetId: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCuisine: (cuisine: string) => void;
  setMinScoreFilter: (score: number) => void;
  resetToDefault: () => void;
}

const defaultProfile: KitchenProfile = {
  heat_sources: ["induction"],
  cookware: ["pan"],
  appliances: [],
  basic_tools: ["knife", "cutting_board", "spatula", "spoon"],
  max_time_minutes: 25
};

export const useKitchenStore = create<KitchenState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      activePresetId: "college_dorm",
      searchQuery: "",
      selectedCuisine: "all",
      minScoreFilter: 0,

      toggleHeatSource: (item) =>
        set((state) => {
          const exists = state.profile.heat_sources.includes(item);
          const next = exists
            ? state.profile.heat_sources.filter((i) => i !== item)
            : [...state.profile.heat_sources, item];
          return {
            profile: { ...state.profile, heat_sources: next },
            activePresetId: null
          };
        }),

      toggleCookware: (item) =>
        set((state) => {
          const exists = state.profile.cookware.includes(item);
          const next = exists
            ? state.profile.cookware.filter((i) => i !== item)
            : [...state.profile.cookware, item];
          return {
            profile: { ...state.profile, cookware: next },
            activePresetId: null
          };
        }),

      toggleAppliance: (item) =>
        set((state) => {
          const exists = state.profile.appliances.includes(item);
          const next = exists
            ? state.profile.appliances.filter((i) => i !== item)
            : [...state.profile.appliances, item];
          return {
            profile: { ...state.profile, appliances: next },
            activePresetId: null
          };
        }),

      toggleBasicTool: (item) =>
        set((state) => {
          const exists = state.profile.basic_tools.includes(item);
          const next = exists
            ? state.profile.basic_tools.filter((i) => i !== item)
            : [...state.profile.basic_tools, item];
          return {
            profile: { ...state.profile, basic_tools: next },
            activePresetId: null
          };
        }),

      setMaxTime: (minutes) =>
        set((state) => ({
          profile: { ...state.profile, max_time_minutes: minutes }
        })),

      applyPreset: (presetId) => {
        const found = presetsData.find((p) => p.id === presetId);
        if (found) {
          set({
            profile: {
              heat_sources: found.heat_sources as HeatSource[],
              cookware: found.cookware as Cookware[],
              appliances: found.appliances as Appliance[],
              basic_tools: found.basic_tools as BasicTool[],
              max_time_minutes: found.max_time_minutes
            },
            activePresetId: presetId
          });
        }
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCuisine: (cuisine) => set({ selectedCuisine: cuisine }),
      setMinScoreFilter: (score) => set({ minScoreFilter: score }),

      resetToDefault: () =>
        set({
          profile: defaultProfile,
          activePresetId: "college_dorm",
          searchQuery: "",
          selectedCuisine: "all",
          minScoreFilter: 0
        })
    }),
    {
      name: "kitchenos-storage"
    }
  )
);

