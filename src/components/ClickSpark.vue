<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

interface Props {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  extraScale?: number;
  preventBubble?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  sparkColor: '#fff',
  sparkSize: 10,
  sparkRadius: 15,
  sparkCount: 8,
  duration: 400,
  easing: 'ease-out',
  extraScale: 1.0,
  preventBubble: false
});

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

const canvasRef = ref<HTMLCanvasElement | null>(null);
const rootRef = ref<HTMLDivElement | null>(null);
let sparks: Spark[] = [];
let animationId: number | null = null;
let resizeObserver: ResizeObserver | null = null;
let isReducedMotion = false;

const easeFunc = (t: number) => {
  switch (props.easing) {
    case 'linear':
      return t;
    case 'ease-in':
      return t * t;
    case 'ease-in-out':
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    default:
      return t * (2 - t);
  }
};

const draw = (timestamp: number) => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  sparks = sparks.filter((spark) => {
    const elapsed = timestamp - spark.startTime;
    if (elapsed >= props.duration) {
      return false;
    }

    const progress = elapsed / props.duration;
    const eased = easeFunc(progress);

    const distance = eased * props.sparkRadius * props.extraScale;
    const lineLength = props.sparkSize * (1 - eased);

    const x1 = spark.x + distance * Math.cos(spark.angle);
    const y1 = spark.y + distance * Math.sin(spark.angle);
    const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
    const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

    ctx.strokeStyle = props.sparkColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    return true;
  });

  animationId = sparks.length > 0 ? requestAnimationFrame(draw) : null;
};

const handleClick = (e: MouseEvent) => {
  if (props.preventBubble) {
    e.stopPropagation();
  }

  const canvas = canvasRef.value;
  if (!canvas) return;
  if (isReducedMotion) return;
  
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const now = performance.now();
  const newSparks: Spark[] = Array.from({ length: props.sparkCount }, (_, i) => ({
    x,
    y,
    angle: (2 * Math.PI * i) / props.sparkCount,
    startTime: now
  }));

  sparks.push(...newSparks);
  if (animationId === null) animationId = requestAnimationFrame(draw);
};

onMounted(() => {
  const canvas = canvasRef.value;
  const root = rootRef.value;
  
  if (canvas && root) {
    isReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const resizeCanvas = () => {
      const { width, height } = root.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };
    
    resizeObserver = new ResizeObserver(() => {
        // Small delay to ensure layout is stable
        setTimeout(resizeCanvas, 100);
    });
    resizeObserver.observe(root);
    
    resizeCanvas();
    
  }
});

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId);
  resizeObserver?.disconnect();
});
</script>

<template>
  <div ref="rootRef" class="relative" @click="handleClick">
    <canvas ref="canvasRef" class="absolute inset-0 pointer-events-none block w-full h-full z-10" />
    <slot></slot>
  </div>
</template>
