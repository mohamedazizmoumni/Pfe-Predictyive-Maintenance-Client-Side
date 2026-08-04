import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { MarketingNavComponent } from '../components/marketing-nav/marketing-nav.component';
import { MarketingFooterComponent } from '../components/marketing-footer/marketing-footer.component';
import { ScrollRevealDirective } from '../scroll-reveal.directive';
import { InquiryService } from '../../../core/inquiry.service';

interface ContactChannel {
  icon: 'mail' | 'phone' | 'pin';
  label: string;
  value: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MarketingNavComponent,
    MarketingFooterComponent,
    ScrollRevealDirective,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  readonly channels: ContactChannel[] = [
    { icon: 'mail', label: 'Email', value: 'contact@sentinel-maintenance.io' },
    { icon: 'phone', label: 'Téléphone', value: '+216 70 000 000' },
    { icon: 'pin', label: 'Bureaux', value: 'Tunis, Tunisie' },
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
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.submitError = false;

    this.inquiryService
      .submitContact(this.form.value)
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
