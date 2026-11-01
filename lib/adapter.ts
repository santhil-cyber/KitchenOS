import { AdaptedStep, KitchenProfile, Recipe, RecipeStep } from "@/types/kitchen";
import { getUserEquipmentSet } from "./scorer";
import { normalizeEquipment } from "./normalizer";
import { findSubstitutionByMethod, findSubstitutionsForMissing } from "./substitution";

/**
 * Rewrites and annotates recipe steps according to the user's kitchen setup.
 */
export function adaptRecipeInstructions(
  recipe: Recipe,
  profile: KitchenProfile
): AdaptedStep[] {
  const userSet = getUserEquipmentSet(profile);
  const adaptedSteps: AdaptedStep[] = [];

  const rawSteps = recipe.instructions;

  rawSteps.forEach((rawStep, index) => {
    let instructionText = "";
    let stepProcess = "";
    let stepUtensils: string[] = [];

    if (typeof rawStep === "string") {
      instructionText = rawStep;
    } else {
      const stepObj = rawStep as RecipeStep;
      instructionText = stepObj.instruction;
      stepProcess = stepObj.process || "";
      stepUtensils = stepObj.utensils || [];
    }

    // Check if step process or utensils conflict with missing equipment
    let isAdapted = false;
    let adaptedText = instructionText;
    let missingItem: string | undefined = undefined;
    let substitutionUsed: string | undefined = undefined;
    let tip: string | undefined = undefined;

    // Check step utensils
    for (const u of stepUtensils) {
      const canonical = normalizeEquipment(u);
      if (canonical && !userSet.has(canonical)) {
        const subs = findSubstitutionsForMissing(canonical, userSet);
        if (subs.length > 0) {
          const rule = subs[0];
          isAdapted = true;
          missingItem = canonical;
          substitutionUsed = rule.substitute_method;
          tip = `Adapted for your setup: ${rule.flavor_note}`;

          // Formulate replacement text
          if (rule.missing_equipment === "oven" && /bake|roast|oven/i.test(adaptedText)) {
            adaptedText = adaptedText.replace(
              /bake.*?(?:oven|°[CF])/gi,
              "cook in a covered pan over low heat"
            );
            adaptedText += ` (KitchenOS Tip: Stovetop adaptation with covered pan, check after 10-15 min)`;
          } else if (rule.missing_equipment === "colander" && /drain.*colander/i.test(adaptedText)) {
            adaptedText = adaptedText.replace(
              /using a colander/gi,
              "carefully holding the pot lid slightly ajar as a strainer"
            );
          } else if (rule.missing_equipment === "deep_pot" && /deep fry/i.test(adaptedText)) {
            adaptedText = adaptedText.replace(
              /deep fry.*deep pot/gi,
              "shallow fry in your pan with 1.5cm oil, flipping halfway"
            );
          } else if (rule.missing_equipment === "steamer" && /steamer/i.test(adaptedText)) {
            adaptedText = adaptedText.replace(
              /in a steamer/gi,
              "in your pot elevated on an inverted heat-proof plate with 2cm water"
            );
          } else if (rule.missing_equipment === "pressure_cooker" && /pressure cook/i.test(adaptedText)) {
            adaptedText = adaptedText.replace(
              /pressure cook.*for \d+ whistles/gi,
              "simmer gently in a covered pot with extra water for 35-40 minutes"
            );
          }
          break;
        }
      }
    }

    // Check process if not already adapted
    if (!isAdapted && stepProcess) {
      const rule = findSubstitutionByMethod(stepProcess.toLowerCase(), userSet);
      if (rule) {
        isAdapted = true;
        missingItem = rule.missing_equipment;
        substitutionUsed = rule.substitute_method;
        tip = rule.flavor_note;
        adaptedText += ` [Adapted: ${rule.instruction_template.replace("{time}", "recommended")}]`;
      }
    }

    adaptedSteps.push({
      step_number: index + 1,
      original_instruction: instructionText,
      adapted_instruction: adaptedText,
      is_adapted: isAdapted,
      missing_item: missingItem,
      substitution_used: substitutionUsed,
      tip: tip
    });
  });

  return adaptedSteps;
}
