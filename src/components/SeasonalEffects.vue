<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<{
  active: boolean
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let animationFrameId: number;
let particles: Particle[] = [];

// Season configuration
type Season = 'spring' | 'summer' | 'autumn' | 'winter';
const currentSeason = ref<Season>('spring');

const getSeason = (): Season => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
};

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  type: 'circle' | 'leaf' | 'petal';

  constructor(w: number, h: number, season: Season) {
    this.x = Math.random() * w;
    this.y = Math.random() * -h; // Start above screen
    
    if (season === 'winter') {
      this.size = Math.random() * 3 + 1;
      this.speedY = Math.random() * 1 + 0.5;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.color = 'rgba(255, 255, 255, 0.8)';
      this.type = 'circle';
    } else if (season === 'autumn') {
      this.size = Math.random() * 8 + 4;
      this.speedY = Math.random() * 1.5 + 0.5;
      this.speedX = Math.random() * 2 - 1;
      const colors = ['#eab308', '#f97316', '#ef4444', '#78350f']; // Yellow, Orange, Red, Brown
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.type = 'leaf';
    } else if (season === 'summer') {
      this.size = Math.random() * 6 + 3;
      this.speedY = Math.random() * 2 + 1;
      this.speedX = Math.random() * 2 - 1;
      this.color = '#4ade80'; // Green
      this.type = 'leaf';
    } else { // Spring
      this.size = Math.random() * 5 + 2;
      this.speedY = Math.random() * 1 + 0.5;
      this.speedX = Math.random() * 1 - 0.5;
      this.color = '#f472b6'; // Pink
      this.type = 'petal';
    }
    
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 2;
  }

  update(w: number, h: number) {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotationSpeed;

    if (this.y > h) {
      this.y = -10;
      this.x = Math.random() * w;
    }
    if (this.x > w) this.x = 0;
    if (this.x < 0) this.x = w;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    
    if (this.type === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'leaf' || this.type === 'petal') {
      // Simple leaf shape
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
}

const initParticles = () => {
  if (!canvasRef.value) return;
  const w = canvasRef.value.width;
  const h = canvasRef.value.height;
  particles = [];
  const count = currentSeason.value === 'winter' ? 100 : 30; // More snow, fewer leaves
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(w, h, currentSeason.value));
    // Randomize initial y for instant effect
    particles[i].y = Math.random() * h;
  }
};

const animate = () => {
  if (!canvasRef.value || !ctx) return;
  const w = canvasRef.value.width;
  const h = canvasRef.value.height;
  
  ctx.clearRect(0, 0, w, h);
  
  particles.forEach(p => {
    p.update(w, h);
    p.draw(ctx!);
  });
  
  animationFrameId = requestAnimationFrame(animate);
};

const handleResize = () => {
  if (!canvasRef.value) return;
  canvasRef.value.width = window.innerWidth;
  canvasRef.value.height = window.innerHeight;
  if (props.active) {
      initParticles();
  }
};

onMounted(() => {
  currentSeason.value = getSeason();
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d');
    canvasRef.value.width = window.innerWidth;
    canvasRef.value.height = window.innerHeight;
    
    if (props.active) {
      initParticles();
      animate();
    }
  }
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', handleResize);
});

watch(() => props.active, (newVal) => {
  if (newVal) {
    initParticles();
    animate();
  } else {
    cancelAnimationFrame(animationFrameId);
    if (ctx && canvasRef.value) {
      ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    }
  }
});

defineExpose({
    currentSeason
})
</script>

<template>
  <canvas 
    ref="canvasRef" 
    class="fixed inset-0 pointer-events-none z-50"
  ></canvas>
</template>
