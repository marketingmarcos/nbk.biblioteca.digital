import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs font-medium text-fg", className)}>
      {children}
    </span>
  );
}
