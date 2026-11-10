<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick, type CSSProperties } from 'vue';

// Types
export interface LogoItem {
  src?: string;
  alt?: string;
  href?: string;
  title?: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  // For custom component rendering, users should use the slot
  [key: string]: any;
}

const props = withDefaults(defineProps<{
  logos: LogoItem[];
  speed?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}>(), {
  speed: 120,
  direction: 'left',
  width: '100%',
  logoHeight: 28,
  gap: 32,
  pauseOnHover: false,
  fadeOut: false,
  scaleOnHover: false,
  ariaLabel: 'Partner logos'
});

// Constants
const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 6, // Increased from 4 to 6 to ensure full coverage
  COPY_HEADROOM: 2
} as const;

// Refs
const containerRef = ref<HTMLDivElement | null>(null);
const trackRef = ref<HTMLDivElement | null>(null);
const seqRef = ref<HTMLUListElement | null>(null);

// State
const seqWidth = ref(0);
const seqHeight = ref(0);
const copyCount = ref<number>(ANIMATION_CONFIG.MIN_COPIES);
const isHovered = ref(false);

// Animation State
const rafId = ref<number | null>(null);
const lastTimestamp = ref<number | null>(null);
const offset = ref(0);
const velocity = ref(0);

// Computed
const isVertical = computed(() => props.direction === 'up' || props.direction === 'down');

const effectiveHoverSpeed = computed(() => {
  if (props.hoverSpeed !== undefined) return props.hoverSpeed;
  if (props.pauseOnHover) return 0;
  return undefined;
});

const targetVelocity = computed(() => {
  const magnitude = Math.abs(props.speed);
  let directionMultiplier: number;
  if (isVertical.value) {
    directionMultiplier = props.direction === 'up' ? 1 : -1;
  } else {
    directionMultiplier = props.direction === 'left' ? 1 : -1;
  }
  const speedMultiplier = props.speed < 0 ? -1 : 1;
  return magnitude * directionMultiplier * speedMultiplier;
});

const cssVariables = computed(() => ({
  '--logoloop-gap': `${props.gap}px`,
  '--logoloop-logoHeight': `${props.logoHeight}px`,
  ...(props.fadeOutColor && { '--logoloop-fadeColor': props.fadeOutColor })
}));

const rootClasses = computed(() => [
  'relative group',
  isVertical.value ? 'overflow-hidden h-full inline-block' : 'overflow-x-hidden',
  '[--logoloop-gap:32px]',
  '[--logoloop-logoHeight:28px]',
  '[--logoloop-fadeColorAuto:#ffffff]',
  'dark:[--logoloop-fadeColorAuto:#0b0b0b]',
  props.scaleOnHover && 'py-[calc(var(--logoloop-logoHeight)*0.1)]',
  props.className
].filter(Boolean).join(' '));

const containerStyle = computed(() => {
  const w = typeof props.width === 'number' ? `${props.width}px` : props.width;
  return {
    width: isVertical.value
      ? (w === '100%' ? undefined : w)
      : (w ?? '100%'),
    ...cssVariables.value,
    ...props.style
  };
});

// Methods
const updateDimensions = () => {
  if (!containerRef.value || !seqRef.value) return;

  const containerWidth = containerRef.value.clientWidth ?? 0;
  const sequenceRect = seqRef.value.getBoundingClientRect();
  const sequenceWidth = sequenceRect.width ?? 0;
  const sequenceHeight = sequenceRect.height ?? 0;

  if (isVertical.value) {
    const parentHeight = containerRef.value.parentElement?.clientHeight ?? 0;
    if (parentHeight > 0) {
      const targetHeight = Math.ceil(parentHeight);
      if (containerRef.value.style.height !== `${targetHeight}px`) {
        containerRef.value.style.height = `${targetHeight}px`;
      }
    }
    if (sequenceHeight > 0) {
      seqHeight.value = Math.ceil(sequenceHeight);
      const viewport = containerRef.value.clientHeight ?? parentHeight ?? sequenceHeight;
      const copiesNeeded = Math.ceil(viewport / sequenceHeight) + ANIMATION_CONFIG.COPY_HEADROOM;
      copyCount.value = Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded);
    }
  } else if (sequenceWidth > 0) {
    seqWidth.value = Math.ceil(sequenceWidth);
    const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
    copyCount.value = Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded);
  }
};

