# 通用洗护预约平台前置准备

## 需要安装的环境

1. `Node.js`
   - 用于运行 `npx create-next-app@latest`、`npx shadcn-ui@latest init`、`npx prisma init`。
   - 安装 Node.js 后会自带 `npm`，本项目文档里的命令默认可直接使用。

2. `Git`
   - 方便管理项目版本，并配合常见部署流程使用。

3. `推荐开发工具`
   - `VS Code`：用于编辑 Next.js / Prisma / Tailwind 项目文件。

## 需要注册的网站

1. [Supabase](https://supabase.com/)
   - 用作项目数据库平台（PostgreSQL）。
   - 后续需要创建项目并获取数据库连接串，供 Prisma 使用。

2. [Vercel](https://vercel.com/)
   - 用作前端和 Serverless API 的部署平台。

## 补充说明

- 任务书中明确提到的核心云服务注册项是 `Supabase` 和 `Vercel`。
- `Next.js`、`Tailwind CSS`、`Shadcn UI`、`Prisma` 都是在本地项目中通过 `npm/npx` 安装，不需要单独注册官网账号才能开始开发。
