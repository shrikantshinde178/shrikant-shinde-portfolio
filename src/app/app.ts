import { Component, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface Stat {
  value: string;
  label: string;
  icon: string;
  target?: number;
  suffix?: string;
  animatedValue?: number;
}

interface NavItem {
  index: string;
  label: string;
  action: () => void;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatDialogModule, RouterOutlet, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, AfterViewInit {
  hasUnreadNotification = true;
  showIdeaBox = false;
  showNotificationIcon = false;
  showToast = false;
  animateToast = false;

  constructor(
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Safe check for global tracking objects in template environment
        if (typeof gtag === 'function') {
          gtag('config', 'G-QYZEE2C6MJ', {
            page_path: event.urlAfterRedirects,
          });
        }
      }
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: Event): void {
    // Changed from KeyboardEvent to Event
    if (this.showIdeaBox) {
      this.closeIdea(event);
    }
  }

  ngOnInit() {
    this.animateStats();
    const isRead = localStorage.getItem('ideaRead');
    this.hasUnreadNotification = isRead !== 'true';

    setTimeout(() => {
      this.showNotificationIcon = true;
    }, 3000);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.showToast = true;
      setTimeout(() => (this.animateToast = true), 900);
      setTimeout(() => this.closeToast(), 4000);
    }, 20000);
  }

  animateStats() {
    this.stats.forEach((stat) => {
      if (!stat.target) return;

      let current = 0;
      const duration = 1200;
      const stepTime = 20;
      const increment = stat.target / (duration / stepTime);

      const interval = setInterval(() => {
        current += increment;

        if (current >= stat.target!) {
          current = stat.target!;
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

  toggleIdeaBox() {
    this.showIdeaBox = !this.showIdeaBox;
  }

  closeIdea(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.showIdeaBox = false;
    this.hasUnreadNotification = false;
    localStorage.setItem('ideaRead', 'true');
  }

  closeToast() {
    this.animateToast = false;
    setTimeout(() => (this.showToast = false), 400);
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

  playFullVideo(): void {
    this.router.navigate(['/intro']);
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

  handleConnectClick(event: MouseEvent): void {
    this.closeIdea(event);
    this.openLinks();
  }

  protected readonly brand = {
    name: 'Shrikant',
    lastName: 'Shinde',
    role: 'Techno-Functional Consultant',
    location: 'India',
    year: '2026',
    brief:
      'I help real estate businesses and property owners build their digital foundations as strong as their physical assets.',
    subbrief:
      'Leveraging modern frameworks to turn Data into Directions and Ideas into User-Interfaces.',
    url: 'https://drive.google.com/file/d/151q0h7N0qlKPVMlSJvYlP9IfpjbZlsWH/view?usp=sharing',
    label: 'Sent Resume Request',
    download: false,
    availableForWork: false,
  };

  protected readonly trustedClients: string[] = [];

  protected readonly stats: Stat[] = [
    {
      value: '1.5B+',
      label: 'Rows Processed',
      icon: 'storage',
      target: 1500000000,
      suffix: 'B+',
    },
    {
      value: '36+',
      label: 'Custom Reports',
      icon: 'code',
      target: 36,
      suffix: '+',
    },
    {
      value: '2+',
      label: 'Yrs Experience',
      icon: 'bar_chart',
      target: 2,
      suffix: '+',
    },
    {
      value: '5+',
      label: 'Happy Client',
      icon: 'groups',
      target: 5,
      suffix: '+',
    },
  ];

  protected readonly navItems: NavItem[] = [
    {
      index: '01',
      label: 'What I’ve Built',
      action: () => this.openProjects(),
    },
    {
      index: '02',
      label: 'Professional Journey',
      action: () => this.openExperience(),
    },
    {
      index: '03',
      label: 'Tech I Work With',
      action: () => this.openEducation(),
    },
  ];
}
