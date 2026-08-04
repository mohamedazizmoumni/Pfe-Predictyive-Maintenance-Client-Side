import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { prefersReducedMotion } from '../reduced-motion.util';

// Pointer-driven 3D tilt + cursor-follow glow for premium interactive cards.
// The glow itself is plain CSS (`radial-gradient(circle at var(--tilt-x)
// var(--tilt-y), ...)` on the host, see capabilities.component.scss) — this
// directive's only job is keeping those two custom properties and the tilt
// transform in sync with the pointer. No-ops on coarse pointers (touch) and
// skips the rotation (but keeps the glow) under reduced motion.
@Directive({
  selector: '[appTilt]',
  standalone: true,
})
export class TiltDirective {
  private readonly maxTilt = 8;
  private readonly enabled: boolean;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {
    this.enabled =
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function' ||
      !window.matchMedia('(pointer: coarse)').matches;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.enabled) {
      return;
    }

    const host = this.el.nativeElement;
    const rect = host.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    this.renderer.setStyle(host, '--tilt-x', `${px * 100}%`);
    this.renderer.setStyle(host, '--tilt-y', `${py * 100}%`);

    if (!prefersReducedMotion()) {
      const rotateY = (px - 0.5) * this.maxTilt * 2;
      const rotateX = (0.5 - py) * this.maxTilt * 2;
      this.renderer.setStyle(
        host,
        'transform',
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`
      );
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (!this.enabled) {
      return;
    }

    const host = this.el.nativeElement;
    this.renderer.setStyle(host, 'transform', '');
    this.renderer.setStyle(host, '--tilt-x', '50%');
    this.renderer.setStyle(host, '--tilt-y', '50%');
  }
}
