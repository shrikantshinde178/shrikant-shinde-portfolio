import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface Stat {
  value: string;
  label: string;
  icon: string;
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
export class App implements OnInit {
  constructor(
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit() {
    const isRead = localStorage.getItem('ideaRead');
    this.hasUnreadNotification = isRead !== 'true';

    setTimeout(() => {
      this.showNotificationIcon = true;
    }, 3000);
  }

  hasUnreadNotification = true;
  showIdeaBox = false;
  showNotificationIcon = false;
  showToast = false;
  animateToast = false;

  toggleIdeaBox() {
    this.showIdeaBox = !this.showIdeaBox;
  }

  closeIdea(event: Event) {
    event.stopPropagation();

    this.showIdeaBox = false;
    this.hasUnreadNotification = false;

    localStorage.setItem('ideaRead', 'true');
  }

  private openDialog(component: any, height: string = '70vh') {
    this.dialog.open(component, this.getDialogConfig(height));
  }

  async openProjects() {
    const { Projects } = await import('./components/projects/projects');
    this.openDialog(Projects);
  }

  async openEducation() {
    const { Education } = await import('./components/education/education');
    this.openDialog(Education);
  }

  async openExperience() {
    const { Experience } = await import('./components/experience/experience');
    this.openDialog(Experience);
  }

  async openLinks() {
    const { SocialLinks } =
      await import('./components/social-links/social-links');
    this.openDialog(SocialLinks, '40vh');
  }
  playFullVideo(): void {
    this.router.navigate(['/intro']);
  }

  private getDialogConfig(height: string = '70vh') {
    const isMobile = window.innerWidth < 768;
    return {
      width: isMobile ? '95vw' : '80vw',
      maxWidth: '1000px',
      height: isMobile ? '90vh' : height,
      panelClass: 'custom-dialog-container',
      backdropClass: 'custom-backdrop',
      autoFocus: false,
    };
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.showToast = true;
      setTimeout(() => (this.animateToast = true), 900);
      setTimeout(() => this.closeToast(), 4000);
    }, 20000);
  }

  closeToast() {
    this.animateToast = false;
    setTimeout(() => (this.showToast = false), 400);
  }

  protected readonly brand = {
    name: 'Shrikant',
    lastName: 'Shinde',
    role: ' Techno-Functional Consultant',
    location: 'India',
    year: '2026',
    brief:
      ' I help real estate businesses and property owners build their digital foundations as strong as their physical assets.',
    subbrief:
      'Leveraging modern frameworks to turn Data into Directions and Ideas into User-Interfaces.',
  };

  protected readonly stats: Stat[] = [
    { value: '1.5B+', label: 'Rows Processed', icon: 'storage' },
    { value: '36+', label: 'Custom Reports', icon: 'code' },
    { value: '2+', label: 'Yrs Experience', icon: 'bar_chart' },
    { value: '5+', label: 'Happy Client', icon: 'groups' },
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
    {
      index: '04',
      label: 'Get in Touch',
      action: () => this.openLinks(),
    },
  ];
}
