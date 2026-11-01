import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompatibilityBadgeProps {
  score: number;
  tier: "perfect" | "doable" | "incompatible";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CompatibilityBadge({
  score,
  tier,
  className,
  size = "md"
}: CompatibilityBadgeProps) {
  const isPerfect = tier === "perfect" || score >= 98;
  const isDoable = tier === "doable" || (score >= 70 && score < 98);

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs sm:text-sm gap-1.5",
    lg: "px-3.5 py-1.5 text-sm sm:text-base gap-2 font-semibold"
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  if (isPerfect) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20 shadow-xs",
          sizeClasses[size],
          className
        )}
      >
        <CheckCircle2 className={iconSizes[size]} />
        <span>100% Ready</span>
      </span>
    );
  }

  if (isDoable) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20 shadow-xs",
          sizeClasses[size],
          className
        )}
      >
        <AlertTriangle className={iconSizes[size]} />
        <span>{score}% Adapted</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium border border-rose-500/20",
        sizeClasses[size],
        className
      )}
    >
      <XCircle className={iconSizes[size]} />
      <span>{score}% Missing Tools</span>
    </span>
  );
}
