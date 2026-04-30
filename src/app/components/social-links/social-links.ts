import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-social-links',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social-links.html',
  styleUrl: './social-links.scss',
})
export class SocialLinks {
  public socialLinks: SocialLink[] = [
    {
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/shrikantshinde178',
      icon: 'fab fa-linkedin',
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
    {
      label: 'Email',
      url: 'mailto:shrikantrs178@gmail.com',
      icon: 'fas fa-envelope',
    },
  ];
}
