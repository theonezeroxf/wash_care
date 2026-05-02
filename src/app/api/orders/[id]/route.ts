import { NextResponse } from "next/server";
import { z } from "zod";

import { updateOrderStatus } from "@/lib/data";
import type { OrderStatus } from "@/lib/types";

const statusSchema = z.object({
  status: z.enum([
    "PENDING",
    "PICKED_UP",
    "WASHING",
    "DELIVERING",
    "COMPLETED",
  ]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const body = await request.json();
  const parsed = statusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "无效的订单状态",
      },
      {
        status: 400,
      },
    );
  }

  const adminPassword = process.env.ADMIN_DASHBOARD_PASSWORD ?? "admin123";
  const requestPassword =
    request.headers.get("x-admin-password") ||
    (typeof body.password === "string" ? body.password : "");

  if (requestPassword !== adminPassword) {
    return NextResponse.json(
      {
        error: "管理密码不正确",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const { id } = await params;
    const order = await updateOrderStatus(id, parsed.data.status as OrderStatus);

    return NextResponse.json(
      {
        message: "订单状态已更新",
        order,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "更新订单失败",
      },
      {
        status: 500,
      },
    );
  }
}
