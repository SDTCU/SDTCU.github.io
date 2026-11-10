<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { Mesh, Program, Renderer, Triangle } from 'ogl';

const containerRef = ref<HTMLDivElement | null>(null);

const vertexShader = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragmentShader = `#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPointerActive;
uniform vec3 uColor;
uniform vec3 uGlintColor;
uniform vec4 uBackground;
uniform float uDpr;
out vec4 fragColor;

void main() {
  vec2 pixel = gl_FragCoord.xy / uDpr;
  vec2 centered = (pixel - uResolution * 0.5) / min(uResolution.x, uResolution.y);
  float slatWidth = 8.0;
  float slatHeight = 8.0;
  vec2 pitch = vec2(slatWidth + 5.0, slatHeight + 5.0);
  vec2 cell = floor(pixel / pitch);
  vec2 local = mod(pixel, pitch) - pitch * 0.5;
  float idleWave = (sin(centered.x * 5.0 + uTime * 0.55) + sin(centered.y * 7.0 - uTime * 0.38) + sin((centered.x + centered.y) * 9.0 + uTime * 0.24)) / 3.0;
  vec2 pointer = (uPointer - uResolution * 0.5) / min(uResolution.x, uResolution.y);
  float pointerFalloff = exp(-distance(centered, pointer) * distance(centered, pointer) * 11.0) * uPointerActive;
  vec2 force = normalize(centered - pointer + vec2(0.0001)) * pointerFalloff;
  float wave = idleWave * 0.22 + pointerFalloff * 1.15;
  float angle = wave * 0.42 + force.x * 0.22;
  float c = cos(angle);
  float s = sin(angle);
  vec2 rotated = vec2(c * local.x + s * local.y, c * local.y - s * local.x);
  float brightness = 0.52 + 0.3 * sin(cell.x * 0.23 + cell.y * 0.17 + uTime * 0.7 + wave * 3.0);
  float glint = smoothstep(0.62, 1.0, pointerFalloff + brightness * 0.32);
  float shape = 1.0 - smoothstep(0.0, 1.2, length(rotated) - slatWidth * 0.5);
  float alpha = shape * (0.045 + brightness * 0.14 + pointerFalloff * 0.24);
  float colorMix = 0.5 + 0.5 * sin(cell.x * 0.45 + cell.y * 0.11);
  vec3 baseColor = mix(uColor, uGlintColor, colorMix * 0.82);
  vec3 slatColor = mix(baseColor, uGlintColor, glint * 0.28);
  vec3 color = mix(uBackground.rgb, slatColor, clamp(alpha, 0.0, 0.9));
  fragColor = vec4(color, uBackground.a);
}`;

let renderer: Renderer | null = null;
let animationFrame = 0;
let resizeObserver: ResizeObserver | null = null;
let visibilityObserver: IntersectionObserver | null = null;
let pointerMoveHandler: ((event: PointerEvent) => void) | null = null;
let pointerLeaveHandler: (() => void) | null = null;
let isVisible = true;

onMounted(() => {
  const container = containerRef.value;
  if (!container) return;

  renderer = new Renderer({ alpha: true, antialias: false, depth: false });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  const canvas = gl.canvas;
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);

  const uniforms = {
    uResolution: { value: [1, 1] },
    uTime: { value: 0 },
    uPointer: { value: [0, 0] },
    uPointerActive: { value: 0 },
    uColor: { value: [0.86, 0.08, 0.12] },
    uGlintColor: { value: [0.12, 0.68, 0.32] },
    uBackground: { value: [0.98, 0.98, 0.98, 0.52] },
    uDpr: { value: 1 }
  };
  const mesh = new Mesh(gl, {
    geometry: new Triangle(gl),
    program: new Program(gl, { vertex: vertexShader, fragment: fragmentShader, uniforms, depthTest: false, depthWrite: false })
  });

  let width = 1;
  let height = 1;
  let pointerActive = false;
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  let lastTime = performance.now();
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  const resize = () => {
    width = Math.max(1, container.clientWidth);
    height = Math.max(1, container.clientHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer!.dpr = dpr;
    renderer!.setSize(width, height);
    uniforms.uResolution.value = [width, height];
    uniforms.uDpr.value = dpr;
    pointerX = targetX = width * 0.5;
    pointerY = targetY = height * 0.5;
  };

  pointerMoveHandler = (event: PointerEvent) => {
    const bounds = container.getBoundingClientRect();
    const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
    pointerActive = inside;
    if (inside) {
      targetX = event.clientX - bounds.left;
      targetY = height - (event.clientY - bounds.top);
    }
  };
  pointerLeaveHandler = () => { pointerActive = false; };
  window.addEventListener('pointermove', pointerMoveHandler, { passive: true });
  window.addEventListener('blur', pointerLeaveHandler);
  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  const frame = (time: number) => {
    const dt = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    const elapsed = reducedMotion ? 0 : time * 0.001;
    const idleX = width * 0.5 + Math.cos(elapsed * 0.32) * width * 0.22;
    const idleY = height * 0.5 + Math.sin(elapsed * 0.47) * height * 0.24;
    const followX = pointerActive ? targetX : idleX;
    const followY = pointerActive ? targetY : height - idleY;
    const smoothing = 1 - Math.pow(0.001, dt);
    pointerX += (followX - pointerX) * smoothing;
    pointerY += (followY - pointerY) * smoothing;
    uniforms.uTime.value = elapsed;
    uniforms.uPointer.value = [pointerX, pointerY];
    uniforms.uPointerActive.value += ((pointerActive ? 1 : 0) - uniforms.uPointerActive.value) * smoothing;
    if (isVisible) {
      renderer?.render({ scene: mesh });
      animationFrame = requestAnimationFrame(frame);
    } else {
      animationFrame = 0;
    }
  };
  visibilityObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible && !animationFrame && !reducedMotion) {
      lastTime = performance.now();
      animationFrame = requestAnimationFrame(frame);
    }
  }, { threshold: 0.01 });
  visibilityObserver.observe(container);
  if (!reducedMotion) animationFrame = requestAnimationFrame(frame);
  else renderer.render({ scene: mesh });
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrame);
  resizeObserver?.disconnect();
  visibilityObserver?.disconnect();
  if (pointerMoveHandler) window.removeEventListener('pointermove', pointerMoveHandler);
  if (pointerLeaveHandler) window.removeEventListener('blur', pointerLeaveHandler);
  renderer?.gl.getExtension('WEBGL_lose_context')?.loseContext();
  renderer = null;
});
</script>

<template>
  <div ref="containerRef" aria-hidden="true" class="absolute inset-0 z-0 overflow-hidden pointer-events-none" />
</template>
