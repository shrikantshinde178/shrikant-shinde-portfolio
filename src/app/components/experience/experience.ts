import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface ExperienceRecord {
  role: string;
  company: string;
  duration: string;
  description: string;
  current: boolean;
  cta?: string;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, MatIcon, MatDialogModule],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class Experience {
  activeCardIndex: number = 0;

  resume = {
    url: 'https://drive.google.com/file/d/151q0h7N0qlKPVMlSJvYlP9IfpjbZlsWH/view?usp=sharing',
    label: 'Sent Resume Request',
    download: false,
  };

  experiences: ExperienceRecord[] = [
    {
      role: 'Yardi Consultant',
      company: 'Realprop Solutions',
      duration: '2025 - Present',
      description:
        'Working on data and reporting solutions using Yardi Voyager across Commercial, Affordable, and Residential modules. Managing reporting and data operations for a portfolios over 1,200+ units, ensuring accuracy, consistency, and timely insights. Responsible for developing SQL-based reports, supporting ETL processes, and handling cross-platform data workflows.',
      current: true,
      cta: 'Refer to resume for detailed contributions and project work.',
    },
    {
      role: 'Software Engineer Intern',
      company: 'Koktail Soft',
      duration: '2024 - 2025',
      description:
        'Contributed to the development of web applications using Angular and Spring Boot. Built RESTful APIs and reusable UI components, while enhancing existing features to improve application performance and usability.',
      current: false,
      cta: 'Additional details available in resume files.',
    },
  ];

  constructor(public dialogRef: MatDialogRef<Experience>) {}

  setActiveCard(index: number): void {
    this.activeCardIndex = index;
  }

  // DOCK STEP METHOD HANDLERS
  nextCard(): void {
    if (this.activeCardIndex < this.experiences.length - 1) {
      this.activeCardIndex++;
    }
  }

  prevCard(): void {
    if (this.activeCardIndex > 0) {
      this.activeCardIndex--;
    }
  }

  getTrackTranslation(): string {
    const width = window.innerWidth;
    if (width > 850) {
      const offset = this.activeCardIndex * (50 + 4);
      return `translateX(-${offset}vw)`;
    }
    return 'none';
  }

  isCardBlurred(index: number): boolean {
    if (window.innerWidth <= 850) return false;
    return index < this.activeCardIndex;
  }
}
