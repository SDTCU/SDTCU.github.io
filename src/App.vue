<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 font-sans">
    <!-- 顶部导航 -->
    <header class="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div class="flex items-center gap-2">
          <div class="h-8 w-8 rounded bg-gradient-to-tr from-sky-400 to-fuchsia-500 shadow-lg shadow-sky-500/40" />
          <div>
            <p class="text-sm font-semibold tracking-wide">山东东方高校联合会</p>
            <p class="text-xs text-slate-400">Shandong Touhou College Students Union</p>
          </div>
        </div>

        <nav class="hidden gap-6 text-sm text-slate-300 md:flex">
          <button class="hover:text-white" @click="scrollTo('hero')">主页</button>
          <button class="hover:text-white" @click="scrollTo('event')">活动</button>
          <button class="hover:text-white" @click="scrollTo('college')">高校一览</button>
          <button class="hover:text-white" @click="scrollTo('joinus')">加入我们</button>
        </nav>
      </div>
    </header>

    <!-- 页面主体 -->
    <main class="mx-auto max-w-5xl px-4 pb-16 pt-10 space-y-20">
      <!-- Hero 区块 -->
      <section id="hero" class="grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-center">
        <div>
          <p class="inline-flex items-center gap-1 rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            山高联，复活！
          </p>
          <h1 class="mt-4 text-3xl font-semibold leading-tight tracking-tight text-slate-50 md:text-4xl">
            梦入 <span class="bg-gradient-to-r from-sky-400 via-cyan-300 to-fuchsia-400 bg-clip-text text-transparent">幻想</span><br>
            齐聚 <span class="bg-gradient-to-r from-sky-400 via-cyan-300 to-fuchsia-400 bg-clip-text text-transparent">齐鲁</span>
          </h1>
          <p class="mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
            山东东方高校联合会由山东省内多所高校的东方众联合成立，致力于促进各高校间的交流与连接，共同推动东方project在山东高校内的发展与传播。

          </p>

          <div class="mt-6 flex flex-wrap items-center gap-3 text-xs">
            <a
              href="#event"
              class="rounded bg-sky-500 px-4 py-2 font-medium text-slate-950 shadow shadow-sky-500/40 transition hover:bg-sky-400"
            >
              查看当前活动
            </a>
            <a
              href="#joinus"
              class="rounded border border-slate-700 px-4 py-2 font-medium text-slate-100 transition hover:border-slate-500"
            >
              加入我们
            </a>
          </div>

          <div class="mt-6 flex flex-wrap gap-4 text-[11px] text-slate-400">
            <div class="flex items-center gap-1.5">
              <span class="h-1.5 w-1.5 rounded-full bg-sky-400" />
              热更新开发体验
            </div>
            <div class="flex items-center gap-1.5">
              <span class="h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
              零构建后端依赖
            </div>
            <div class="flex items-center gap-1.5">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              适配 GitHub Pages 部署
            </div>
          </div>
        </div>

        <!-- 右侧卡片：技术栈简介 -->
        <aside class="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl shadow-sky-900/40">
          <h2 class="text-sm font-semibold text-slate-100">下一届例会</h2>
          <p class="mt-1 text-[11px] text-slate-400">核心依赖与推荐用法一目了然。</p>
          <dl class="mt-4 space-y-3 text-xs">
            <div class="flex justify-between">
              <dt class="text-slate-300">Vue 3 组合式 API</dt>
              <dd class="text-slate-400">组件化视图与响应式数据</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-slate-300">TypeScript</dt>
              <dd class="text-slate-400">更可靠的类型检查与 IDE 体验</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-slate-300">TailwindCSS</dt>
              <dd class="text-slate-400">原子化样式与统一设计语言</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-slate-300">Vite</dt>
              <dd class="text-slate-400">极快冷启动与构建速度</dd>
            </div>
          </dl>
        </aside>
      </section>

      <!-- 关于项目 -->
      <section id="about" class="space-y-4">
        <h2 class="text-xl font-semibold text-slate-50">项目定位</h2>
        <p class="text-sm leading-relaxed text-slate-300">
          本项目是一个「可直接 fork 使用」的静态网站基础模板。你可以很方便地替换文字、图片和配色，
          将其改造成属于自己社团或个人项目的门户网页，而无需重新搭建繁琐的工程环境。
        </p>
        <p class="text-sm leading-relaxed text-slate-300">
          推荐的使用方式：保持整体布局结构不变，只需要根据自己的内容需求调整页面模块与文案，
          既能保证风格统一，又能节省前期设计时间。
        </p>
      </section>

      <!-- 功能亮点 -->
      <section id="features" class="space-y-5">
        <h2 class="text-xl font-semibold text-slate-50">功能亮点与结构设计</h2>
        <div class="grid gap-4 md:grid-cols-3">
          <article class="rounded-lg border border-slate-800 bg-slate-900/70 p-4 text-xs">
            <h3 class="font-semibold text-slate-100">组件化布局</h3>
            <p class="mt-2 text-slate-300">
              使用单文件组件组织页面结构，首页可拆分为导航、页头、内容分区和页脚等模块，方便后期扩展成多页面应用。
            </p>
          </article>
          <article class="rounded-lg border border-slate-800 bg-slate-900/70 p-4 text-xs">
            <h3 class="font-semibold text-slate-100">响应式设计</h3>
            <p class="mt-2 text-slate-300">
              基于 Tailwind 的断点系统，默认对手机、平板和桌面端进行适配，确保在 GitHub Pages 或移动端浏览时体验统一。
            </p>
          </article>
          <article class="rounded-lg border border-slate-800 bg-slate-900/70 p-4 text-xs">
            <h3 class="font-semibold text-slate-100">易于部署</h3>
            <p class="mt-2 text-slate-300">
              使用 Vite 构建静态资源，可直接输出到 <code class="rounded bg-slate-800 px-1">dist</code> 目录，然后推送至 GitHub Pages 或其他静态托管平台。
            </p>
          </article>
        </div>
      </section>

      <!-- 页面结构展示 / 导航说明 -->
      <section id="joinus" class="space-y-4">
        <h2 class="text-xl font-semibold text-slate-50">主页内容结构建议</h2>
        <ul class="space-y-2 text-sm text-slate-300">
          <li>· 顶部导航：放置社团名称、LOGO 以及跳转锚点（活动介绍、成员介绍、作品展示等）。</li>
          <li>· 首屏介绍：简短一句话说明社团/项目定位，配合一张背景图或渐变色块。</li>
          <li>· 社团简介：详细介绍历史、主题方向、活动风格等内容。</li>
          <li>· 活动一览：用卡片列出最近或代表性的几次活动，附上时间和关键字。</li>
          <li>· 成员与联系方式：罗列主要负责人、社交平台链接、联系邮箱等信息。</li>
        </ul>
        <p class="text-xs text-slate-400">
          你可以根据以上结构，在当前页面中逐步替换为自己社团的真实内容，无需改动底层代码逻辑。
        </p>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="border-t border-slate-800 bg-slate-950/90">
      <div class="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-4 text-[11px] text-slate-500 md:flex-row">
        <p>© {{ new Date().getFullYear() }} SDTCSA Web Template. 保留部分设计思路，欢迎二次创作。</p>
        <p class="text-slate-500">基于 Vue 3 · TypeScript · TailwindCSS · Vite 构建</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
</style>
