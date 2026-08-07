import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Braces,
  CheckCircle2,
  Database,
  ExternalLink,
  GitPullRequest,
  KeyRound,
  Layers3,
  ShieldCheck,
  TestTube2,
  Users,
  Workflow,
} from "lucide-react";

const decisions = [
  {
    title: "从泛匹配到共同活动",
    text: "把饭搭子、自习、Citywalk 等具体计划作为关系起点，降低陌生社交的沟通成本。",
  },
  {
    title: "把人数做成数据库事实",
    text: "触发器同步参与人数；报名事务在数据库侧校验名额，避免并发超额。",
  },
  {
    title: "最小权限的联系机制",
    text: "共同参加同一活动才可申请联系；唯一索引避免重复申请，接收方才可处理。",
  },
];

const architecture = [
  { icon: KeyRound, title: "身份与会话", text: "Supabase Auth 管理邮箱认证与会话；前端只使用 anon key。" },
  { icon: Database, title: "数据与一致性", text: "Postgres 保存活动、报名、评论与联系申请；触发器维护人数计数。" },
  { icon: ShieldCheck, title: "权限与边界", text: "RLS 按角色与关系约束读写；服务端密钥仅在受控 API 路由使用。" },
  { icon: Braces, title: "产品与交付", text: "Next.js 15 + React 19 + TypeScript + Tailwind；Leaflet 地图；Vercel 生产部署。" },
];

const aiSteps = [
  {
    icon: Workflow,
    title: "先定义任务，不把决策外包给 AI",
    text: "我先给出用户场景、业务规则、数据边界和验收标准，再让 AI 协助拆解实现路径。",
  },
  {
    icon: Bot,
    title: "按能力模块调用 Agent / Skill",
    text: "代码库梳理、数据库迁移草案、页面迭代、构建检查、浏览器验收分别拆成独立任务，降低上下文混乱。",
  },
  {
    icon: TestTube2,
    title: "用产物和测试完成复核",
    text: "AI 输出必须落到可审阅的代码、SQL、发布清单和线上页面；最终由我核对规则、异常和真实表现。",
  },
];

const guardrails = [
  "不在对话、代码或截图中暴露 Supabase 服务端密钥等敏感信息。",
  "数据库变更以可重复执行的 SQL 迁移记录，并在真实环境验证。",
  "涉及权限、名额和联系关系的规则，必须由数据库约束与 RLS 兜底。",
  "将“AI 建议”与“已验证上线结果”明确区分，不用未验证结论包装成果。",
];

