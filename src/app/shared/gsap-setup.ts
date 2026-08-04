import type { gsap as GsapCore } from 'gsap';

type Gsap = typeof GsapCore;

let cached: Promise<Gsap> | null = null;

// Memoized dynamic import: gsap + the two plugins every section needs
// (ScrollTrigger for scrub/entrance choreography, MotionPathPlugin for the
// pipeline section's traveling data particle) are fetched and registered
// exactly once no matter how many section components call this. Browser-only
// callers are expected to guard invocation (e.g. from `afterNextRender`) so
// this never runs during SSR/prerender.
export function loadGsap(): Promise<Gsap> {
  if (!cached) {
    cached = Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/MotionPathPlugin')]).then(
      ([gsapModule, scrollTriggerModule, motionPathModule]) => {
        gsapModule.gsap.registerPlugin(scrollTriggerModule.ScrollTrigger, motionPathModule.MotionPathPlugin);
        return gsapModule.gsap;
      }
    );
  }
  return cached;
}
