import { NextRequest, NextResponse } from "next/server";
import { getIngredientSubstitutes } from "@/lib/flavordb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ingredient = searchParams.get("ingredient");

  if (!ingredient) {
    return NextResponse.json({ error: "Missing ingredient query" }, { status: 400 });
  }

  const result = await getIngredientSubstitutes(ingredient);
  return NextResponse.json({ substitute: result });
}
