<template>
  <UnderConstruction v-if="showUnderConstruction" @close="showUnderConstruction = false" />
  <ClickSpark 
    v-else 
    class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 block"
    sparkColor="#3b82f6"
    :sparkSize="12"
    :sparkRadius="20"
    :sparkCount="8"
    :duration="400"
  >
    <TicketModal @navigate="handleTicketNavigate" />
    <!-- 顶部导航 -->
    <header class="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur transition-colors duration-300">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div class="flex items-center gap-3">
          <img :src="resolveImage('/logos/sdtcsa.png')" alt="SDTCSA Logo" class="h-16 w-16 object-contain drop-shadow-md" />
          <div>
            <p class="text-base font-bold tracking-wide text-slate-900 dark:text-slate-100">山东东方高校联合会</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Shandong Touhou College Union</p>
          </div>
        </div>

        <nav class="hidden gap-6 text-sm text-slate-600 dark:text-slate-300 md:flex items-center">
          <button class="hover:text-sky-600 dark:hover:text-white transition-colors c-nav-header" @click="scrollTo('hero')">主页</button>
          <button class="hover:text-sky-600 dark:hover:text-white transition-colors c-nav-header" @click="scrollTo('event')">活动</button>
          <button class="hover:text-sky-600 dark:hover:text-white transition-colors c-nav-header" @click="scrollTo('college')">高校一览</button>
          <button class="hover:text-sky-600 dark:hover:text-white transition-colors c-nav-header" @click="scrollTo('joinus')">加入我们</button>
          
          <!-- Season Effect Toggle -->
          <button 
            class="ml-2 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
            @click="toggleSeasonEffect"
            :title="isSeasonEffectActive ? '关闭季节特效' : '开启季节特效'"
          >
            <span v-if="isSeasonEffectActive">
               <span v-if="currentSeason === 'spring'">🌸</span>
               <span v-else-if="currentSeason === 'summer'">🍃</span>
               <span v-else-if="currentSeason === 'autumn'">🍂</span>
               <span v-else>❄️</span>
            </span>
            <span v-else class="opacity-50 grayscale">🚫</span>
          </button>
        </nav>
      </div>
    </header>

    <SeasonalEffects :active="isSeasonEffectActive" ref="seasonalEffectsRef" />

    <!-- 页面主体 -->
    <main class="mx-auto max-w-7xl px-4 pb-16 pt-10 space-y-20">
      <!-- Hero 区块 -->
      <section 
        id="hero" 
        ref="heroRef"
        class="relative isolate grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-center overflow-hidden rounded-3xl p-6 md:p-10 -mx-4 md:mx-0"
        @mousemove="handleHeroMouseMove"
      >
        <!-- Dynamic Background -->
        <div class="absolute inset-0 -z-10 pointer-events-none overflow-hidden rounded-3xl">
            <!-- Red Glow -->
            <div 
                class="absolute w-[500px] h-[500px] rounded-full bg-red-500/20 dark:bg-red-500/20 blur-[80px] transition-transform duration-100 ease-out will-change-transform"
                :style="{ transform: `translate(${mouseX - 250}px, ${mouseY - 250}px)` }"
            ></div>
             <!-- Yellow Glow -->
             <div 
                class="absolute w-[400px] h-[400px] rounded-full bg-amber-400/20 dark:bg-amber-400/20 blur-[70px] transition-transform duration-200 ease-out will-change-transform"
                :style="{ transform: `translate(${mouseX * 0.9 - 200}px, ${mouseY * 0.9 - 200}px)` }"
            ></div>
             <!-- White Glow -->
             <div 
                class="absolute w-[300px] h-[300px] rounded-full bg-slate-300/30 dark:bg-white/10 blur-[60px] transition-transform duration-300 ease-out will-change-transform"
                :style="{ transform: `translate(${mouseX * 0.7 + 50}px, ${mouseY * 0.7 + 50}px)` }"
            ></div>
        </div>

        <div class="relative z-10">
          <p class="inline-flex items-center gap-1 rounded-full border border-sky-200 dark:border-sky-500/40 bg-sky-50 dark:bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-700 dark:text-sky-300">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            山东东方高校联合例会01-齐鲁幻聚圆满结束！
          </p>
          <h1 class="mt-4 text-5xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-50 md:text-6xl">
            梦入 <span class="text-red-600 dark:text-red-400">幻想</span><br>
            共聚 <span class="text-orange-600 dark:text-orange-400">齐鲁</span>
          </h1>
          <p class="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            山东东方高校联合会由山东省内多所高校的东方众联合成立，致力于促进各高校间的交流与连接，共同推动东方project在山东高校内的发展与传播。

          </p>

          <div class="mt-6 flex flex-wrap items-center gap-3 text-xs">
            <a
              href="#event"
              class="rounded bg-red-600 dark:bg-red-500 px-4 py-2 font-medium text-white dark:text-slate-950 shadow shadow-red-500/20 dark:shadow-red-500/40 transition hover:bg-red-700 dark:hover:bg-red-400"
            >
              查看当前活动
            </a>
            <ClickSpark
              sparkColor="#ef4444"
              :sparkSize="10"
              :sparkRadius="15"
              :sparkCount="8"
              :duration="400"
              :preventBubble="true"
              class="inline-flex"
            >
              <StarBorder
                as="a"
                href="https://qm.qq.com/q/YEk0Cahfmo"
                class="cursor-pointer"
                className="rounded bg-white dark:bg-slate-900 px-4 py-2 font-medium text-slate-700 dark:text-slate-100 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                color="cyan"
                speed="5s"
              >
                加入我们
              </StarBorder>
            </ClickSpark>
          </div>

          <div class="mt-6 flex flex-wrap gap-4 text-[11px] text-slate-500 dark:text-slate-400">
            <div class="flex items-center gap-1.5">
              <span class="h-1.5 w-1.5 rounded-full bg-sky-500 dark:bg-sky-400" />
              校际交流
            </div>
            <div class="flex items-center gap-1.5">
              <span class="h-1.5 w-1.5 rounded-full bg-fuchsia-500 dark:bg-fuchsia-400" />
              线下例会
            </div>
            <div class="flex items-center gap-1.5">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              发展社群
            </div>
          </div>
        </div>

        <!-- 右侧卡片 -->
        <div class="relative z-10 flex flex-col gap-6">
          <!-- 3D Logo -->
          <div 
            class="relative mx-auto w-64 h-64 md:w-80 md:h-80 transition-transform duration-100 ease-out will-change-transform"
            :style="{ 
              transform: `perspective(1000px) rotateX(${heroRotateX}deg) rotateY(${heroRotateY}deg)` 
            }"
          >
            <img 
              :src="resolveImage('/logos/sdtcsa.png')" 
              alt="SDTCSA 3D Logo" 
              class="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>

          <aside class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 shadow-xl shadow-slate-200/50 dark:shadow-sky-900/40 transition-colors duration-300">
            <h2 class="text-sm font-semibold text-slate-900 dark:text-slate-100">近期活动预告</h2>
            <p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">2025年12月20日——山东东方高校联合例会01-齐鲁幻聚圆满结束！</p>
            <dl class="mt-4 space-y-3 text-xs">
              <div class="flex justify-between">
                <dt class="text-slate-700 dark:text-slate-300">例会交流</dt>
                <dd class="text-slate-500 dark:text-slate-400">定期举办线下/线上例会</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-700 dark:text-slate-300">发展社群</dt>
                <dd class="text-slate-500 dark:text-slate-400">发展山东各地高校社群间的交流</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-700 dark:text-slate-300">线上交流</dt>
                <dd class="text-slate-500 dark:text-slate-400">非想天则/STG/其他东方同人</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <!-- Logo Loop -->
      <div class="w-full -mt-10 mb-10 overflow-hidden">
        <LogoLoop
          :logos="universityLogos"
          :speed="50"
          direction="left"
          :logoHeight="64"
          :gap="60"
          :pauseOnHover="true"
          :scaleOnHover="true"
          :fadeOut="true"
          class="transition-all duration-500"
        />
      </div>

      <!-- 东方活动 -->
      <TouhouEvents ref="touhouEventsRef" />

      <!-- 高校社群 -->
      <UniversityCommunity id="college" />

      <!-- 关于项目 -->
      <section id="about" class="space-y-4">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">关于我们</h2>
        <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          山东东方高校联合会（SDTCU）是一个致力于连接山东省内各高校东方Project爱好者的非营利性学生组织。
          我们旨在搭建一个开放、友好的交流平台，促进各高校社群之间的资源共享与合作。
        </p>
        <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          无论你是刚入坑的新人，还是资深的东方众，在这里都能找到志同道合的伙伴。
          我们定期举办各类线上线下活动，共同探索幻想乡的无限可能。
        </p>
      </section>

      <!-- 功能亮点 -->
      <section id="features" class="space-y-5">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">活动与特色</h2>
        <div class="grid gap-4 md:grid-cols-3">
          <article class="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 text-xs shadow-sm dark:shadow-none transition-colors duration-300">
            <h3 class="font-semibold text-slate-900 dark:text-slate-100">校际联动</h3>
            <p class="mt-2 text-slate-600 dark:text-slate-300">
              打破校园围墙，组织跨校联谊、互访交流，让不同学校的东方众紧密联系在一起。
            </p>
          </article>
          <article class="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 text-xs shadow-sm dark:shadow-none transition-colors duration-300">
            <h3 class="font-semibold text-slate-900 dark:text-slate-100">发展社群</h3>
            <p class="mt-2 text-slate-600 dark:text-slate-300">
              努力发展东方project在高校中的传播，让更多朋友喜欢东方project。
            </p>
          </article>
          <article class="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 text-xs shadow-sm dark:shadow-none transition-colors duration-300">
            <h3 class="font-semibold text-slate-900 dark:text-slate-100">资源共享</h3>
            <p class="mt-2 text-slate-600 dark:text-slate-300">
              共享活动经验、展会信息、制作教程等资源，帮助各高校社群更好地发展与建设。
            </p>
          </article>
        </div>
      </section>

      <!-- 加入我们 (Refactored) -->
      <section 
        id="joinus" 
        class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-purple-600 to-pink-600 bg-[length:400%_400%] animate-gradient-flow p-8 md:p-16 text-center text-white shadow-2xl"
      >
        <!-- Decorative Circles (CSS only) -->
        <div class="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-red-500/40 blur-3xl animate-blob mix-blend-overlay"></div>
        <div class="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/20 blur-3xl animate-blob [animation-delay:2000ms] mix-blend-overlay"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-yellow-400/30 blur-3xl animate-blob [animation-delay:4000ms] -z-10"></div>

        <div class="relative z-10 flex flex-col items-center gap-10">
          <div class="max-w-2xl">
            <h2 class="text-3xl font-bold tracking-tight md:text-4xl">加入我们</h2>
            <p class="mt-4 text-lg text-sky-100">
              无论你是刚入坑的新人，还是资深的东方众，在这里都能找到志同道合的伙伴。
            </p>
          </div>

          <div class="flex flex-col md:flex-row items-center gap-8 md:gap-12">
             <!-- QR Code Card -->
             <div class="relative group">
                <div class="absolute -inset-1 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                <div class="relative h-48 w-48 bg-white rounded-xl flex items-center justify-center p-2">
                   <img :src="resolveImage('/logos/qqgroup.webp')" alt="QQ Group QR" class="w-full h-full object-contain" />
                </div>
             </div>

             <!-- Info Card -->
             <div class="text-left space-y-4">
                <div class="flex items-center gap-4 p-2 rounded-xl transition-colors hover:bg-white/10 cursor-default">
                   <div class="p-3 rounded-lg bg-white/10 backdrop-blur-sm shadow-inner">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                   </div>
                   <div>
                      <p class="text-sm text-sky-200 font-medium">官方QQ群</p>
                      <p class="text-2xl font-bold font-mono tracking-wider select-all drop-shadow-sm">977015593</p>
                   </div>
                </div>
                
                <div class="flex items-center gap-4 p-2 rounded-xl transition-colors hover:bg-white/10 cursor-default">
                   <div class="p-3 rounded-lg bg-white/10 backdrop-blur-sm shadow-inner">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                   </div>
                   <div>
                      <p class="text-sm text-sky-200 font-medium">合作联系</p>
                      <p class="text-base drop-shadow-sm">如有活动联办意向，请入群详询</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/90 transition-colors duration-300">
      <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row">
        <div class="flex flex-col items-center gap-2 md:items-start">
          <p class="text-xs text-slate-500">© {{ new Date().getFullYear() }} 山东东方高校联合会</p>
          <p class="text-[10px] text-slate-400">基于 Vue 3 · TypeScript · TailwindCSS · Vite 构建</p>
        </div>

        <!-- Social Icons -->
        <div class="flex items-center gap-4">
          <a 
            href="https://qm.qq.com/q/FORqQUAg6I" 
            target="_blank" 
            rel="noopener noreferrer"
            class="group relative flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all hover:bg-[#12B7F5] hover:text-white hover:-translate-y-1"
            title="加入官方QQ群"
          >
            <svg class="h-5 w-5" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z" /></svg>
          </a>
          
          <a 
            href="https://github.com/SDTCU/SDTCU.github.io" 
            target="_blank" 
            rel="noopener noreferrer"
            class="group relative flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all hover:bg-black hover:text-white hover:-translate-y-1"
            title="访问GitHub仓库"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 2.04.135 3 .405 2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  </ClickSpark>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, defineAsyncComponent } from 'vue';
