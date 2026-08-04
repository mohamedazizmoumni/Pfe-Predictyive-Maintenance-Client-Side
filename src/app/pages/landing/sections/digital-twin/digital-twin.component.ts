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
      label: 'AI Prediction Core',
      detail: 'Continuously scoring live telemetry against the trained failure model.',
      status: 'nominal',
    },
    {
      position: 'left',
      label: 'Rotor Assembly',
      detail: 'Vibration signature within nominal operating band.',
      status: 'nominal',
    },
    {
      position: 'bottom-right',
      label: 'Bearing Housing',
      detail: 'Thermal drift detected — predicted failure in 18 days.',
      status: 'warning',
    },
  ];
}
