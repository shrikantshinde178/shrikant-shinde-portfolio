import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';

interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-social-links',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './social-links.html',
  styleUrl: './social-links.scss',
})
export class SocialLinks {
  constructor(private dialogRef: MatDialogRef<SocialLinks>) {}

  closeDialog() {
    this.dialogRef.close();
  }

  public socialLinks: SocialLink[] = [
    {
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/shrikantshinde178',
      icon: 'fab fa-linkedin',
    },
    {
      label: 'Email',
      url: 'mailto:shrikantrs178@gmail.com',
      icon: 'fas fa-envelope',
    },
    {
      label: 'GitHub',
      url: 'https://github.com/shrikantshinde178',
      icon: 'fab fa-github',
    },
    {
      label: 'Twitter',
      url: 'https://x.com/_shrikant_s',
      icon: 'fab fa-x-twitter',
    },
  ];

  cta = {
    txt1: ' I empower Property Owners, Managers & Teams to step into their Power',
    txt2: 'I design and build systems that simplify complex workflows into stable, maintainable, and efficient solutions.',
    txt3: 'I empower Yardi portfolio to step into Power.',
    txt4: 'Open to collaboration, opportunities, or meaningful conversations. reach out below.',
    txt5: 'Available across EST, GMT, IST & AEST time zones.',
    txt6: 'Let’s connect & build something meaningful :)',
  };
}
