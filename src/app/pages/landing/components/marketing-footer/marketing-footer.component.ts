import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-marketing-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './marketing-footer.component.html',
  styleUrl: './marketing-footer.component.scss',
})
export class MarketingFooterComponent {
  readonly currentYear = new Date().getFullYear();
}
