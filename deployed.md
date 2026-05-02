# Wash Care Platform 部署步骤

本文档用于将 `wash-care-platform` 部署到 `Supabase + Vercel`。

## 1. 前置准备

- 已有一个 Supabase 项目
- 已有一个 Vercel 账号
- 本地已安装 Node.js 20+
- 本地已安装 npm

项目目录：

```powershell
cd D:\codex\workspace\wash_care\wash-care-platform
```

## 2. 配置环境变量

在项目根目录创建或更新 `.env`：

```env
NEXT_PUBLIC_SUPABASE_URL=https://omxusykzjdvjqxyhuvmb.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_0_0wzLlGAMmtfU27MjkeIQ_PVhKZ3gf
DATABASE_URL=你的 Supabase Postgres 连接串
SUPABASE_SERVICE_ROLE_KEY=你的 service role key
ADMIN_DASHBOARD_PASSWORD=你自定义的后台密码
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

说明：

- `NEXT_PUBLIC_SUPABASE_URL`：你的 Supabase 项目地址
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`：前端公开 key
- `DATABASE_URL`：Prisma 连接数据库必填
- `SUPABASE_SERVICE_ROLE_KEY`：当前项目不是强制使用，但建议提前配置
- `ADMIN_DASHBOARD_PASSWORD`：后台 `/admin/orders` 的访问密码
- `NEXT_PUBLIC_SITE_URL`：本地可先写 `http://localhost:3000`，生产环境再改成正式域名

## 3. 获取 Supabase 数据库连接串

在 Supabase 控制台中找到 Postgres 连接信息，拿到 `DATABASE_URL`。

通常路径是：

1. 打开 Supabase 项目
2. 进入 `Settings`
3. 进入 `Database`
4. 找到连接字符串
5. 选择适合 Prisma 的 `URI` 格式

把它填入 `.env` 的 `DATABASE_URL`。

## 4. 安装依赖

```powershell
npm install
```

## 5. 生成 Prisma Client

先确保 `.env` 中已经有可用的 `DATABASE_URL`，然后执行：

```powershell
npm run db:generate
```

## 6. 初始化数据库表结构

如果你是第一次部署，推荐先直接推送 schema：

```powershell
npm run db:push
```

如果你希望保留正式迁移记录，可改用：

```powershell
npm run db:migrate
```

说明：

- `db:push`：适合 MVP 或首次快速初始化
- `db:migrate`：适合后续长期维护和版本化迁移

## 7. 本地验证

启动开发环境：

```powershell
npm run dev
```

检查以下页面是否正常：

- `/`
- `/services`
- `/book`
- `/admin/orders?password=你设置的后台密码`

再执行一次质量检查：

```powershell
npm run lint
npm run build
```

如果这两步通过，说明可以进入部署。

## 8. 推送代码到 Git 仓库

如果项目还没有推到 GitHub，先初始化并推送：

```powershell
git init
git add .
git commit -m "Prepare deployment"
```

然后把仓库推到 GitHub。

如果仓库已经存在，直接提交并推送最新代码即可。

## 9. 部署到 Vercel

1. 打开 Vercel 控制台
2. 点击 `Add New`
3. 选择 `Project`
4. 导入你的 GitHub 仓库
5. Framework 选择 `Next.js`
6. 在 Environment Variables 中填写以下变量：

```env
NEXT_PUBLIC_SUPABASE_URL=https://omxusykzjdvjqxyhuvmb.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_0_0wzLlGAMmtfU27MjkeIQ_PVhKZ3gf
DATABASE_URL=你的 Supabase Postgres 连接串
SUPABASE_SERVICE_ROLE_KEY=你的 service role key
ADMIN_DASHBOARD_PASSWORD=你自定义的后台密码
NEXT_PUBLIC_SITE_URL=https://你的正式域名
```

7. 点击部署

## 10. 生产环境验证

部署完成后，检查：

1. 首页是否正常打开
2. 服务列表页是否正常读取
3. 预约表单是否能成功提交
4. Supabase 数据库中是否生成了 `User`、`Order`、`OrderItem`、`ServiceCategory` 数据
5. 后台页面 `/admin/orders?password=你的后台密码` 是否可访问

## 11. 推荐上线顺序

建议按下面顺序执行：

1. 配置 `.env`
2. 填好 `DATABASE_URL`
3. 执行 `npm install`
4. 执行 `npm run db:generate`
5. 执行 `npm run db:push`
6. 执行 `npm run lint`
7. 执行 `npm run build`
8. 推送到 GitHub
9. 在 Vercel 配置生产环境变量
10. 发起部署

## 12. 当前项目的关键说明

- 现在项目已经配置了 Supabase JS 客户端
- 如果没有 `DATABASE_URL`，项目会回退到内存 mock 数据
- 真正接入 Supabase PostgreSQL 的关键是 `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 主要用于 Supabase 客户端能力
- Prisma schema 已经准备好，补齐数据库连接后即可推表

## 13. 常见问题

### 1. `npm run db:generate` 报 `DATABASE_URL is not configured`

说明 `.env` 里还没有正确填写 `DATABASE_URL`，先补上再执行。

### 2. Vercel 部署成功但页面仍在用假数据

通常是因为生产环境没有配置 `DATABASE_URL`，导致项目回退到了内存数据模式。

### 3. `/admin/orders` 打不开

确认访问时带了参数：

```text
/admin/orders?password=你设置的后台密码
```

并确认 `ADMIN_DASHBOARD_PASSWORD` 与访问参数一致。

### 4. Prisma 连不上 Supabase

优先检查：

- `DATABASE_URL` 是否完整
- 数据库密码是否正确
- Supabase 数据库是否允许当前连接方式

## 14. 可选的后续增强

- 接入 Supabase Auth 做真实用户登录
- 用 Row Level Security 管理数据权限
- 把后台密码方式升级为真正的管理员认证
- 接入自定义域名并把 `NEXT_PUBLIC_SITE_URL` 改成正式地址
