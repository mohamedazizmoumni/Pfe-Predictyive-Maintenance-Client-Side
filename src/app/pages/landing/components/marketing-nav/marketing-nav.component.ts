import { Component, OnDestroy, afterNextRender, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../../../../environments/environment';

interface NavLink {
  label: string;
  fragment: string;
}

@Component({
  selector: 'app-marketing-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './marketing-nav.component.html',
  styleUrl: './marketing-nav.component.scss',
})
export class MarketingNavComponent implements OnDestroy {
  // The authenticated app is a separately deployed project, so Sign In is a
  // plain external link rather than a routerLink.
  readonly loginUrl = `${environment.appUrl}/auth/login`;

  readonly links: NavLink[] = [
    { label: 'Platform', fragment: 'platform' },
    { label: 'AI Engine', fragment: 'ai-engine' },
    { label: 'Digital Twin', fragment: 'digital-twin' },
    { label: 'Analytics', fragment: 'analytics' },
    { label: 'Solutions', fragment: 'solutions' },
  ];

  mobileMenuOpen = false;
  readonly scrolled = signal(false);

  private sentinel?: HTMLElement;
  private observer?: IntersectionObserver;

  constructor() {
    // Self-contained scroll state: rather than depending on a sentinel
    // element some *other* page happens to render, plant our own 1px marker
    // at the top of the document so the floating pill's "scrolled" look
    // works identically on every route the nav is mounted on.
    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined') {
        return;
      }

      this.sentinel = document.createElement('span');
      this.sentinel.setAttribute('aria-hidden', 'true');
      this.sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
      document.body.prepend(this.sentinel);

      this.observer = new IntersectionObserver(
        ([entry]) => this.scrolled.set(!entry.isIntersecting),
        { threshold: 0 }
      );
      this.observer.observe(this.sentinel);
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.sentinel?.remove();
  }
}
