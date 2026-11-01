"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, ChefHat, Sparkles } from "lucide-react";
import { useKitchenStore } from "@/store/kitchen-store";

export function Navbar() {
  const pathname = usePathname();
  const profile = useKitchenStore((s) => s.profile);

  const totalEquipmentCount =
    profile.heat_sources.length +
    profile.cookware.length +
    profile.appliances.length +
    profile.basic_tools.length;

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/20">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight">KitchenOS</span>
              <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                ForkIT 4.0
              </span>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              RecipeDB + FlavorDB Computational Engine
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              pathname === "/"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            }`}
          >
            <ChefHat className="h-4 w-4" />
            <span>My Kitchen</span>
            <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.2 text-xs font-semibold text-primary">
              {totalEquipmentCount}
            </span>
          </Link>

          <Link
            href="/recipes"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              pathname.startsWith("/recipes")
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Matched Recipes</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
