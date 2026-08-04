import { Component } from '@angular/core';
import { MarketingNavComponent } from './components/marketing-nav/marketing-nav.component';
import { MarketingFooterComponent } from './components/marketing-footer/marketing-footer.component';
import { HeroComponent } from './sections/hero/hero.component';
import { PipelineStoryComponent } from './sections/pipeline-story/pipeline-story.component';
import { DigitalTwinComponent } from './sections/digital-twin/digital-twin.component';
import { AiDashboardComponent } from './sections/ai-dashboard/ai-dashboard.component';
import { CapabilitiesComponent } from './sections/capabilities/capabilities.component';
import { ImpactMetricsComponent } from './sections/impact-metrics/impact-metrics.component';
import { FinalCtaComponent } from './sections/final-cta/final-cta.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    MarketingNavComponent,
    MarketingFooterComponent,
    HeroComponent,
    PipelineStoryComponent,
    DigitalTwinComponent,
    AiDashboardComponent,
    CapabilitiesComponent,
    ImpactMetricsComponent,
    FinalCtaComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {}
