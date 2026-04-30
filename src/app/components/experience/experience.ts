import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, MatIcon, MatDialogModule],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class Experience {
  constructor(public dialogRef: MatDialogRef<Experience>) {}

  resume = {
    url: 'https://drive.google.com/file/d/151q0h7N0qlKPVMlSJvYlP9IfpjbZlsWH/view?usp=sharing',
    label: 'View Resume',
    download: false,
  };

  experiences = [
    {
      role: 'SQL Developer',
      company: 'Realprop Solutions',
      duration: '2025 - Present',
      description:
        'Working on data and reporting solutions using Yardi Voyager across Commercial, Affordable, and Residential modules. Managing reporting and data operations for a portfolios over 1,200+ units, ensuring accuracy, consistency, and timely insights. Responsible for developing SQL-based reports, supporting ETL processes, and handling cross-platform data workflows.',
      current: true,
      cta: '(Refer to resume for detailed contributions and project work.)',
    },
    {
      role: 'Software Engineer Intern',
      company: 'Koktail Soft',
      duration: '2024 - 2025',
      description:
        'Contributed to the development of web applications using Angular and Spring Boot. Built RESTful APIs and reusable UI components, while enhancing existing features to improve application performance and usability.',
      cta: '(Additional details available in resume.)',
    },
  ];
}
