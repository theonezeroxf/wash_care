# 任务书：通用洗护预约平台 (MVP版本)

## 1. 项目概述
这是一个基于现代化 SSR 全栈方案的通用洗护（衣物、鞋子、包包等）预约平台。
目标：利用完全免费的云资源和现代前端栈，快速构建一个具备高 SEO 排名、响应式 UI 且拥有完整前后端逻辑的 Web 网站。

## 2. 技术栈选择 (全免费方案)
* **前端框架**：Next.js 14+ (App Router, 支持 SSR 和极佳的 SEO)
* **UI 组件与样式**：Tailwind CSS + Shadcn UI (现代、极客感、无缝集成)
* **后端/API**：Next.js 内置的 Route Handlers (Serverless 架构，无需独立后端服务器)
* **数据库**：Supabase (基于 PostgreSQL，提供强大的免费额度，支持复杂关系型数据建模)
* **ORM 工具**：Prisma (类型安全，提供优雅的数据库操作体验)
* **部署平台**：Vercel (前端与 Serverless API 一键免费托管)

## 3. 开发阶段与具体任务指引 (请 AI 助手逐阶段执行)

### 阶段一：项目初始化
1.  使用 `npx create-next-app@latest wash-care-platform` 创建项目。
    * 选择 TypeScript, Tailwind CSS, ESLint, App Router。
2.  配置 Shadcn UI (`npx shadcn-ui@latest init`)，并安装基础组件：`button`, `card`, `input`, `form`, `table`。
3.  初始化 Prisma (`npx prisma init`)。

### 阶段二：数据库建模 (Supabase + Prisma)
请在 `prisma/schema.prisma` 中定义以下核心模型，并确保考虑到数据关系的严谨性：
1.  **User (用户)**: ID, 手机号/邮箱, 创建时间。
2.  **ServiceCategory (服务类目)**: 类目名称 (如：运动鞋、羽绒服、高档皮具), 基础价格, 描述, SEO_Slug。
3.  **Order (订单)**: 
    * 包含字段：订单号, 用户ID, 总金额, 取件地址, 状态 (PENDING, PICKED_UP, WASHING, DELIVERING, COMPLETED)。
    * 请确保建立合理的 User 与 Order 的外键关联。
4.  **OrderItem (订单项)**: 关联 Order 和 ServiceCategory，记录单个订单中包含的具体物品和附加服务。

*执行要求*：编写完 Schema 后，生成可执行的 SQL 迁移脚本指示。

### 阶段三：核心前端页面开发 (带 SEO 优化)
1.  **主页 (`/`)**:
    * 设计一个现代感、干净的 Hero Section（包含大标题、服务卖点、立即预约按钮）。
    * 在 Metadata 中配置 title 和 description 以优化 SEO。
2.  **服务与价格页 (`/services`)**:
    * 通过 Server Component 直接从数据库 (Prisma) 服务端获取 `ServiceCategory` 数据。
    * 使用 Grid 布局展示不同类目的洗护卡片及价格。
3.  **预约下单页 (`/book`)**:
    * 构建一个多步表单 (选择类目 -> 填写地址 -> 确认订单)。
    * 使用 React Hook Form 进行客户端状态管理和校验。

### 阶段四：Serverless API 与后端逻辑开发
1.  创建 API 路由 `app/api/orders/route.ts`：
    * 实现 `POST` 方法：接收前端提交的预约信息，开启数据库事务 (Transaction)，同时插入 `Order` 和 `OrderItem` 表记录。
    * 实现 `GET` 方法：根据用户 ID 查询历史订单列表，包含关联的订单状态。
2.  实现基础的错误处理封装，确保 API 返回标准的 HTTP 状态码和 JSON 格式。

### 阶段五：管理后台 (简易版)
1.  创建路由 `/admin/orders`。
    * 编写一个受简单密码保护的页面（可暂用环境变量实现基础 Auth）。
    * 使用 Table 组件列出所有用户的订单。
    * 提供一个下拉菜单，允许管理员通过调用 `PATCH /api/orders/[id]` 接口来流转订单状态 (例如从 PENDING 更改为 WASHING)。

## 4. 给 AI 的执行约束
* 代码必须完全遵循 Next.js App Router 的规范，优先使用 React Server Components 进行数据请求。
* 所有数据库操作必须通过 Prisma 完成，请编写高效的查询语句以减少数据库往返开销。
* UI 风格保持极简、现代，配色以黑、白、灰色调为主，辅以科技蓝或清爽绿作为点缀色（参考 Tailwind 默认调色板）。
* 每完成一个阶段，请输出简要的总结并等待确认后进行下一阶段。