import { resolveImage } from './utils/image';
import LogoLoop from '@/components/LogoLoop.vue';
import ClickSpark from '@/components/ClickSpark.vue';
import StarBorder from '@/components/StarBorder.vue';
//import TicketModal from '@/components/TicketModal.vue';//关闭售票功能

// Async components for better performance
const UniversityCommunity = defineAsyncComponent(() => import('./components/UniversityCommunity.vue'));
const SeasonalEffects = defineAsyncComponent(() => import('./components/SeasonalEffects.vue'));
const UnderConstruction = defineAsyncComponent(() => import('./components/UnderConstruction.vue'));
const TouhouEvents = defineAsyncComponent(() => import('./components/TouhouEvents.vue'));

const touhouEventsRef = ref<InstanceType<typeof TouhouEvents> | null>(null);

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const handleTicketNavigate = () => {
  scrollTo('event');
  // Wait for scroll to finish a bit
  setTimeout(() => {
    if (touhouEventsRef.value) {
      touhouEventsRef.value.openEventById(1); // ID 1 is the December meeting
    }
  }, 800);
};

// Season Effect Logic
const isSeasonEffectActive = ref(true);
const seasonalEffectsRef = ref<InstanceType<typeof SeasonalEffects> | null>(null);
const showUnderConstruction = ref(false);//施工中弹窗，true为开

