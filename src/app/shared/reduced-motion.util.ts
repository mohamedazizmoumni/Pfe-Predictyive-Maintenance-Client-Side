// Browser-only check; callers on the server (SSR/prerender) never see a
// `window`, so this safely resolves to false rather than throwing.
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
