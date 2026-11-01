import sampleRecipesData from "@/data/sample-recipes.json";
import { Recipe } from "@/types/kitchen";

const sampleRecipes: Recipe[] = sampleRecipesData as Recipe[];

export interface SearchRecipeParams {
  query?: string;
  cuisine?: string;
  maxTime?: number;
  limit?: number;
}

export async function fetchRecipes(params: SearchRecipeParams = {}): Promise<Recipe[]> {
  const apiKey = process.env.RECIPEDB_API_KEY;
  const baseUrl = process.env.RECIPEDB_BASE_URL;

  // If live credentials are provided in environment, query remote CoSyLab RecipeDB
  if (apiKey && baseUrl) {
    try {
      const url = new URL(`${baseUrl}/api/v1/recipes`);
      if (params.query) url.searchParams.set("q", params.query);
      if (params.cuisine) url.searchParams.set("cuisine", params.cuisine);
      if (params.limit) url.searchParams.set("limit", params.limit.toString());

      const res = await fetch(url.toString(), {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "x-api-key": apiKey,
          "Accept": "application/json"
        },
        next: { revalidate: 3600 }
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.recipes)) {
          return data.recipes;
        } else if (Array.isArray(data)) {
          return data;
        }
      }
    } catch (err) {
      console.warn("RecipeDB remote fetch failed, using local computational gastronomy corpus:", err);
    }
  }

  // Local computational gastronomy dataset
  let results = [...sampleRecipes];

  if (params.query) {
    const q = params.query.toLowerCase();
    results = results.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.ingredients.some((ing) => (typeof ing === "string" ? ing : ing.name).toLowerCase().includes(q))
    );
  }

  if (params.cuisine && params.cuisine !== "all") {
    results = results.filter((r) => r.cuisine.toLowerCase() === params.cuisine?.toLowerCase());
  }

  if (params.maxTime) {
    results = results.filter((r) => r.total_time <= (params.maxTime || 999));
  }

  return results;
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const all = await fetchRecipes();
  return all.find((r) => r.id === id) || null;
}

