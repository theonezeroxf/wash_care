import type {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

export function Table({
  className = "",
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table className={`min-w-full text-left text-sm ${className}`.trim()} {...props} />
  );
}

export function THead({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={`border-b border-white/10 text-slate-400 ${className}`.trim()}
      {...props}
    />
  );
}

export function TBody({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className} {...props} />;
}

export function TH({
  className = "",
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={`px-4 py-3 font-medium ${className}`.trim()} {...props} />;
}

export function TD({
  className = "",
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={`border-b border-white/6 px-4 py-4 align-top text-slate-200 ${className}`.trim()}
      {...props}
    />
  );
}
