import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../scroll-reveal.directive';
import { TiltDirective } from '../../../../shared/tilt/tilt.directive';

interface Capability {
  icon: 'monitoring' | 'prediction' | 'analytics' | 'maintenance' | 'iot' | 'decision';
  title: string;
  description: string;
  detail: string;
  metric: string;
}

@Component({
  selector: 'app-capabilities',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective, TiltDirective],
  templateUrl: './capabilities.component.html',
  styleUrl: './capabilities.component.scss',
})
export class CapabilitiesComponent {
  readonly capabilities: Capability[] = [
    {
      icon: 'monitoring',
      title: 'Surveillance en temps réel',
      description: 'Visibilité à la milliseconde sur chaque équipement connecté.',
      detail: 'Les données MQTT, OPC-UA et Modbus sont unifiées dans un flux de télémétrie en direct, avec des alertes en moins d’une seconde.',
      metric: '<200 ms de latence',
    },
    {
      icon: 'prediction',
      title: 'Prédiction des pannes par IA',
      description: 'Détectez la dégradation avant qu’elle ne provoque un arrêt.',
      detail: 'Des modèles de Deep Learning entraînés sur des millions de cycles signalent les anomalies plusieurs semaines avant le seuil de panne.',
      metric: '95 % de précision',
    },
    {
      icon: 'analytics',
      title: 'Analytique prédictive',
      description: 'Transformez le bruit des capteurs en prévisions de maintenance.',
      detail: 'Estimation du délai avant panne, score de confiance et analyse des tendances sur l’ensemble de votre parc, dans une seule vue.',
      metric: 'Prévisions sur tout le parc',
    },
    {
      icon: 'maintenance',
      title: 'Optimisation de la maintenance',
      description: 'Planifiez les interventions au moment le plus pertinent.',
      detail: 'Les ordres de travail classés par IA équilibrent urgence, disponibilité des pièces et charge des techniciens pour réduire les pannes et les interventions inutiles.',
      metric: '-35 % de coûts de maintenance',
    },
    {
      icon: 'iot',
      title: 'Intégration IoT',
      description: 'Tous vos capteurs sur une seule plateforme.',
      detail: 'Des connecteurs périphériques indépendants des fournisseurs réunissent les capteurs vibratoires, thermiques, acoustiques et électriques dans un modèle unique.',
      metric: 'Plus de 2 400 capteurs pris en charge',
    },
    {
      icon: 'decision',
      title: 'Intelligence décisionnelle',
      description: 'Du signal à l’action, automatiquement.',
      detail: 'Les intégrations ERP et GMAO transforment directement une prédiction en ordre de travail envoyé, sans tri manuel.',
      metric: 'Compatible ERP et GMAO',
    },
  ];
}
