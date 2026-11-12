import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-contact-me',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './contact-me.component.html',
  styleUrls: ['./contact-me.component.scss'],
})
export class ContactMeComponent {
  readonly contactEmail = 'mr.shrikantshinde@gmail.com';
  readonly linkedinUrl = 'https://linkedin.com/in/shrikantshinde178';
  readonly meetingUrl = 'https://calendly.com';
  readonly resumeUrl = '/assets/resume.pdf';
  readonly formUrl = 'https://calendly.com';

  copied = signal(false);

  async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.contactEmail);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2200);
    } catch {
      window.location.href = `mailto:${this.contactEmail}`;
    }
  }
}
