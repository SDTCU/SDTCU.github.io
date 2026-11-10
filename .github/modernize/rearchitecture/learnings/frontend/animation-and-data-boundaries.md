# Animation and Data Boundaries

静态 Vue 站点应将内容数据与展示组件分离，并让动画仅在可见且用户允许时运行。

## What Happened
本次重构将活动档案移至 `src/data/events.ts`，高校占位项改用显式字段；四个动画组件不再空闲时持续 RAF，并统一响应 reduced-motion。

## Takeaway
对首屏动画使用按需 RAF，对非首屏图片使用 lazy loading 和尺寸属性；不要用占位项的数字 ID 作为过滤条件。

## History
- 2026-11-10 (SDTCSA.github.io/full-site-modernization): initial
