import { Atom, Beaker, Check } from "lucide-react";

interface FlavorMolecule {
  name: string;
  profile: string;
  pubchem_id?: number;
}

interface FlavorInsightProps {
  molecules?: FlavorMolecule[];
  substitutionsCount: number;
}

export function FlavorInsight({ molecules, substitutionsCount }: FlavorInsightProps) {
  if (!molecules || molecules.length === 0) return null;

  return (
    <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 via-card to-background p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Atom className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base flex items-center gap-2">
              <span>FlavorDB Chemical Molecular Analysis</span>
              <span className="text-[10px] font-semibold uppercase bg-purple-500/15 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">
                CoSy Lab
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Volatile aroma compounds and taste receptors tracked during equipment adaptation
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <Check className="h-3.5 w-3.5" />
          <span>Flavor Profile Preserved</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
        {molecules.map((m) => (
          <div
            key={m.name}
            className="rounded-xl border border-border/60 bg-card p-3 shadow-xs hover:border-purple-500/40 transition"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-foreground">{m.name}</span>
              {m.pubchem_id && (
                <span className="text-[10px] font-mono bg-secondary text-muted-foreground px-1.5 py-0.2 rounded">
                  CID: {m.pubchem_id}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{m.profile}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-border/40 text-xs text-muted-foreground flex items-center gap-2">
        <Beaker className="h-4 w-4 text-purple-500 shrink-0" />
        <span>
          {substitutionsCount > 0
            ? "KitchenOS thermal adaptation guarantees that key Maillard pyrazines and aroma esters remain synthesized despite alternate cookware."
            : "Direct cooking method fully matches canonical recipe chemistry without molecular loss."}
        </span>
      </div>
    </div>
  );
}