const currentSeason = computed(() => {
    return seasonalEffectsRef.value?.currentSeason || 'spring';
});

const toggleSeasonEffect = () => {
  isSeasonEffectActive.value = !isSeasonEffectActive.value;
};

// Hero background effect
const heroRef = ref<HTMLElement | null>(null);
const mouseX = ref(0);
const mouseY = ref(0);
const heroRotateX = ref(0);
const heroRotateY = ref(0);

const handleHeroMouseMove = (e: MouseEvent) => {
  if (!heroRef.value) return;
  const rect = heroRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  mouseX.value = x;
  mouseY.value = y;

  // Calculate rotation based on center of hero section
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  // Max rotation 15 degrees
  heroRotateY.value = ((x - centerX) / centerX) * 15; 
  heroRotateX.value = -((y - centerY) / centerY) * 15;
};

onMounted(() => {
  // Initialize glow at the center
  if (heroRef.value) {
    const rect = heroRef.value.getBoundingClientRect();
    mouseX.value = rect.width / 2;
    mouseY.value = rect.height / 2;
  }
});

const universityLogos = [
  { src: resolveImage('/logos/sdu.webp'), alt: '山东大学', title: '山东大学' },
  { src: resolveImage('/logos/sduwh.webp'), alt: '山东大学（威海）', title: '山东大学（威海）' },
  { src: resolveImage('/logos/sdut.webp'), alt: '山东理工大学', title: '山东理工大学' },
  { src: resolveImage('/logos/sdutcm.webp'), alt: '山东中医药大学', title: '山东中医药大学' },
  { src: resolveImage('/logos/sdjzu.webp'), alt: '山东建筑大学', title: '山东建筑大学' },
  { src: resolveImage('/logos/sdpei.webp'), alt: '山东体育学院', title: '山东体育学院' },
  { src: resolveImage('/logos/sdjtu.webp'), alt: '山东交通学院', title: '山东交通学院' },
  { src: resolveImage('/logos/sdyu.webp'), alt: '山东青年政治学院', title: '山东青年政治学院' },
  { src: resolveImage('/logos/sdnu.webp'), alt: '山东师范大学', title: '山东师范大学' },
  { src: resolveImage('/logos/smu.webp'), alt: '山东管理学院', title: '山东管理学院' },
  { src: resolveImage('/logos/qlu.webp'), alt: '齐鲁工业大学', title: '齐鲁工业大学' },
  { src: resolveImage('/logos/sdca.webp'), alt: '山东艺术学院', title: '山东艺术学院' },
  { src: resolveImage('/logos/UPC.webp'), alt: '中国石油大学（华东）', title: '中国石油大学（华东）' },
  { src: resolveImage('/logos/hitwith.webp'), alt: '哈尔滨工业大学（威海）', title: '哈尔滨工业大学（威海）' },
  { src: resolveImage('/logos/sdipct.webp'), alt: '山东石油化工学院', title: '山东石油化工学院' },
  { src: resolveImage('/logos/ujn.webp'), alt: '济南大学', title: '济南大学' },
  { src: resolveImage('/logos/uzz.webp'), alt: '枣庄学院', title: '枣庄学院' },
  { src: resolveImage('/logos/dykj.webp'), alt: '东营科技职业学院', title: '东营科技职业学院' },
  { src: resolveImage('/logos/lcu.webp'), alt: '聊城大学', title: '聊城大学' },
  { src: resolveImage('/logos/ytu.webp'), alt: '烟台大学', title: '烟台大学' },
  { src: resolveImage('/logos/ldu.webp'), alt: '鲁东大学', title: '鲁东大学' },
  { src: resolveImage('/logos/qiot.webp'), alt: '齐鲁理工学院', title: '齐鲁理工学院' },
  { src: resolveImage('/logos/zvc.webp'), alt: '枣庄职业学院', title: '枣庄职业学院' },
  { src: resolveImage('/logos/qau.webp'), alt: '青岛农业大学', title: '青岛农业大学' },
];
</script>

<style scoped>
</style>