export default function CaseStudyPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-12 py-4 pb-16 md:py-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#171426] px-7 py-10 text-white shadow-2xl shadow-purple-200/60 sm:px-12 sm:py-14">
        <div className="absolute -right-12 -top-20 h-72 w-72 rounded-full bg-purple-500/35 blur-3xl" />
        <div className="relative max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-purple-200">Product case study · 2026</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-.045em] sm:text-6xl">Dazi：让留学生从一场具体活动开始认识彼此</h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/70 sm:text-base">
            独立设计并开发的场景化轻社交 MVP。项目围绕“发现活动 → 报名参与 → 共同参与后申请联系”的信任闭环，
            将产品规则、数据一致性、权限边界与 AI 协作开发过程一并沉淀为可验证的交付物。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-gray-950 transition hover:bg-purple-50">体验线上产品 <ArrowRight className="h-4 w-4" /></Link>
            <a href="https://github.com/URLLC" target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-semibold text-white/90 transition hover:bg-white/10">GitHub 主页 <ExternalLink className="h-4 w-4" /></a>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {[
          { icon: Users, title: "目标用户", text: "刚到海外城市、希望寻找饭搭子、自习伙伴或周末活动同伴的留学生。" },
          { icon: Layers3, title: "我的职责", text: "产品定义、用户流程、交互与视觉设计、前后端开发、数据建模、权限设计、上线验收。" },
          { icon: Database, title: "可验证交付", text: "线上产品、案例页、SQL 迁移、发布检查清单与生产环境构建结果。" },
        ].map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-3xl border border-white bg-white p-6 shadow-sm">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-100 text-purple-700"><Icon className="h-5 w-5" /></div>
            <h2 className="mt-4 font-bold text-gray-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">{text}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-purple-600">Problem</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950">陌生社交的难点不是没有人，而是没有可信的开始。</h2>
          <p className="mt-4 text-sm leading-7 text-gray-600">用户常有即时、具体的陪伴需求，但泛匹配既缺少共同话题，也缺少安全边界。Dazi 用可见的时间、地点、人数与活动说明，把“认识”转化为共同参与之后的自然结果。</p>
        </div>
        <div className="rounded-3xl bg-purple-50 p-6 sm:p-8">
          <p className="text-sm font-bold text-purple-800">核心用户闭环</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {["按城市、标签与地图发现活动", "报名并查看共同参与者", "基于共同活动申请联系"].map((item, index) => (
              <div key={item} className="rounded-2xl bg-white p-4 shadow-sm"><span className="text-xs font-black text-purple-500">0{index + 1}</span><p className="mt-3 text-sm font-semibold leading-6 text-gray-800">{item}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-[.2em] text-purple-600">Live product evidence</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950">真实上线界面，而非静态原型。</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <figure className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <Image src="/case-study/dazi-home.png" alt="Dazi 首页，展示活动发布与发现入口" width={1287} height={720} className="h-auto w-full" />
            <figcaption className="border-t border-gray-100 px-5 py-4 text-sm text-gray-500">首页：清晰的产品定位、活动发布入口与标签化发现区。</figcaption>
          </figure>
          <figure className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <Image src="/case-study/dazi-activity-list.png" alt="Dazi 活动列表，展示标签筛选与真实活动卡片" width={1287} height={720} className="h-auto w-full" />
            <figcaption className="border-t border-gray-100 px-5 py-4 text-sm text-gray-500">活动列表：按标签筛选，并展示时间、地点、人数与活动发起人信息。</figcaption>
          </figure>
        </div>
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-[.2em] text-purple-600">Product & engineering decisions</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950">把产品规则落到可验证的系统里。</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {decisions.map(({ title, text }) => <article key={title} className="rounded-3xl border border-gray-100 bg-white p-6"><CheckCircle2 className="h-5 w-5 text-purple-600" /><h3 className="mt-4 font-bold text-gray-950">{title}</h3><p className="mt-2 text-sm leading-6 text-gray-500">{text}</p></article>)}
        </div>
      </section>

      <section className="rounded-[2rem] bg-gray-950 p-7 text-white sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-purple-300">Technical deep dive</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight">核心架构：前端体验、数据库事实、权限边界分层承担。</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {architecture.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5"><Icon className="h-5 w-5 text-purple-300" /><h3 className="mt-4 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/65">{text}</p></article>)}
        </div>
        <div className="mt-7 rounded-2xl border border-purple-400/20 bg-purple-400/10 p-5 text-sm leading-7 text-purple-50">
          <strong>数据链路：</strong>认证用户 → 活动 sessions → 参与记录 session_members → 人数同步与容量校验 → 共同参与关系 → 联系申请与接收方处理。关键约束由 Postgres 触发器、索引、检查约束与 RLS 共同保证，而不是只依赖前端判断。
        </div>
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-[.2em] text-purple-600">AI collaboration, with product ownership</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950">使用 AI 的重点不是“让它写完”，而是让每一步都可控、可审、可验收。</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {aiSteps.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-3xl border border-gray-100 bg-white p-6"><div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-100 text-purple-700"><Icon className="h-5 w-5" /></div><h3 className="mt-4 font-bold text-gray-950">{title}</h3><p className="mt-2 text-sm leading-6 text-gray-500">{text}</p></article>)}
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <article className="rounded-3xl border border-purple-100 bg-purple-50 p-6">
            <p className="text-sm font-bold text-purple-900">可复用的 AI 任务指令框架</p>
            <p className="mt-3 rounded-2xl bg-[#171426] p-5 font-mono text-xs leading-6 text-purple-100">目标：为活动报名设计并发安全的容量保护。{"\n"}上下文：Next.js + Supabase，参与人数必须以数据库为准。{"\n"}约束：不可暴露密钥；保留 RLS；SQL 可独立审阅与回滚。{"\n"}验收：满员时拒绝报名；并发不超额；构建通过；异常可被页面反馈。</p>
            <p className="mt-3 text-xs leading-5 text-purple-800">这是任务指令的结构化示例，用于展示工作方法；实际代码与 SQL 以仓库中的迁移文件和线上行为为准。</p>
          </article>
          <article className="rounded-3xl border border-gray-100 bg-white p-6">
            <p className="text-sm font-bold text-gray-950">Agent / Skill 协作守则</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
              {guardrails.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />{item}</li>)}
            </ul>
          </article>
        </div>
      </section>

      <section className="rounded-3xl border border-purple-100 bg-white p-7 sm:p-10">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div><div className="flex items-center gap-2 text-purple-700"><GitPullRequest className="h-5 w-5" /><span className="text-sm font-bold">上线与质量保障</span></div><p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600">已完成 Supabase RLS 权限设计、活动人数同步与容量保护、联系申请唯一性约束、生产构建验证与 Vercel 正式环境部署。技术表达只引用可在代码、SQL 迁移、构建结果或线上产品中追溯的事实。</p></div>
          <Link href="/" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-700">打开产品 <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </main>
  );
}
