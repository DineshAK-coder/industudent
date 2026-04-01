import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "secondary" | "outline" | "destructive";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border";

  const variantClasses: Record<string, string> = {
    default:
      "bg-slate-600 text-white border-slate-600",
    secondary:
      "bg-slate-100 text-slate-900 border-slate-200",
    outline:
      "bg-transparent text-slate-600 border-slate-300",
    destructive:
      "bg-red-600 text-white border-red-600",
  };

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
