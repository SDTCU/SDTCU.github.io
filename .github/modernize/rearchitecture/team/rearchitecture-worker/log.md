## full-site-modernization — 前端重构与性能优化
- 已有用户改动必须保留；新增学校与活动内容作为基线继续扩展。
- 活动数据集中到 `src/data/events.ts`，组件仅负责展示和交互；高校占位项用 `isPlaceholder` 显式标记，避免依赖 magic id。
- Hero WebGL、季节特效、LogoLoop、ClickSpark 使用 reduced-motion 和可见性/按需 RAF 门控。
- Vite 压缩插件在 Windows 下生成 `dist/D:/...` 异常嵌套产物，移除运行配置后构建目录恢复干净。
- 验证：`get_errors` 无错误；`npm run build` 通过；独立端口 dev 启动并浏览器渲染通过。
