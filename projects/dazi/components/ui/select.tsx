import { cn } from "@/lib/utils";
import { forwardRef, type SelectHTMLAttributes } from "react";

const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      className={cn(
        "flex h-11 w-full rounded-xl border-2 border-warm-100 bg-white px-4 py-2 text-sm text-soft-800 focus-visible:outline-none focus-visible:border-warm-400 focus-visible:ring-2 focus-visible:ring-warm-100 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

export { Select };
