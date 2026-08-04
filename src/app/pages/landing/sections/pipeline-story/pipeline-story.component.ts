import { Component, ElementRef, OnDestroy, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../scroll-reveal.directive';
import { loadGsap } from '../../../../shared/gsap-setup';
import { prefersReducedMotion } from '../../../../shared/reduced-motion.util';

interface PipelineNode {
  icon: 'machine' | 'sensor' | 'brain' | 'target' | 'wrench';
  label: string;
  description: string;
}

// Section 1: "Your machines are talking. AI listens." — a scroll-scrubbed
// data pipeline (Machine -> Sensors -> AI Engine -> Prediction ->
// Maintenance Action). On desktop, a particle travels along an SVG path in
// sync with scroll position and each node's icon lights up as the particle
// reaches it; on narrow viewports the SVG/motion-path setup is skipped
// entirely (via gsap.matchMedia) in favor of the plain stacked CSS layout,
// which is cheaper and reads better on a vertical mobile scroll anyway.
@Component({
  selector: 'app-pipeline-story',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './pipeline-story.component.html',
  styleUrl: './pipeline-story.component.scss',
})
export class PipelineStoryComponent implements OnDestroy {
  readonly nodes: PipelineNode[] = [
    { icon: 'machine', label: 'Machine', description: 'Rotating assets stream raw operating signal continuously.' },
    { icon: 'sensor', label: 'Sensors', description: 'Vibration, thermal and acoustic capture at the edge.' },
    { icon: 'brain', label: 'AI Engine', description: 'Deep models score deviation against millions of cycles.' },
    { icon: 'target', label: 'Prediction', description: 'Failure mode and time-to-failure surfaced with confidence.' },
    { icon: 'wrench', label: 'Maintenance Action', description: 'Work orders dispatched before downtime happens.' },
  ];

  private gsapContext?: { revert: () => void };

  constructor(private el: ElementRef<HTMLElement>) {
    afterNextRender(() => this.setupAnimation());
  }

  private async setupAnimation(): Promise<void> {
    if (prefersReducedMotion()) {
      return;
    }

    const gsap = await loadGsap();
    const root = this.el.nativeElement;

    this.gsapContext = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 860px)', () => {
        const path = root.querySelector<SVGPathElement>('.pipeline__path');
        const particle = root.querySelector<SVGCircleElement>('.pipeline__particle');
        const icons = root.querySelectorAll<HTMLElement>('.pipeline-node__icon');

        if (!path || !particle || icons.length === 0) {
          return;
        }

        const pathLength = path.getTotalLength();
        gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top 65%',
            end: 'bottom 55%',
            scrub: 0.6,
          },
        });

        tl.to(path, { strokeDashoffset: 0, ease: 'none' }, 0);
        tl.to(particle, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] }, ease: 'none' }, 0);

        icons.forEach((icon, i) => {
          const position = Math.max(0, i / (icons.length - 1) - 0.08);
          tl.fromTo(icon, { '--glow': 0 }, { '--glow': 1, duration: 0.08, ease: 'none' }, position);
        });
      });
    }, root);
  }

  ngOnDestroy(): void {
    this.gsapContext?.revert();
  }
}
