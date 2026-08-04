import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MarketingNavComponent } from '../components/marketing-nav/marketing-nav.component';
import { MarketingFooterComponent } from '../components/marketing-footer/marketing-footer.component';
import { ScrollRevealDirective } from '../scroll-reveal.directive';

interface Step {
  number: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, RouterLink, MarketingNavComponent, MarketingFooterComponent, ScrollRevealDirective],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.scss',
})
export class HowItWorksComponent {
  readonly steps: Step[] = [
    {
      number: '01',
      title: 'Connectez vos capteurs',
      description:
        "Reliez vos capteurs IoT existants (vibration, température, pression...) via MQTT ou OPC-UA. Aucun matériel propriétaire requis.",
    },
    {
      number: '02',
      title: "L'IA analyse en continu",
      description:
        'Nos modèles de Deep Learning apprennent la signature normale de chaque machine et détectent les micro-anomalies en temps réel.',
    },
    {
      number: '03',
      title: 'Recevez des alertes prédictives',
      description:
        'Dès qu\'un risque de panne est identifié, une alerte priorisée est envoyée à la bonne équipe, avec la cause probable et le niveau de criticité.',
    },
    {
      number: '04',
      title: 'Planifiez la maintenance au bon moment',
      description:
        "Utilisez les recommandations et tableaux de bord pour planifier l'intervention avant la panne, réduire les coûts et éviter l'arrêt de production.",
    },
  ];
}
