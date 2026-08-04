import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { prefersReducedMotion } from '../../shared/reduced-motion.util';

/**
 * Adds a `.is-visible` class the first time the host element scrolls into
 * view, letting CSS (see `.reveal` in marketing-shared.scss) handle the
 * actual fade/slide transition. Falls back to immediately-visible when
 * IntersectionObserver isn't available (SSR) or the user prefers reduced
 * motion, so the marketing site never depends on JS for readable content.
 */
@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  // Bare attribute usage (`appScrollReveal` with no binding) resolves to an
  // empty string, so this must tolerate string | number rather than being
  // typed as a plain number.
  @Input('appScrollReveal') delay: number | string = 0;

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngOnInit(): void {
    const host = this.el.nativeElement;
    this.renderer.addClass(host, 'reveal');

    if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) {
      this.renderer.addClass(host, 'is-visible');
      return;
    }

    const delayMs = Number(this.delay) || 0;
    if (delayMs) {
      this.renderer.setStyle(host, 'transition-delay', `${delayMs}ms`);
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.renderer.addClass(host, 'is-visible');
            this.observer?.unobserve(host);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    this.observer.observe(host);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
