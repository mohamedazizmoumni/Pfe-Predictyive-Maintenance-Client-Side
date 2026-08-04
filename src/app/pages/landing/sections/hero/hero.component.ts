import { Component, ElementRef, OnDestroy, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CountUpDirective } from '../../../../shared/charts/count-up.directive';
import { IndustrialSceneComponent } from '../../../../shared/three/industrial-scene.component';
import { loadGsap } from '../../../../shared/gsap-setup';
import { prefersReducedMotion } from '../../../../shared/reduced-motion.util';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink, CountUpDirective, IndustrialSceneComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnDestroy {
  // The authenticated app is a separately deployed project, so Sign In is a
  // plain external link rather than a routerLink.
  readonly loginUrl = `${environment.appUrl}/auth/login`;

  readonly sensorCountFormat = (v: number) => `${(v / 1000).toFixed(1)}k+`;
  readonly precisionFormat = (v: number) => `${v.toFixed(1)}%`;

  private gsapContext?: { revert: () => void };

  constructor(private el: ElementRef<HTMLElement>) {
    afterNextRender(() => this.animateEntrance());
  }

  private async animateEntrance(): Promise<void> {
    if (prefersReducedMotion()) {
      return;
    }

    const gsap = await loadGsap();
    this.gsapContext = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });
      tl.from('.hero__badge', { opacity: 0, y: 16 })
        .from('.hero__title .line', { opacity: 0, y: 28, stagger: 0.12 }, '-=0.6')
        .from('.hero__lead', { opacity: 0, y: 16 }, '-=0.5')
        .from('.hero__actions', { opacity: 0, y: 16 }, '-=0.55')
        .from('.hero__stats', { opacity: 0, y: 16 }, '-=0.55')
        .from('.hero__chip', { opacity: 0, scale: 0.85, stagger: 0.15 }, '-=0.5');
    }, this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.gsapContext?.revert();
  }
}
