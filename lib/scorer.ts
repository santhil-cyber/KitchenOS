import equipmentMapData from "@/data/equipment-map.json";
import { normalizeEquipment } from "./normalizer";
import { findSubstitutionsForMissing } from "./substitution";
import { KitchenProfile, Recipe, ScoredRecipe, SubstitutionRule } from "@/types/kitchen";

const equipmentMap: Record<string, { requires: string[]; alternatives: string[] }> =
  equipmentMapData;

export function getUserEquipmentSet(profile: KitchenProfile): Set<string> {
  const set = new Set<string>();

  profile.heat_sources.forEach((item) => set.add(normalizeEquipment(item)));
  profile.cookware.forEach((item) => set.add(normalizeEquipment(item)));
  profile.appliances.forEach((item) => set.add(normalizeEquipment(item)));
  profile.basic_tools.forEach((item) => set.add(normalizeEquipment(item)));

  // Common cross-compatibility aliases:
  // If user has saucepan, they also have a small pot
  if (set.has("saucepan")) set.add("pot");
  if (set.has("pan")) set.add("skillet");
  // Basic fallback: if user has any heat source, add 'any_heat'
  if (profile.heat_sources.length > 0) set.add("any_heat");

  return set;
}

/**
 * Extracts and normalizes all equipment required by a recipe
 * by cross-referencing its culinary processes and utensils.
 */
export function extractRequiredEquipment(recipe: Recipe): string[] {
  const required = new Set<string>();

  // Extract from processes
  if (recipe.processes && Array.isArray(recipe.processes)) {
    for (const process of recipe.processes) {
      const procKey = process.toLowerCase().trim();
      const mapped = equipmentMap[procKey];
      if (mapped && mapped.requires) {
        mapped.requires.forEach((req) => required.add(normalizeEquipment(req)));
      }
    }
  }

  // Extract from declared utensils
  if (recipe.utensils && Array.isArray(recipe.utensils)) {
    for (const utensil of recipe.utensils) {
      const canonical = normalizeEquipment(utensil);
      if (canonical) {
        required.add(canonical);
      }
    }
  }

  return Array.from(required);
}

/**
 * Scores a recipe against the user's available kitchen profile
 */
export function scoreRecipe(recipe: Recipe, profile: KitchenProfile): ScoredRecipe {
  const userSet = getUserEquipmentSet(profile);
  const requiredEquipment = extractRequiredEquipment(recipe);

  // If a recipe specifies no equipment, treat as minimal basics
  if (requiredEquipment.length === 0) {
    return {
      recipe,
      compatibility_score: 100,
      matched_equipment: [],
      missing_equipment: [],
      substitutions: [],
      adjusted_time: recipe.total_time,
      is_time_compatible: recipe.total_time <= profile.max_time_minutes,
      tier: "perfect"
    };
  }

  const matched: string[] = [];
  const missing: string[] = [];
  const appliedSubstitutions: SubstitutionRule[] = [];
  let adjustedTime = recipe.total_time;

  for (const item of requiredEquipment) {
    if (userSet.has(item)) {
      matched.push(item);
    } else {
      missing.push(item);
      // Check if there is an available substitution rule
      const subs = findSubstitutionsForMissing(item, userSet);
      if (subs.length > 0) {
        const bestSub = subs[0];
        appliedSubstitutions.push(bestSub);
        // Apply time adjustment
        adjustedTime = Math.round(adjustedTime * bestSub.time_multiplier + bestSub.time_flat_minutes);
      }
    }
  }

  // Base raw match
  const rawScore = (matched.length / requiredEquipment.length) * 100;
  
  // Solved missing items via substitution receive 85% partial credit
  const solvedBySub = appliedSubstitutions.length;
  const unsolvableMissing = missing.length - solvedBySub;

  let finalScore: number;
  if (missing.length === 0) {
    finalScore = 100;
  } else if (unsolvableMissing === 0) {
    // All missing equipment can be smoothly substituted!
    finalScore = Math.min(95, Math.round(rawScore + (solvedBySub / requiredEquipment.length) * 85));
  } else {
    // Missing critical equipment that user cannot substitute
    finalScore = Math.max(10, Math.round(rawScore + (solvedBySub / requiredEquipment.length) * 40));
  }

  let tier: "perfect" | "doable" | "incompatible" = "incompatible";
  if (finalScore >= 98 && missing.length === 0) {
    tier = "perfect";
  } else if (finalScore >= 70) {
    tier = "doable";
  }

  const isTimeCompatible = adjustedTime <= profile.max_time_minutes;

  return {
    recipe,
    compatibility_score: finalScore,
    matched_equipment: matched,
    missing_equipment: missing,
    substitutions: appliedSubstitutions,
    adjusted_time: adjustedTime,
    is_time_compatible: isTimeCompatible,
    tier
  };
}

