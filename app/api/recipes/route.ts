import { NextRequest, NextResponse } from "next/server";
import { fetchRecipes } from "@/lib/recipedb";
import { scoreRecipe } from "@/lib/scorer";
import { adaptRecipeInstructions } from "@/lib/adapter";
import { KitchenProfile, ScoredRecipe } from "@/types/kitchen";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profile: KitchenProfile = body.profile;
    const query: string = body.query || "";
    const cuisine: string = body.cuisine || "all";
    const minScore: number = body.minScore !== undefined ? Number(body.minScore) : 0;

    if (!profile) {
      return NextResponse.json({ error: "Missing kitchen profile" }, { status: 400 });
    }

    // 1. Fetch from RecipeDB
    const recipes = await fetchRecipes({
      query: query || undefined,
      cuisine: cuisine !== "all" ? cuisine : undefined
    });

    // 2. Score and adapt each recipe
    const scoredList: ScoredRecipe[] = recipes.map((recipe) => {
      const scored = scoreRecipe(recipe, profile);
      const adapted = adaptRecipeInstructions(recipe, profile);
      return {
        ...scored,
        adapted_instructions: adapted
      };
    });

    // 3. Filter by minimum score
    const filtered = scoredList.filter((s) => s.compatibility_score >= minScore);

    // 4. Sort: compatibility score DESC, then adjusted_time ASC
    filtered.sort((a, b) => {
      if (b.compatibility_score !== a.compatibility_score) {
        return b.compatibility_score - a.compatibility_score;
      }
      return a.adjusted_time - b.adjusted_time;
    });

    return NextResponse.json({
      total: filtered.length,
      recipes: filtered
    });
  } catch (error) {
    console.error("API /recipes error:", error);
    return NextResponse.json(
      { error: "Internal server error processing recipes" },
      { status: 500 }
    );
  }
}
