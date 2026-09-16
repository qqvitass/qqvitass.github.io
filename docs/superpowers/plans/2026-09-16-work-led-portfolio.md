# 作品主导型个人网站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有 Vite + React 作品集更新为真实海尔作品主导的可交互个人网站。

**Architecture:** 继续使用现有单页 React 结构、Framer Motion 动效、作品数据和灯箱。只调整 Hero 组件、页面顺序和视觉令牌，不重写已经通过测试的案例、筛选、复制和 Sites 适配逻辑。

**Tech Stack:** Vite 6、React 18、Framer Motion、原生 CSS、Node test runner

**Spec:** `docs/superpowers/specs/2026-09-16-work-led-portfolio-design.md`

## Global Constraints

- 只使用 `public/works` 中的真实海尔作品和现有真实个人照片。
- 不编造项目数据，不把复盘图描述为原始过程稿。
- 保持 Sites 构建文件和 Worker 测试不变。
- 保持减少动态效果与移动端适配。

---

### Task 1: 锁定作品主导结构

**Files:**
- Create: `tests/portfolio-ui.test.mjs`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `public/works/*.webp`
- Produces: `HeroShowcase` 首屏拼贴与新的页面阅读顺序

- [ ] 编写结构测试，检查真实作品拼贴、作品优先顺序和滚动提示移除。
- [ ] 运行测试并确认因新结构尚未实现而失败。
- [ ] 修改 Hero 与 App 页面顺序。
- [ ] 重新运行测试并确认通过。

### Task 2: 更新视觉系统

**Files:**
- Modify: `src/styles.css`
- Test: `tests/portfolio-ui.test.mjs`

**Interfaces:**
- Consumes: `hero-showcase`、现有作品和案例类名
- Produces: 深海军蓝首屏、冰川白内容区、冷蓝交互状态

- [ ] 在结构测试中加入视觉令牌断言并确认失败。
- [ ] 增加现代无衬线字体、冷蓝配色、作品拼贴和移动端样式。
- [ ] 运行 UI 测试、生产构建和 Sites 测试。

### Task 3: 浏览器验收

**Files:**
- Modify: `design-qa.md`

**Interfaces:**
- Consumes: 本地 Vite 预览
- Produces: 桌面与手机端实际交互证据

- [ ] 检查首屏真实作品、项目跳转、过程展开、图库筛选和灯箱。
- [ ] 检查 390 像素手机布局与控制台。
- [ ] 将新结果写入 `design-qa.md`。
