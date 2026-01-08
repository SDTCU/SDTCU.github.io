<!-- 自动为 AI 编码助手机器人准备的仓库特定指导 -->
# Copilot / AI Agent 指南 — SDTCSA.github.io

目的：帮助 AI 代理快速理解本仓库的架构、开发流程与项目约定，方便进行小而精的改动（样式、组件、内容、构建脚本）。

- **项目概览**: Vue 3 + TypeScript + Vite + TailwindCSS 静态站点。入口在 `src/main.ts`，根组件 `src/App.vue`。静态资源在 `public/`，图片与海报放在 `public/logos` 和 `public/posters`。

- **重要文件/目录**:
  - `package.json` — 开发与构建脚本（`dev`, `build`, `serve`）。
  - `vite.config.ts` — 别名 `@` 指向 `./src`，请使用该别名导入源码。
  - `src/` — 源代码；常见组件在 `src/components/`（如 `SeasonalEffects.vue`, `TouhouEvents.vue`, `UniversityCommunity.vue`）。
  - `src/utils/image.ts` — 图片路径解析工具。添加/引用图片时优先使用 `resolveImage()`。
  - `index.css` / `extend.css` — Tailwind 入口与自定义扩展，避免破坏类名或全局样式。
  - `scripts/optimize-images.js` — 用于将 `public` 中图片转换为 WebP。对图片变更后请建议运行该脚本。

- **运行与构建（在项目根目录）**:
  - 开发：`npm install` 然后 `npm run dev`（Vite）。
  - 生产构建：`npm run build` → 输出 `dist/`。
  - 预览生产包：`npm run serve`。
  - 图片优化：`node scripts/optimize-images.js`。

- **代码约定与常见模式（对 AI 很重要）**:
  - 使用 Vue 3 Composition API（`script setup` + `lang="ts"`）。修改组件时遵循 `setup` 风格。
  - 组件以小型、视觉驱动为主（大量 Tailwind 工具类）。尽量小步改动 CSS，以避免意外影响多个视图。
  - 动画/交互类（如 Hero 光晕、季节特效）在 `src/App.vue` 与 `src/components/SeasonalEffects.vue` 中实现：当需要切换或微调效果时，优先修改对应组件并保留现有 props（例如 `SeasonalEffects` 接受 `:active`）。
  - 图片引用使用 `resolveImage('/logos/xxx')`；不要直接从 `public/` 使用相对导入，这里有工具封装路径解析。
  - 路由/状态很少 —— 本仓库是单页静态站点，修改通常不会牵涉到后端或复杂状态管理。

- **审慎点（不应做的事）**:
  - 不要重命名或批量替换 Tailwind 类名（类名即语义 + 样式）。
  - 不要随意修改 `vite.config.ts` 的别名配置或 `index.html` 的基本路径，除非必要并说明原因。

- **提交/PR 指南（AI 代理应遵循）**:
  - 小改动：单个 issue/PR，标题说明改动范围（例如：`fix: adjust seasonal effect timing`）。
  - 带图片的改动：在 PR 描述中说明是否运行了 `node scripts/optimize-images.js`，并附上本地预览截图。

- **示例任务说明（给 AI 的模板）**:
  - 修复按钮交互问题："在 `src/App.vue` 中，`c-nav-header` 点击在小屏幕上没有响应 — 请检查事件绑定并修复"。
  - 添加新 logo："把 `logos/newlogo.png` 放到 `public/logos/`，并在 `src/App.vue` 中使用 `resolveImage('/logos/newlogo.png')`，同时建议运行图片优化脚本。"

如果以上内容有遗漏或你想补充具体约定（如分支策略、CI、Node 版本），请告诉我，我会把它补充进此文件。
