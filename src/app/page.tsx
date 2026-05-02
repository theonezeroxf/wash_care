import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getServiceCategories } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default async function Home() {
  const services = await getServiceCategories();
  const featured = services.slice(0, 3);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-14 px-6 py-10 lg:px-10">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-8">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Universal Care / 上门洗护预约
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              把洗鞋、洗衣和皮具护理做成一套高 SEO 的预约平台
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              基于 Next.js App Router、Prisma 和 Serverless API 的洗护 MVP。前台完成预约，后台流转状态，数据库接到 Supabase 后即可上线到 Vercel。
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/book">
              <Button className="w-full sm:w-auto">立即预约</Button>
            </Link>
            <Link href="/services">
              <Button className="w-full sm:w-auto" variant="secondary">
                查看服务与价格
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "SEO 友好", value: "SSR / Metadata / App Router" },
              { label: "服务闭环", value: "预约页 + API + 管理后台" },
              { label: "数据接入", value: "Supabase + Prisma 就绪" },
            ].map((item) => (
              <Card key={item.label} className="bg-white/4 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  {item.label}
                </p>
                <p className="mt-3 text-base font-medium text-slate-100">{item.value}</p>
              </Card>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden bg-[linear-gradient(160deg,rgba(8,47,73,0.9),rgba(2,6,23,1)),radial-gradient(circle_at_top,rgba(34,211,238,0.35),transparent_35%)] p-8 lg:p-10">
          <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-6">
            <p className="text-sm font-medium text-cyan-200">热门服务预览</p>
            <div className="mt-5 space-y-4">
              {featured.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/4 px-4 py-4"
                >
                  <div>
                    <p className="font-medium text-slate-50">{service.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{service.description}</p>
                  </div>
                  <p className="text-sm font-semibold text-cyan-200">
                    {formatCurrency(service.basePrice)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {[
          {
            title: "多品类适配",
            body: "衣物、鞋履、包袋都通过统一 ServiceCategory 模型承载，方便持续扩类目。",
          },
          {
            title: "订单状态清晰",
            body: "PENDING 到 COMPLETED 全链路可见，前台和后台都共享同一套状态枚举。",
          },
          {
            title: "低成本上线",
            body: "免费组合是 Next.js + Supabase + Vercel，MVP 可以先快跑，再按业务量升级。",
          },
        ].map((item) => (
          <Card key={item.title} className="bg-slate-950">
            <h2 className="text-xl font-semibold text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">{item.body}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
