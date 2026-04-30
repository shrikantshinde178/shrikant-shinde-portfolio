import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatDialogModule, CommonModule],
  templateUrl: './education.html',
  styleUrl: './education.scss',
})
export class Education implements AfterViewInit {
  constructor(public dialogRef: MatDialogRef<Education>) {}

  // =========================
  // VIEW CHILD
  // =========================
  @ViewChild('impactSection') impactSection!: ElementRef;

  // =========================
  // COUNTER STATE
  // =========================
  reportsCount = 0;
  reductionPercent = 0;
  accuracy = 0;

  hasAnimated = false;

  // =========================
  // LIFECYCLE
  // =========================
  ngAfterViewInit() {
    // Delay for dialog rendering
    setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;

            this.startCounters();
            observer.disconnect(); // run only once
          }
        },
        {
          threshold: 0.3,
        },
      );

      observer.observe(this.impactSection.nativeElement);
    }, 200);
  }

  // =========================
  // COUNTER LOGIC
  // =========================
  startCounters() {
    setTimeout(() => {
      this.animateCount(20, (val) => (this.reportsCount = val));
    }, 200);

    setTimeout(() => {
      this.animateCount(30, (val) => (this.reductionPercent = val));
    }, 500);

    setTimeout(() => {
      this.animateCount(99.9, (val) => (this.accuracy = +val.toFixed(1)));
    }, 800);
  }

  animateCount(
    end: number,
    setter: (val: number) => void,
    duration: number = 1500,
  ) {
    let start = 0;
    const increment = end / (duration / 16);

    const counter = setInterval(() => {
      start += increment;

      if (start >= end) {
        setter(end);
        clearInterval(counter);
      } else {
        setter(Math.floor(start));
      }
    }, 16);
  }

  // =========================
  // RESUME
  // =========================
  resume = {
    url: 'https://drive.google.com/file/d/151q0h7N0qlKPVMlSJvYlP9IfpjbZlsWH/view?usp=sharing',
    label: 'View Resume',
    download: false,
  };

  // =========================
  // TOGGLES
  // =========================
  showDomain = false;
  showTechnical = false;

  toggleDomain() {
    this.showDomain = !this.showDomain;
    this.showTechnical = false;
  }

  toggleTechnical() {
    this.showTechnical = !this.showTechnical;
    this.showDomain = false;
  }

  // =========================
  // EDUCATION DATA
  // =========================
  education = [
    {
      degree: 'Master of Science in Computer Science',
      institution: 'University of Pune',
      website: 'https://beta.unipune.ac.in/',
      year: '2024',
      highlight: true,
      summary:
        'Specialized in Advanced Database Management and Software Architecture.',
    },
    {
      degree: 'Bachelor of Computer Science',
      institution: 'University of Pune',
      website: 'https://beta.unipune.ac.in/',
      year: '2022',
      highlight: true,
      summary:
        'Foundational studies in Data Structures, Algorithms, and Web Technologies.',
    },
  ];

  // =========================
  // YARDI MODULES
  // =========================
  yardiModules = [
    {
      name: 'Residential & Affordable',
      icon: 'assets/real-estate-logo/Residential-Affordable modules yardi.png',
    },
    {
      name: 'PHA public housing',
      icon: 'assets/real-estate-logo/Public Housing Authority.png',
    },
    {
      name: 'Voyager 7S',
      icon: 'assets/real-estate-logo/yardi voyager 7.png',
    },
    {
      name: 'YSR / Custom Reporting',
      icon: 'assets/real-estate-logo/Yardi YSR.png',
    },
    {
      name: 'RentCafe Suite',
      icon: 'assets/real-estate-logo/Rent cafe.png',
    },
    {
      name: 'Procure to Pay',
      icon: 'assets/real-estate-logo/yardi p2p.png',
    },
    {
      name: 'Payment Processing',
      icon: 'assets/real-estate-logo/Yardi Virtuso.png',
    },
    {
      name: 'HUD',
      icon: 'assets/real-estate-logo/Yardi Virtuso.png',
    },
  ];

  // =========================
  // SUBJECTS
  // =========================
  subjects = [
    'Database Management Systems',
    'Advanced SQL & Query Optimization',
    'Object-Oriented Programming',
    'Machine Learning',
    'Software Engineering',
  ];

  // =========================
  // TECH STACK
  // =========================
  techStack = [
    'SQL Server',
    'MongoDB',
    'Angular 17',
    'Java 8',
    'Spring Boot',
    'Python',
    'RESTFUL API',
    'TypeScript',
    'AWS',
  ];
}
