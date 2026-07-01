import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';

interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-social-links',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './social-links.html',
  styleUrl: './social-links.scss',
})
export class SocialLinks {
  constructor(public dialogRef: MatDialogRef<SocialLinks>) {}

  closeDialog(): void {
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
      label: 'Twitter / X',
      url: 'https://x.com/_shrikant_s',
      icon: 'fab fa-x-twitter',
    },
  ];
}
