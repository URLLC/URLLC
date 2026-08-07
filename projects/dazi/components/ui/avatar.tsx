import { cn, getInitials } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-2xl",
};

const gradients = [
  "from-purple-400 to-pink-400",
  "from-blue-400 to-cyan-400",
  "from-green-400 to-emerald-400",
  "from-orange-400 to-yellow-400",
  "from-violet-400 to-purple-400",
];

function hashColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return gradients[Math.abs(hash) % gradients.length];
}

function Avatar({ name, src, size = "md", className, ...props }: AvatarProps) {
  if (src) {
    return (
      <img src={src} alt={name} className={cn("rounded-full object-cover", sizeClasses[size], className)} {...(props as any)} />
    );
  }
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold text-white bg-gradient-to-br",
        hashColor(name),
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {getInitials(name)}
    </div>
  );
}

export { Avatar };
