"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { OrderStatus } from "@/lib/types";

const statuses: OrderStatus[] = [
  "PENDING",
  "PICKED_UP",
  "WASHING",
  "DELIVERING",
  "COMPLETED",
];

type AdminOrderStatusFormProps = {
  orderId: string;
  currentStatus: OrderStatus;
  password: string;
};

export function AdminOrderStatusForm({
  orderId,
  currentStatus,
  password,
}: AdminOrderStatusFormProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function updateStatus() {
    setIsPending(true);
    setMessage("");

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ status }),
      });

      const payload = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "更新失败");
      }

      setMessage(payload.message ?? "状态已更新");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "更新失败");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <select
          aria-label="订单状态"
          className="min-h-10 rounded-xl border border-white/12 bg-slate-900 px-3 text-sm text-slate-100 outline-none focus:border-cyan-400"
          onChange={(event) => setStatus(event.target.value as OrderStatus)}
          value={status}
        >
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <Button
          className="min-h-10 rounded-xl px-4"
          disabled={isPending}
          onClick={updateStatus}
          variant="secondary"
        >
          {isPending ? "保存中..." : "更新"}
        </Button>
      </div>
      {message ? <p className="text-xs text-slate-400">{message}</p> : null}
    </div>
  );
}
