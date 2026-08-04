import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { MarketingNavComponent } from '../components/marketing-nav/marketing-nav.component';
import { MarketingFooterComponent } from '../components/marketing-footer/marketing-footer.component';
import { ScrollRevealDirective } from '../scroll-reveal.directive';
import { InquiryService } from '../../../core/inquiry.service';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MarketingNavComponent,
    MarketingFooterComponent,
    ScrollRevealDirective,
  ],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss',
})
export class DemoComponent {
  readonly highlights = [
    'Un tour guidé de la plateforme adapté à votre secteur',
    'Une estimation du ROI basée sur votre parc machines',
    "Une réponse à toutes vos questions techniques et d'intégration",
  ];

  form: FormGroup;
  submitted = false;
  submitting = false;
  submitError = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly inquiryService: InquiryService
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      workEmail: ['', [Validators.required, Validators.email]],
      company: ['', Validators.required],
      phone: [''],
      teamSize: [''],
      message: [''],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.submitError = false;

    const { fullName, workEmail, company, phone, teamSize, message } = this.form.value;
    const fleetNote = teamSize ? `Fleet/team size: ${teamSize}` : null;
    const combinedMessage = [message, fleetNote].filter(Boolean).join('\n\n') || 'Requested a product demo.';

    this.inquiryService
      .submitDemoRequest({
        fullName,
        email: workEmail,
        company,
        phone,
        subject: 'Demo Request',
        message: combinedMessage,
      })
      .pipe(
        catchError(() => {
          this.submitError = true;
          return of(null);
        })
      )
      .subscribe((result) => {
        this.submitting = false;
        if (result) {
          this.submitted = true;
        }
      });
  }
}
