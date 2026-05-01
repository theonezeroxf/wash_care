import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-cyan-500 text-slate-950 shadow-[0_12px_30px_rgba(6,182,212,0.25)] hover:bg-cyan-400",
  secondary:
    "border border-slate-700 bg-slate-900 text-slate-50 hover:border-cyan-400 hover:text-cyan-200",
  ghost:
    "border border-white/12 bg-white/6 text-slate-100 hover:bg-white/10",
};

export function Button({
  className = "",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`.trim()}
      {...props}
    />
  );
}
