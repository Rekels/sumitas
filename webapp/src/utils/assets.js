/**
 * Helper to ensure asset paths respect Vite's base URL across any deployment platform
 * (GitHub Pages subpath, Vercel root, etc.)
 */
export function asset(path) {
  if (!path) return '';
  const clean = path.startsWith('/') ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${clean}`;
}
