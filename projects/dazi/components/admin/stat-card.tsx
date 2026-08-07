import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color?: string;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, color = "text-purple-400", className }: StatCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gray-800 flex items-center justify-center">
          <Icon className={cn("h-5 w-5", color)} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-100">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}