const handleMouseEnter = () => {
  if (effectiveHoverSpeed.value !== undefined) isHovered.value = true;
};

const handleMouseLeave = () => {
  if (effectiveHoverSpeed.value !== undefined) isHovered.value = false;
};

// Animation Loop
const animate = (timestamp: number) => {
  if (lastTimestamp.value === null) {
    lastTimestamp.value = timestamp;
  }

  const deltaTime = Math.max(0, timestamp - lastTimestamp.value) / 1000;
  lastTimestamp.value = timestamp;

  const target = (isHovered.value && effectiveHoverSpeed.value !== undefined) 
    ? effectiveHoverSpeed.value 
    : targetVelocity.value;

  const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
  velocity.value += (target - velocity.value) * easingFactor;

  const seqSize = isVertical.value ? seqHeight.value : seqWidth.value;

  if (seqSize > 0 && trackRef.value) {
    let nextOffset = offset.value + velocity.value * deltaTime;
    nextOffset = ((nextOffset % seqSize) + seqSize) % seqSize;
    offset.value = nextOffset;

    const transformValue = isVertical.value
      ? `translate3d(0, ${-offset.value}px, 0)`
      : `translate3d(${-offset.value}px, 0, 0)`;
    trackRef.value.style.transform = transformValue;
  }

  rafRef.value = isVisible && !isReducedMotion ? requestAnimationFrame(animate) : null;
};

const rafRef = ref<number | null>(null);
let resizeObserver: ResizeObserver | null = null;
let visibilityObserver: IntersectionObserver | null = null;
let isVisible = true;
let isReducedMotion = false;

// Lifecycle
onMounted(() => {
  // Resize Observer
  if (containerRef.value && seqRef.value) {
    resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.value);
    resizeObserver.observe(seqRef.value);
  }

  // Image Loading
  const checkImages = () => {
    if (!seqRef.value) return;
    const images = seqRef.value.querySelectorAll('img');
    if (images.length === 0) {
      updateDimensions();
      return;
    }

    const onLoad = () => {
      updateDimensions(); // Update on every image load
    };

    images.forEach(img => {
      if (img.complete) {
        onLoad();
      } else {
        img.addEventListener('load', onLoad, { once: true });
        img.addEventListener('error', onLoad, { once: true });
      }
    });
  };
  
  // Initial check and watch for prop changes that might reload images
  // Force initial dimensions calculation even before images load
  if (containerRef.value) {
    const containerWidth = containerRef.value.clientWidth;
    if (containerWidth > 0) {
      // Estimate sequence width based on logo count and gap if not yet measured
      if (seqWidth.value === 0 && props.logos.length > 0) {
         // Rough estimation: (logoHeight * aspect_ratio + gap) * count
         // Assuming 1:1 aspect ratio for safety
         const estimatedSeqWidth = props.logos.length * (props.logoHeight + props.gap);
         seqWidth.value = estimatedSeqWidth;
         
         const copiesNeeded = Math.ceil(containerWidth / estimatedSeqWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
         copyCount.value = Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded);
      }
    }
  }
  
  updateDimensions(); // Immediate update
  checkImages();
  
  isReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  visibilityObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible && !isReducedMotion && rafRef.value === null) {
      lastTimestamp.value = null;
      rafRef.value = requestAnimationFrame(animate);
    }
  }, { threshold: 0.01 });
  if (containerRef.value) visibilityObserver.observe(containerRef.value);
  if (!isReducedMotion) rafRef.value = requestAnimationFrame(animate);
});

