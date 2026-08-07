import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {Icon && <Icon className="h-10 w-10 mx-auto text-gray-600 mb-3" />}
      <p className="text-gray-400 font-medium">{title}</p>
      {description && <p className="text-gray-600 text-sm mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
