# Universal Care Platform

通用洗护预约平台 MVP，覆盖前台展示、在线预约、订单 API 和简易管理后台。

## 技术栈

- Next.js 16 + App Router
- TypeScript
- Tailwind CSS 4
- Prisma
- Supabase PostgreSQL
- Vercel
- React Hook Form

## 已实现内容

- 首页：带 SEO 元信息的品牌落地页
- `/services`：服务端读取服务类目并展示价格卡片
- `/book`：三步预约表单，提交到 `POST /api/orders`
- `/api/orders`：支持创建订单与按用户查询历史订单
- `/api/orders/[id]`：支持管理员更新订单状态
- `/admin/orders`：简易后台，可查看订单并调用 PATCH 流转状态
- Prisma Schema：包含 `User`、`ServiceCategory`、`Order`、`OrderItem` 与 `OrderStatus`

## 本地开发

1. 安装依赖

```bash
npm install
```

2. 复制环境变量

```bash
cp .env.example .env
```

Windows PowerShell 可直接新建 `.env` 并填入相同内容。

3. 生成 Prisma Client

```bash
npm run db:generate
```

4. 启动开发环境

```bash
npm run dev
```

默认打开 [http://localhost:3000](http://localhost:3000)。

## 环境变量

- `DATABASE_URL`
  - Supabase PostgreSQL 连接串。
- `ADMIN_DASHBOARD_PASSWORD`
  - 简易后台密码，访问 `/admin/orders` 和调用订单状态更新接口时会用到。
- `NEXT_PUBLIC_SITE_URL`
  - 站点 URL，可用于后续补全 canonical、分享链接或通知地址。

## Prisma 与数据库迁移

当前 schema 位于 `prisma/schema.prisma`，数据源使用 PostgreSQL，适合直接接到 Supabase。

常用命令：

```bash
npm run db:generate
npm run db:push
npm run db:migrate
```

如果你已经在 Supabase 创建项目并填好 `DATABASE_URL`：

1. 运行 `npm run db:push` 快速同步表结构。
2. 或运行 `npm run db:migrate` 生成并执行开发迁移。

## SQL 迁移指引

任务书要求生成可执行 SQL 迁移脚本指示。推荐流程如下：

```bash
npx prisma migrate dev --name init
```

执行后 Prisma 会：

- 生成迁移目录
- 生成对应 SQL 文件
- 同步本地 Prisma Client

如果只想创建 SQL 而暂不应用，可使用：

```bash
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script
```

## 无数据库时的行为

为了保证 MVP 能立即演示：

- 若未配置 `DATABASE_URL`，服务类目会使用本地示例数据。
- 订单创建、订单列表和后台状态更新也会自动回退到内存示例数据。

这意味着页面和 API 可以先联调，等 Supabase 就绪后再切换到真实数据库。

## 推荐注册服务

- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/)

## 后续可继续完善

- 接入 Supabase Auth 或 Clerk 实现真实用户登录
- 为 `/services/[slug]` 增加 SEO 详情页
- 增加图片上传、优惠券、物流轨迹和通知能力
- 用真实管理鉴权替换当前简易密码保护
