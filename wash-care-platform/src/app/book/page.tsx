import type { Metadata } from "next";

import { BookingForm } from "@/components/booking-form";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getServiceCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "在线预约",
  description: "在线完成洗护预约，三步提交衣物、鞋履和皮具上门取件订单。",
};

export default async function BookPage() {
  const categories = await getServiceCategories();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-6 py-12 lg:px-10">
      <Card className="overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.24),_transparent_35%),linear-gradient(135deg,#020617,#111827_50%,#082f49)] p-8 lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">
          Book / 预约下单
        </p>
        <CardTitle className="mt-4 max-w-3xl text-4xl sm:text-5xl">
          快速预约上门洗护，先用页面跑通业务闭环
        </CardTitle>
        <CardDescription className="mt-4 max-w-2xl text-base text-slate-300">
          这套页面直接对接 `POST /api/orders`。数据库就绪后会自动走 Prisma；未配置时会回退到本地示例数据，方便先开发和演示。
        </CardDescription>
      </Card>

      <BookingForm categories={categories} />
    </div>
  );
}
