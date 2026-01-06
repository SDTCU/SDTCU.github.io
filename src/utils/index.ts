import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 图片加载优化工具
// 使用 jsDelivr CDN 加速 GitHub Pages 上的静态资源
const CDN_PREFIX = 'https://cdn.jsdelivr.net/gh/SDTCU/SDTCU.github.io@gh-pages';

/**
 * 解析图片路径
 * 在开发环境下直接返回原始路径
 * 在生产环境下将本地路径转换为 jsDelivr CDN 路径
 * @param path 图片路径 (e.g., '/logos/sdu.png')
 */
export const resolveImage = (path: string): string => {
  // 如果是完整的 URL (http/https)，直接返回
  if (path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }

  // 开发环境或 SSR (这里假设是客户端渲染，简单判断)
  // 如果需要更严格的环境判断，可以使用 import.meta.env.DEV
  if (import.meta.env.DEV) {
    return path;
  }

  // 生产环境：使用 jsDelivr
  // 移除开头的斜杠以拼接
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${CDN_PREFIX}/${cleanPath}`;
};
