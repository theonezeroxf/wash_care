import type { Metadata } from "next";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getServiceCategories } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "服务与价格",
  description: "查看洗鞋、洗衣、高档皮具护理等服务类目和基础价格。",
};

export default async function ServicesPage() {
  const services = await getServiceCategories();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-6 py-12 lg:px-10">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Services / 价格体系
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          服务端直连数据源的价格页
        </h1>
        <p className="text-base leading-8 text-slate-300">
          本页是 Server Component，数据通过服务端直接读取。接入 Supabase 后，服务类目会从 Prisma 实时拉取。
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {services.map((service) => (
          <Card
            key={service.id}
            className="flex min-h-72 flex-col justify-between bg-gradient-to-b from-slate-950 to-slate-900"
          >
            <div>
              <p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                {service.seoSlug}
              </p>
              <CardTitle className="mt-5">{service.name}</CardTitle>
              <CardDescription className="mt-4">{service.description}</CardDescription>
            </div>
            <div className="mt-8">
              <p className="text-sm text-slate-400">基础价格</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {formatCurrency(service.basePrice)}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
