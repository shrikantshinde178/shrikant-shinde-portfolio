import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  @ViewChild('impactSection') impactSection!: ElementRef;

  showTechnical = true;

  reportsCount = 0;
  reductionPercent = 0;
  accuracy = 0;
  hasAnimated = false;

  ngAfterViewInit() {
    setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            this.startCounters();
            observer.disconnect();
          }
        },
        { threshold: 0.3 },
      );
      observer.observe(this.impactSection.nativeElement);
    }, 200);
  }

  startCounters() {
    setTimeout(() => {
      this.animateCount(30, (val) => (this.reportsCount = val));
    }, 200); // Updated to your latest metric metrics
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

  resume = {
    url: 'https://drive.google.com/file/d/151q0h7N0qlKPVMlSJvYlP9IfpjbZlsWH/view?usp=sharing',
    label: 'Access Full Executive Portfolio',
    download: false,
  };

  education = [
    {
      degree: 'Masters in Computer Science',
      institution: 'University Of Pune',
      website: 'https://beta.unipune.ac.in/',
      year: '2024',
      highlight: true,
      summary:
        'Specialized in Advanced Database Management Architecture, Software Engineering Principles, and Machine Learning.',
    },
  ];

  yardiModules = [
    { name: 'Voyager 7S', icon: 'assets/real-estate-logo/yardi voyager 7.png' },
    {
      name: 'Residential & Affordable',
      icon: 'assets/real-estate-logo/Residential-Affordable modules yardi.png',
    },
    {
      name: 'YSR / Custom Reporting',
      icon: 'assets/real-estate-logo/Yardi YSR.png',
    },
    {
      name: 'Procure to Pay (P2P)',
      icon: 'assets/real-estate-logo/yardi p2p.png',
    },
    {
      name: 'PHA Public Housing Authority',
      icon: 'assets/real-estate-logo/Public Housing Authority.png',
    },
    { name: 'RentCafe Suite', icon: 'assets/real-estate-logo/Rent cafe.png' },
    {
      name: 'AR/AP Financials',
      icon: 'assets/real-estate-logo/Yardi Virtuso.png',
    },
    {
      name: 'HUD Compliance',
      icon: 'assets/real-estate-logo/Yardi Virtuso.png',
    },
    {
      name: 'Payment Processing',
      icon: 'assets/real-estate-logo/Yardi Virtuso.png',
    },
  ];

  techStack = [
    'Angular 17',
    'TypeScript',
    'SQL Server',
    'MongoDB',
    'Java 8',
    'Python',
    'RESTful API',
    'Spring Boot',
    'Hibernate',
    'AWS Cloud',
  ];
}
