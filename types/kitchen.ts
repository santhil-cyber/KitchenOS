export type HeatSource =
  | "induction"
  | "gas_stove"
  | "microwave"
  | "oven"
  | "toaster"
  | "air_fryer"
  | "electric_kettle";

export type Cookware =
  | "pan"
  | "pot"
  | "saucepan"
  | "pressure_cooker"
  | "wok"
  | "baking_tray"
  | "colander"
  | "deep_pot"
  | "steamer";

export type Appliance =
  | "blender"
  | "mixer"
  | "food_processor"
  | "toaster"
  | "air_fryer";

export type BasicTool =
  | "knife"
  | "cutting_board"
  | "spatula"
  | "whisk"
  | "spoon"
  | "peeler"
  | "rolling_pin"
  | "grater";

export type EquipmentCategory = "heat_sources" | "cookware" | "appliances" | "basic_tools";

export interface KitchenEquipmentItem {
  id: string;
  name: string;
  category: EquipmentCategory;
  icon: string;
  description?: string;
}

export interface KitchenProfile {
  id?: string;
  name?: string;
  heat_sources: HeatSource[];
  cookware: Cookware[];
  appliances: Appliance[];
  basic_tools: BasicTool[];
  max_time_minutes: number;
}

export interface SubstitutionRule {
  missing_equipment: string;
  original_method: string;
  substitute_method: string;
  required_equipment: string[];
  instruction_template: string;
  time_multiplier: number;
  time_flat_minutes: number;
  flavor_impact: "preserved" | "minor_loss" | "altered";
  flavor_note: string;
}

export interface ProcessMapItem {
  requires: string[];
  alternatives: string[];
  description?: string;
}

export interface RecipeIngredient {
  name: string;
  amount?: string;
  unit?: string;
  category?: string;
  flavor_id?: number;
}

export interface RecipeStep {
  step_number: number;
  instruction: string;
  process?: string;
  utensils?: string[];
}

export interface RecipeNutrition {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g?: number;
}

export interface Recipe {
  id: string;
  title: string;
  cuisine: string;
  region?: string;
  total_time: number;
  calories?: number;
  nutrition?: RecipeNutrition;
  image_url?: string;
  ingredients: (string | RecipeIngredient)[];
  processes: string[];
  utensils: string[];
  instructions: (string | RecipeStep)[];
  flavor_molecules?: {
    name: string;
    profile: string;
    pubchem_id?: number;
  }[];
}

export interface AdaptedStep {
  step_number: number;
  original_instruction: string;
  adapted_instruction: string;
  is_adapted: boolean;
  missing_item?: string;
  substitution_used?: string;
  tip?: string;
}

export interface ScoredRecipe {
  recipe: Recipe;
  compatibility_score: number; // 0 - 100
  matched_equipment: string[];
  missing_equipment: string[];
  substitutions: SubstitutionRule[];
  adjusted_time: number;
  is_time_compatible: boolean;
  tier: "perfect" | "doable" | "incompatible"; // perfect: 100%, doable: 70-99%, incompatible: <70%
  adapted_instructions?: AdaptedStep[];
}