onUnmounted(() => {
  if (rafRef.value !== null) {
    cancelAnimationFrame(rafRef.value);
    rafRef.value = null;
  }
  resizeObserver?.disconnect();
  visibilityObserver?.disconnect();
});

// Watchers
watch(() => [props.logos, props.gap, props.logoHeight, props.direction], () => {
  nextTick(updateDimensions);
});

</script>

<template>
  <div 
    ref="containerRef" 
    :class="rootClasses" 
    :style="containerStyle" 
    role="region" 
    :aria-label="ariaLabel"
  >
    <template v-if="fadeOut">
      <template v-if="isVertical">
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-x-0 top-0 z-10 h-[clamp(24px,8%,120px)] bg-[linear-gradient(to_bottom,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]"
        />
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[clamp(24px,8%,120px)] bg-[linear-gradient(to_top,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]"
        />
      </template>
      <template v-else>
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-y-0 left-0 z-10 w-[clamp(24px,8%,120px)] bg-[linear-gradient(to_right,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]"
        />
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-y-0 right-0 z-10 w-[clamp(24px,8%,120px)] bg-[linear-gradient(to_left,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]"
        />
      </template>
    </template>

    <div
      ref="trackRef"
      :class="[
        'flex will-change-transform select-none relative z-0',
        'motion-reduce:transform-none',
        isVertical ? 'flex-col h-max w-full' : 'flex-row w-max'
      ]"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <ul
        v-for="copyIndex in copyCount"
        :key="`copy-${copyIndex}`"
        :ref="(el) => { if (copyIndex === 1) seqRef = el as HTMLUListElement }"
        :class="['flex items-center', isVertical && 'flex-col']"
        role="list"
        :aria-hidden="copyIndex > 1"
      >
        <li
          v-for="(item, itemIndex) in logos"
          :key="`${copyIndex}-${itemIndex}`"
          :class="[
            'flex-none text-[length:var(--logoloop-logoHeight)] leading-[1]',
            isVertical ? 'mb-[var(--logoloop-gap)]' : 'mr-[var(--logoloop-gap)]',
            scaleOnHover && 'overflow-visible group/item'
          ]"
          role="listitem"
        >
          <slot name="item" :item="item" :index="itemIndex">
            <!-- Default Rendering -->
            <a
              v-if="item.href"
              :href="item.href"
              target="_blank"
              rel="noreferrer noopener"
              :class="[
                'inline-flex items-center no-underline rounded',
                'transition-opacity duration-200 ease-linear',
                'hover:opacity-80',
                'focus-visible:outline focus-visible:outline-current focus-visible:outline-offset-2'
              ]"
              :aria-label="item.alt || item.title || 'logo link'"
            >
              <img
                :src="item.src"
                :srcset="item.srcSet"
                :sizes="item.sizes"
                :width="item.width"
                :height="item.height"
                :alt="item.alt ?? ''"
                :title="item.title"
                loading="lazy"
                decoding="async"
                draggable="false"
                :class="[
                  'h-[var(--logoloop-logoHeight)] w-auto block object-contain',
                  '[-webkit-user-drag:none] pointer-events-none',
                  '[image-rendering:-webkit-optimize-contrast]',
                  'motion-reduce:transition-none',
                  scaleOnHover && 'transition-transform duration-300 ease-in-out group-hover/item:scale-120'
                ]"
              />
            </a>
            <img
              v-else
              :src="item.src"
              :srcset="item.srcSet"
              :sizes="item.sizes"
              :width="item.width"
              :height="item.height"
              :alt="item.alt ?? ''"
              :title="item.title"
              loading="lazy"
              decoding="async"
              draggable="false"
              :class="[
                'h-[var(--logoloop-logoHeight)] w-auto block object-contain',
                '[-webkit-user-drag:none] pointer-events-none',
                '[image-rendering:-webkit-optimize-contrast]',
                'motion-reduce:transition-none',
                scaleOnHover && 'transition-transform duration-300 ease-in-out group-hover/item:scale-120'
              ]"
            />
          </slot>
        </li>
      </ul>
    </div>
  </div>
</template>
