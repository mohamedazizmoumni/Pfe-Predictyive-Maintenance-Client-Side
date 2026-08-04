import { Component, ElementRef, OnDestroy, afterNextRender, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountUpDirective } from '../../../../shared/charts/count-up.directive';
import { ScrollRevealDirective } from '../../scroll-reveal.directive';

interface ImpactStat {
  value: number;
  format: (v: number) => string;
  label: string;
}

// Section 5: three large counted-up stats. The counter target only flips
// from 0 to its real value once the section scrolls into view (rather than
// on component init, like the hero stats do) so the count-up genuinely
// plays as a scroll-triggered moment instead of firing off-screen.
@Component({
  selector: 'app-impact-metrics',
  standalone: true,
  imports: [CommonModule, CountUpDirective, ScrollRevealDirective],
  templateUrl: './impact-metrics.component.html',
  styleUrl: './impact-metrics.component.scss',
})
export class ImpactMetricsComponent implements OnDestroy {
  readonly stats: ImpactStat[] = [
    { value: 70, format: (v) => `↓${Math.round(v)}%`, label: 'Unexpected Failures' },
    { value: 35, format: (v) => `↑${Math.round(v)}%`, label: 'Equipment Availability' },
    { value: 95, format: (v) => `${Math.round(v)}%`, label: 'Prediction Accuracy' },
  ];

  readonly visible = signal(false);
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined') {
        this.visible.set(true);
        return;
      }
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.visible.set(true);
            this.observer?.disconnect();
          }
        },
        { threshold: 0.4 }
      );
      this.observer.observe(this.el.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
