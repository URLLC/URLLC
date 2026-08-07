# Dazi

面向海外留学生的场景化轻社交 MVP。用户通过发布和加入具体活动（饭搭子、自习、Citywalk 等）建立连接，而不是从陌生人列表开始。

## 在线案例

- 产品案例（无需登录）：[dazi.lol/case-study](https://dazi.lol/case-study)
- 线上体验：[dazi.lol](https://dazi.lol)

核心产品闭环：`发现活动 → 报名参与 → 共同活动 → 申请联系`。

## MVP 功能

- 邮箱注册、登录与 Supabase Auth 会话管理
- 按城市浏览、搜索和标签筛选活动
- 发布活动、加入/退出活动、活动评论
- 个人资料编辑与兴趣标签
- 仅限共同活动参与者的联系申请与接收处理
- 响应式网页体验，适合桌面和移动端演示

## 技术栈

- Next.js 15、React 19、TypeScript、Tailwind CSS
- Supabase Auth、Postgres、Row Level Security
- Leaflet / React Leaflet 地图选点

## AI 协作方式

AI 用于协助代码库梳理、任务拆解、数据库迁移草案、页面迭代、构建检查与浏览器验收；产品规则、数据边界、验收标准和最终上线判断由我负责。

每个任务先明确目标、已有架构与约束、安全边界和可验证的验收结果。公开说明只描述可由线上产品、SQL 迁移、构建记录或代码追溯的事实，不包含服务端密钥或真实用户数据。

## 本地运行

1. 安装依赖：`npm install`
2. 复制 `.env.example` 为 `.env.local`，填入 Supabase 项目的 URL 与 anon key。
3. 运行 `npm run dev`。

需要管理端批量建号时，额外配置仅服务端使用的 `SUPABASE_SERVICE_ROLE_KEY`。不要将任何密钥提交到 Git，也不要在客户端使用 service role key。

## 数据库升级顺序

在 Supabase SQL Editor 执行：

1. `docs/07-mvp-supabase-upgrade.sql`
2. `docs/08-contact-request-upgrade.sql`
3. `docs/09-session-capacity-upgrade.sql`
4. `docs/10-profile-update-policy.sql`

执行后用 `npm run build` 验证生产构建。

发布和演示前，请按 `docs/11-release-checklist.md` 逐项验收；面试作品集的产品叙事见 `docs/12-portfolio-case-study.md`。线上案例页：`/case-study`。

## 简历案例表述（草案）

独立设计并开发面向留学生的场景化社交平台 Dazi，使用 Next.js 与 Supabase 搭建认证、活动发布/报名、评论与基于共同活动的联系申请流程；通过 RLS 与服务端密钥隔离控制数据访问，并完成移动端适配与生产构建验证。
