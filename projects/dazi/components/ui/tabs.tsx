import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

function Tabs({ tabs, activeTab, onTabChange, className, ...props }: TabsProps) {
  return (
    <div className={cn("flex rounded-xl bg-gray-100 p-1 gap-1", className)} {...props}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
            activeTab === tab.id
              ? "bg-white text-purple-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export { Tabs };
