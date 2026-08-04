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
      title: 'Real-Time Monitoring',
      description: 'Millisecond-level visibility into every connected asset.',
      detail: 'MQTT, OPC-UA and Modbus ingestion normalized into one live telemetry stream, with sub-second alerting on threshold breaches.',
      metric: '<200ms latency',
    },
    {
      icon: 'prediction',
      title: 'AI Failure Prediction',
      description: 'Catch degradation before it becomes downtime.',
      detail: 'Deep learning models trained on millions of operating cycles flag anomalies weeks before failure thresholds are crossed.',
      metric: '95% accuracy',
    },
    {
      icon: 'analytics',
      title: 'Predictive Analytics',
      description: 'Turn raw sensor noise into a maintenance forecast.',
      detail: 'Time-to-failure estimates, confidence scoring, and trend analysis across your entire fleet in one view.',
      metric: 'Fleet-wide forecasting',
    },
    {
      icon: 'maintenance',
      title: 'Maintenance Optimization',
      description: 'Schedule work exactly when it matters.',
      detail: 'AI-ranked work orders balance urgency, parts availability and technician load to cut both failures and idle maintenance.',
      metric: '-35% maintenance cost',
    },
    {
      icon: 'iot',
      title: 'IoT Integration',
      description: 'Every sensor, one platform.',
      detail: 'Vendor-agnostic edge connectors bring vibration, thermal, acoustic and current sensors into a single data model.',
      metric: '2,400+ sensors supported',
    },
    {
      icon: 'decision',
      title: 'Decision Intelligence',
      description: 'From signal to action, automatically.',
      detail: 'ERP and CMMS integrations turn a prediction directly into a dispatched work order — no manual triage required.',
      metric: 'ERP & CMMS ready',
    },
  ];
}
