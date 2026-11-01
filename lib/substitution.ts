import substitutionRulesData from "@/data/substitution-rules.json";
import { SubstitutionRule } from "@/types/kitchen";

const rules: SubstitutionRule[] = substitutionRulesData as SubstitutionRule[];

/**
 * Finds applicable substitution rules for a missing equipment item,
 * given the user's available equipment set.
 */
export function findSubstitutionsForMissing(
  missingEquipment: string,
  userEquipmentSet: Set<string>
): SubstitutionRule[] {
  return rules.filter((rule) => {
    if (rule.missing_equipment !== missingEquipment) {
      return false;
    }
    // Check if user has ALL required substitute equipment
    return rule.required_equipment.every((req) => userEquipmentSet.has(req));
  });
}

/**
 * Finds substitution rule by original method / process (e.g., 'bake', 'deep_fry')
 */
export function findSubstitutionByMethod(
  method: string,
  userEquipmentSet: Set<string>
): SubstitutionRule | undefined {
  return rules.find(
    (rule) =>
      rule.original_method === method &&
      rule.required_equipment.every((req) => userEquipmentSet.has(req))
  );
}

export function getAllSubstitutionRules(): SubstitutionRule[] {
  return rules;
}

