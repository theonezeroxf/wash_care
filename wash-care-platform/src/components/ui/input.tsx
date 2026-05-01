import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`min-h-12 w-full rounded-2xl border border-white/12 bg-slate-900 px-4 text-sm text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 ${className}`.trim()}
      {...props}
    />
  );
}

export function Textarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`min-h-28 w-full rounded-2xl border border-white/12 bg-slate-900 px-4 py-3 text-sm text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 ${className}`.trim()}
      {...props}
    />
  );
}
