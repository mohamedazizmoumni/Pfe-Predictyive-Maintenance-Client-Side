import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../scroll-reveal.directive';
import { IndustrialSceneComponent } from '../../../../shared/three/industrial-scene.component';

interface Hotspot {
  position: 'top' | 'left' | 'bottom-right';
  label: string;
  detail: string;
  status: 'nominal' | 'warning';
}

@Component({
  selector: 'app-digital-twin',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective, IndustrialSceneComponent],
  templateUrl: './digital-twin.component.html',
  styleUrl: './digital-twin.component.scss',
})
export class DigitalTwinComponent {
  readonly hotspots: Hotspot[] = [
    {
      position: 'top',
      label: 'Noyau de prédiction IA',
      detail: 'Compare en continu la télémétrie en direct au modèle de panne entraîné.',
      status: 'nominal',
    },
    {
      position: 'left',
      label: 'Ensemble rotor',
      detail: 'Signature vibratoire dans la plage de fonctionnement nominale.',
      status: 'nominal',
    },
    {
      position: 'bottom-right',
      label: 'Logement de palier',
      detail: 'Dérive thermique détectée : panne prédite dans 18 jours.',
      status: 'warning',
    },
  ];
}
