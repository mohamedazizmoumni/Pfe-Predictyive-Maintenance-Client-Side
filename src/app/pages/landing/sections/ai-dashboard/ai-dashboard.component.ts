import { Component, OnDestroy, afterNextRender, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { ScrollRevealDirective } from '../../scroll-reveal.directive';
import { CountUpDirective } from '../../../../shared/charts/count-up.directive';

interface AnomalyMarker {
  offset: number; // percent along the timeline axis
  label: string;
  detail: string;
}

// Section 3: "AI Intelligence Dashboard" — a live-feeling product preview
// rather than static marketing cards: a vibration trend chart that draws
// itself in, an anomaly timeline, a counted-up health score + confidence
// bar, and a maintenance recommendation. The RPM/timestamp readouts tick on
// an interval (browser-only, torn down on destroy) to sell the "real-time"
// feel without a real backend.
@Component({
  selector: 'app-ai-dashboard',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective, CountUpDirective],
  templateUrl: './ai-dashboard.component.html',
  styleUrl: './ai-dashboard.component.scss',
})
export class AiDashboardComponent implements OnDestroy {
  readonly rpm = signal(1842);
  readonly secondsAgo = signal(0);

  readonly healthFormat = (v: number) => v.toFixed(1);

  readonly anomalies: AnomalyMarker[] = [
    { offset: 34, label: 'Pic mineur', detail: 'Vibration +0,3 mm/s pendant 40 s, résolu automatiquement.' },
    { offset: 78, label: 'Dérive thermique', detail: 'Logement de palier à +6 °C au-dessus de la référence, suivi en cours.' },
  ];

  private sub?: Subscription;

  constructor() {
    afterNextRender(() => {
      this.sub = interval(2600).subscribe(() => {
        this.rpm.update((v) => Math.max(1500, v + Math.round((Math.random() - 0.5) * 24)));
        this.secondsAgo.set(0);
      });
      this.sub.add(interval(1000).subscribe(() => this.secondsAgo.update((v) => v + 1)));
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
