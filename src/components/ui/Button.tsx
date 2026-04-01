import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "ghost" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  label?: string;
}

const buttonClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-violet-500 text-white shadow-[0_20px_60px_rgba(124,58,237,0.18)] hover:bg-violet-400 focus-visible:ring-violet-400/60",
  ghost:
    "border border-white/15 bg-white/5 text-slate-100 hover:bg-white/10 focus-visible:ring-slate-300/30",
  secondary:
    "bg-slate-200 text-slate-950 hover:bg-slate-300 focus-visible:ring-slate-400/50",
};

function Button({ variant = "primary", className, label, children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60",
        buttonClasses[variant],
        className
      )}
      suppressHydrationWarning
      {...props}
    >
      {label || children}
    </button>
  );
}

export { Button };
export default Button;
