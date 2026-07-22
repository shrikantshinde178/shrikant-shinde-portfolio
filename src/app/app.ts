import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

interface Stat {
  label: string;
  target: number;
  suffix: string;
  animatedValue?: number;
}

interface NavTab {
  label: string;
  action: () => void;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatDialogModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  protected activeSlideIndex = 0;
  private slideTimer: any;

  constructor(
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (typeof gtag === 'function') {
          gtag('config', 'G-QYZEE2C6MJ', {
            page_path: event.urlAfterRedirects,
          });
        }
      }
    });
  }

  ngOnInit(): void {
    this.animateStats();
    // this.startModuleSlider();
  }

  ngOnDestroy(): void {
    if (this.slideTimer) {
      clearInterval(this.slideTimer);
    }
  }

  // private startModuleSlider(): void {
  //   this.slideTimer = setInterval(() => {
  //     this.activeSlideIndex = this.activeSlideIndex === 0 ? 1 : 0;
  //   }, 4000);
  // }

  playFullVideo(): void {
    this.router.navigate(['/intro']);
  }

  animateStats(): void {
    this.stats.forEach((stat) => {
      if (!stat.target) return;

      let current = 0;
      const duration = 1200;
      const stepTime = 20;
      const increment = stat.target / (duration / stepTime);

      const interval = setInterval(() => {
        current += increment;

        if (current >= stat.target) {
          current = stat.target;
          clearInterval(interval);
        }

        stat.animatedValue = Math.floor(current);
      }, stepTime);
    });
  }

  formatValue(value: number): string {
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + 'B';
    }
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
  }

  private openDialog(
    component: any,
    width: string = '90vw',
    height: string = '90vh',
    customClass: string = 'standard-panel',
  ) {
    this.dialog.open(
      component,
      this.getDialogConfig(width, height, customClass),
    );
  }

  async openProjects() {
    const { Projects } = await import('./components/projects/projects');
    this.openDialog(Projects, '90vw', '90vh', 'content-panel-large');
  }

  async openEducation() {
    const { Education } = await import('./components/education/education');
    this.openDialog(Education, '90vw', '90vh', 'content-panel-large');
  }

  async openExperience() {
    const { Experience } = await import('./components/experience/experience');
    this.openDialog(Experience, '90vw', '90vh', 'content-panel-large');
  }

  async openLinks() {
    const { SocialLinks } =
      await import('./components/social-links/social-links');
    this.openDialog(SocialLinks, '60vw', '60vh', 'contact-bento-panel');
  }

  private getDialogConfig(
    targetWidth: string,
    targetHeight: string,
    customClass: string,
  ) {
    const isMobile = window.innerWidth < 900;

    return {
      width: isMobile ? '95vw' : targetWidth,
      maxWidth: isMobile ? '95vw' : targetWidth,
      height: isMobile ? '90vh' : targetHeight,
      maxHeight: isMobile ? '90vh' : targetHeight,
      panelClass: ['custom-dialog-container', customClass],
      backdropClass: 'custom-backdrop',
      autoFocus: false,
    };
  }

  protected readonly brand = {
    name: 'Shrikant',
    lastName: 'Shinde',
    location: 'India',
    timezoneLabel: 'IST',
    overlapNote: 'Overlaps US mornings · UK/EU afternoons · AU evenings',
    fileRef: 'YRD-2026',
    brief:
      'I specialize in Yardi Voyager administration, configuration, SQL reporting, data workflows, and property management operations. I support Affordable Housing, PHA/Section 8, Residential, and Commercial environments, helping property teams improve reporting accuracy, streamline workflows, and resolve system issues.',
    resumeUrl:
      'https://drive.google.com/file/d/151q0h7N0qlKPVMlSJvYlP9IfpjbZlsWH/view?usp=sharing',
    contactEmail: 'shrikant.shinde@gmail.com',
    availableForWork: true,
  };

  protected readonly heroStat = {
    value: '1.5B+',
    label: 'Rows Processed',
  };

  protected readonly specialtyTags: string[] = [
    'Affordable Housing',
    'PHA / Section 8',
    'LIHTC',
    'Residential',
    'Commercial',
    'SQL & Reporting',
  ];

  protected readonly stats: Stat[] = [
    { label: 'Custom reports built', target: 36, suffix: '+' },
    { label: 'Years in Yardi', target: 2, suffix: '+' },
    // { label: 'Units Supported', target: 1200, suffix: '+' },
    { label: 'Clients Environments', target: 5, suffix: '+' },
  ];

  protected readonly navTabs: NavTab[] = [
    { label: 'Project gallery', action: () => this.openProjects() },
    { label: 'Experience timeline', action: () => this.openExperience() },
    { label: 'Tech stack', action: () => this.openEducation() },
    { label: 'Contact', action: () => this.openLinks() },
  ];
}

declare const gtag: (...args: any[]) => void;
