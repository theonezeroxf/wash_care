import type { Metadata } from "next";
import Link from "next/link";

import { AdminOrderStatusForm } from "@/components/admin-order-status-form";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { getAllOrders } from "@/lib/data";
import type { OrderItemRecord, OrderRecord } from "@/lib/types";
import { formatCurrency, formatOrderTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "订单后台",
  description: "简易版管理后台，用于查看所有订单并流转状态。",
};

type SearchParams = Promise<{
  password?: string;
}>;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const password = params.password ?? "";
  const expectedPassword = process.env.ADMIN_DASHBOARD_PASSWORD ?? "admin123";

  if (password !== expectedPassword) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-1 items-center px-6 py-16">
        <Card className="w-full bg-slate-950">
          <CardTitle>输入管理密码</CardTitle>
          <CardDescription className="mt-3">
            这是一个简易版后台鉴权，使用环境变量 `ADMIN_DASHBOARD_PASSWORD` 保护订单页。
          </CardDescription>
          <form className="mt-6 space-y-4" method="GET">
            <input
              className="min-h-12 w-full rounded-2xl border border-white/12 bg-slate-900 px-4 text-sm text-slate-50 outline-none focus:border-cyan-400"
              name="password"
              placeholder="输入后台密码"
              type="password"
            />
            <Button className="w-full" type="submit">
              进入后台
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  const orders = await getAllOrders();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-12 lg:px-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Admin / 订单后台
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            所有用户订单与状态流转
          </h1>
          <p className="max-w-3xl text-base leading-8 text-slate-300">
            当前共 {orders.length} 条订单。状态更新通过 `PATCH /api/orders/[id]` 完成，适合 MVP 阶段演示完整后端链路。
          </p>
        </div>
        <Link href="/book">
          <Button variant="secondary">回到预约页</Button>
        </Link>
      </div>

      <Card className="overflow-hidden bg-slate-950 p-0">
        <div className="overflow-x-auto">
          <Table>
            <THead>
              <tr>
                <TH>订单号</TH>
                <TH>用户</TH>
                <TH>地址</TH>
                <TH>内容</TH>
                <TH>金额</TH>
                <TH>创建时间</TH>
                <TH>状态流转</TH>
              </tr>
            </THead>
            <TBody>
              {orders.map((order: OrderRecord) => (
                <tr key={order.id}>
                  <TD className="font-medium text-white">{order.orderNumber}</TD>
                  <TD>
                    <div className="space-y-1">
                      <p>{order.user.fullName || "未命名用户"}</p>
                      <p className="text-xs text-slate-400">
                        {order.user.phone || order.user.email}
                      </p>
                    </div>
                  </TD>
                  <TD className="max-w-xs whitespace-normal">{order.pickupAddress}</TD>
                  <TD>
                    <div className="space-y-2">
                      {order.items.map((item: OrderItemRecord) => (
                        <div key={item.id}>
                          <p>{item.itemName}</p>
                          <p className="text-xs text-slate-400">
                            {item.serviceCategory.name} × {item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </TD>
                  <TD>{formatCurrency(order.totalAmount)}</TD>
                  <TD>{formatOrderTime(order.createdAt)}</TD>
                  <TD>
                    <AdminOrderStatusForm
                      currentStatus={order.status}
                      orderId={order.id}
                      password={password}
                    />
                  </TD>
                </tr>
              ))}
            </TBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
