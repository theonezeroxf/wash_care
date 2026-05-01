export function formatCurrency(amountInCents: number) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(amountInCents / 100);
}

export function formatOrderTime(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function generateOrderNumber() {
  const now = new Date();
  const date =
    `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
      now.getDate(),
    ).padStart(2, "0")}`;
  const suffix = Math.floor(Math.random() * 9000) + 1000;

  return `WC-${date}-${suffix}`;
}
