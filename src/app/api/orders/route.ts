import { NextResponse } from "next/server";

import { createOrder, getOrdersForUser } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      {
        error: "缺少 userId 查询参数",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const orders = await getOrdersForUser(userId);

    return NextResponse.json(
      {
        orders,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "查询订单失败",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Parameters<typeof createOrder>[0];
    const order = await createOrder(payload);

    return NextResponse.json(
      {
        message: "预约提交成功",
        orderNumber: order.orderNumber,
        order,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "创建订单失败",
      },
      {
        status: 500,
      },
    );
  }
}
