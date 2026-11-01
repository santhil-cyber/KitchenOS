import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "KitchenOS — Your Kitchen, Your Rules",
  description:
    "Computational gastronomy engine that adapts recipes from RecipeDB & FlavorDB to your available kitchen equipment and time constraint.",
  keywords: [
    "computational gastronomy",
    "RecipeDB",
    "FlavorDB",
    "Foodoscope",
    "kitchen equipment",
    "recipe adapter",
    "IIIT Delhi"
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased selection:bg-orange-500/20 selection:text-orange-600">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border/40 bg-secondary/20 py-8 text-center text-xs text-muted-foreground">
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">KitchenOS</span>
              <span>· Built for Foodoscope ForkIT Challenge (4th Edition)</span>
            </div>
            <div>
              Powered by <span className="font-medium text-foreground">CoSy Lab, IIIT Delhi</span> (RecipeDB + FlavorDB)
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
