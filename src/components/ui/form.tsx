import type { HTMLAttributes, LabelHTMLAttributes } from "react";

export function FieldGroup({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={`space-y-2 ${className}`.trim()} {...props} />;
}

export function FieldLabel({
  className = "",
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={`text-sm font-medium text-slate-200 ${className}`.trim()}
      {...props}
    />
  );
}

export function FieldHint({
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-xs text-slate-400 ${className}`.trim()} {...props} />
  );
}

export function FieldError({
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-rose-300 ${className}`.trim()} {...props} />
  );
}
