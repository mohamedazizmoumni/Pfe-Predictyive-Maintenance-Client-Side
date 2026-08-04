import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MarketingNavComponent } from '../components/marketing-nav/marketing-nav.component';
import { MarketingFooterComponent } from '../components/marketing-footer/marketing-footer.component';
import { ScrollRevealDirective } from '../scroll-reveal.directive';

type FeatureIcon = 'pulse' | 'brain' | 'shield' | 'bell' | 'plug' | 'lock';

interface FeatureDetail {
  icon: FeatureIcon;
  title: string;
  description: string;
}

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, RouterLink, MarketingNavComponent, MarketingFooterComponent, ScrollRevealDirective],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss',
})
export class FeaturesComponent {
  readonly features: FeatureDetail[] = [
    {
      icon: 'pulse',
      title: 'Surveillance en Temps Réel',
      description:
        "Suivez l'état de vos actifs en continu avec une précision inégalée. Récupération des données IoT à la milliseconde, sur l'ensemble de votre parc machines.",
    },
    {
      icon: 'brain',
      title: 'Prédiction par IA',
      description:
        "Nos algorithmes de Deep Learning identifient les micro-anomalies bien avant qu'elles ne deviennent des pannes critiques, à partir des vibrations et signatures thermiques.",
    },
    {
      icon: 'shield',
      title: 'Support Décisionnel',
      description:
        'Des tableaux de bord stratégiques pour une prise de décision rapide et efficace. Simplifiez la planification et priorisez vos interventions.',
    },
    {
      icon: 'bell',
      title: 'Alertes Intelligentes',
      description:
        'Recevez des notifications instantanées et priorisées par niveau de criticité, directement dans vos canaux existants (email, SMS, Slack, Teams).',
    },
    {
      icon: 'plug',
      title: 'Intégrations Ouvertes',
      description:
        'Connectez vos capteurs via MQTT ou OPC-UA, et synchronisez vos données avec vos systèmes ERP et GMAO existants sans rupture de flux.',
    },
    {
      icon: 'lock',
      title: 'Sécurité & Conformité',
      description:
        "Chiffrement de bout en bout, contrôle d'accès par rôle et journal d'audit complet pour répondre aux exigences des environnements industriels sensibles.",
    },
  ];
}
