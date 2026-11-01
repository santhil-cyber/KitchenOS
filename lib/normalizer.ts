import normalizationData from "@/data/normalization-map.json";

const map: Record<string, string> = normalizationData;

/**
 * Normalizes any utensil or equipment term from RecipeDB / user input
 * to the canonical KitchenOS equipment ID.
 */
export function normalizeEquipment(name: string): string {
  if (!name) return "";
  const cleaned = name.trim().toLowerCase();
  
  if (map[cleaned]) {
    return map[cleaned];
  }

  // Substring fallback check
  for (const [key, canonical] of Object.entries(map)) {
    if (cleaned.includes(key)) {
      return canonical;
    }
  }

  // Strip non-alphanumeric and replace spaces
  return cleaned.replace(/[^a-z0-9]+/g, "_");
}

