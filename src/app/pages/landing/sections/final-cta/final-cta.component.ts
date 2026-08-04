import { Component, afterNextRender, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../scroll-reveal.directive';

interface Particle {
  x: number;
  y: number;
  delay: number;
  duration: number;
}

@Component({
  selector: 'app-final-cta',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  templateUrl: './final-cta.component.html',
  styleUrl: './final-cta.component.scss',
})
export class FinalCtaComponent {
  // Populated client-side only (empty on the server-rendered/prerendered
  // markup) so randomized particle positions never cause a hydration
  // mismatch between server and client output.
  readonly particles = signal<Particle[]>([]);

  constructor() {
    afterNextRender(() => {
      const generated: Particle[] = Array.from({ length: 26 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * -8,
        duration: 6 + Math.random() * 6,
      }));
      this.particles.set(generated);
    });
  }
}
