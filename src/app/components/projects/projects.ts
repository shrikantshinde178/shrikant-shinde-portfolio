import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { VisitConfirm } from '../popups/visit-confirm/visit-confirm';

export interface Project {
  title: string;
  description: string;
  category: 'Yardi' | 'Web';
  image?: string;
  tech?: string[];
  fileType?: 'pdf' | 'excel' | 'csv';
  sourceCode?: string;
  url?: string;
  pages?: string[];
  details?: {
    overview: string;
    techtype?: string;
  };
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    ScrollingModule,
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  constructor(private dialog: MatDialog) {}
  selectedProject: Project | null = null;
  activeTab: string = 'All';

  zoom = 1;
  zoomLevel = 100;
  visiblePages: string[] = [];
  pageBatchSize = 3;

  /* ================= PROJECT DATA ================= */
  allProjects: Project[] = [
    {
      title: 'Medi Remind',
      description:
        'Patients-Caregiver connectivity and emergency assistance system.',
      category: 'Web',
      image: 'assets/images/City Night View.webp',
      tech: ['Angular', 'Flask', 'Python'],
      sourceCode: 'https://github.com/shrikantshinde178/MediRemind',
      url: 'https://demo.com',

      details: {
        overview:
          'A platform that keeps patients connected with caregivers, providing real-time notifications and emergency alerts for improved safety and health management.',
        techtype: 'Notification & Alert System',
      },
    },
    {
      title: 'Peer Vista',
      description: 'Peer-to-Peer insurance lending and borrowing Platform.',
      category: 'Web',
      image: 'assets/images/New Design.webp',
      tech: ['Angular', 'Java 8', 'SpringBoot', 'RestAPI', 'Auth 0.2', 'SQL'],
      sourceCode: 'https://github.com/shrikantshinde178/Peervista-Sprint-2',
      url: 'https://demo.com',
      details: {
        overview:
          'A peer-to-peer insurance platform that monitors endpoint activity in real-time, alerts for potential threats, and helps users manage lending and borrowing securely.',
        techtype: 'Web Security & Insurance Platform',
      },
    },
    {
      title: 'Amazon S3 Bucket',
      description: 'React app for direct image uploads to S3 using Lambda.',
      category: 'Web',
      image: 'assets/images/world.webp',
      tech: ['JavaScript'],
      sourceCode: 'https://github.com/shrikantshinde178/React-to-S3-Bucket',
      url: 'https://demo.com',

      details: {
        overview:
          'A React application that allows direct image uploads to Amazon S3 via AWS Lambda, streamlining file storage and enhancing cloud management efficiency.',
        techtype: 'Cloud Storage & File Management',
      },
    },

    /* ===== YARDI PROJECTS ===== */

    {
      title: 'Weekly Matrix Report',
      description: 'Custom Yardi SQL report.',
      category: 'Yardi',
      fileType: 'pdf',
      pages: this.generatePages('weekly-matrix', 0),
    },
    {
      title: 'Custom Financial Quarterly Budget',
      description: 'Custom Yardi SQL report.',
      category: 'Yardi',
      fileType: 'pdf',
      pages: this.generatePages('Quarterly-Custom-Financials', 9),
    },
    {
      title: 'Quaterly RentRoll Summary Report',
      description: 'Custom Yardi SQL report.',
      category: 'Yardi',
      fileType: 'excel',
      pages: this.generatePages('role-contacts', 7),
    },
    {
      title: 'Residential Stacking Plan',
      description:
        'Custom Yardi React app for direct image uploads to S3 using Lambda.',
      category: 'Yardi',
      fileType: 'csv',
      pages: this.generatePages('', 0),
    },
    {
      title: 'Accommodation Inspection Report',
      description:
        'Custom Yardi React app for direct image uploads to S3 using Lambda.',
      category: 'Yardi',
      fileType: 'csv',
      pages: this.generatePages('', 0),
    },
    {
      title: 'Rogers Move In-Out Activity',
      description: 'Custom Yardi SQL report.',
      category: 'Yardi',
      fileType: 'excel',
      pages: this.generatePages('', 0),
    },
  ];

  /* ================= HELPERS ================= */

  generatePages(folder: string, totalPages: number): string[] {
    const pages: string[] = [];

    for (let i = 1; i <= totalPages; i++) {
      const num = i.toString().padStart(4, '0');
      pages.push(`assets/yardi-reports/${folder}/page-${num}.jpg`);
    }

    return pages;
  }

  /* ================= FILTER ================= */

  get filteredProjects() {
    return this.activeTab === 'All'
      ? this.allProjects
      : this.allProjects.filter((p) => p.category === this.activeTab);
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  /* ================= VIEW ================= */

  view(project: Project) {
    this.selectedProject = project;
    this.zoom = 1;
    this.zoomLevel = 100;

    this.visiblePages = project.pages?.slice(0, this.pageBatchSize) || [];
  }

  close() {
    this.selectedProject = null;
  }

  onScroll(event: any) {
    const element = event.target;

    const atBottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 100;

    if (atBottom) {
      this.loadMorePages();
    }
  }

  loadMorePages() {
    if (!this.selectedProject?.pages) return;

    const currentLength = this.visiblePages.length;

    const nextBatch = this.selectedProject.pages.slice(
      currentLength,
      currentLength + this.pageBatchSize,
    );

    this.visiblePages = [...this.visiblePages, ...nextBatch];
  }
  /* ================= ZOOM ================= */
  showVisitPopup = false;
  pendingUrl: string | null = null;

  confirmVisit(project: Project) {
    this.dialog.open(VisitConfirm, {
      data: project,
      width: '500px',
      panelClass: 'custom-dialog-container',
      backdropClass: 'custom-backdrop',
    });
  }

  openWebProject(project: Project) {
    this.dialog.open(VisitConfirm, {
      data: project,
      width: '500px',
      panelClass: 'custom-dialog-container',
      backdropClass: 'custom-backdrop',
    });
  }

  cancelVisit() {
    this.showVisitPopup = false;
    this.pendingUrl = null;
  }

  proceedVisit() {
    if (this.pendingUrl) {
      window.open(this.pendingUrl, '_blank');
    }
    this.cancelVisit();
  }
  zoomIn() {
    this.zoom += 0.1;
    this.zoomLevel = Math.round(this.zoom * 100);
  }

  zoomOut() {
    if (this.zoom > 0.5) {
      this.zoom -= 0.1;
      this.zoomLevel = Math.round(this.zoom * 100);
    }
  }

  /* ================= SECURITY ================= */

  @HostListener('window:contextmenu', ['$event'])
  disableRightClick(event: MouseEvent) {
    if (this.selectedProject?.category === 'Yardi') {
      event.preventDefault();
    }
  }

  @HostListener('dragstart', ['$event'])
  disableDrag(event: DragEvent) {
    if (this.selectedProject?.category === 'Yardi') {
      event.preventDefault();
    }
  }

  @HostListener('window:keydown', ['$event'])
  disableKeys(event: KeyboardEvent) {
    if (this.selectedProject?.category === 'Yardi') {
      const isCtrl = event.ctrlKey || event.metaKey;

      if (isCtrl && (event.key === 's' || event.key === 'p')) {
        event.preventDefault();
        alert('Confidential: Download and print disabled.');
      }
    }
  }

  /* ================= ICON ================= */

  getFileIcon(type?: string): string {
    switch (type) {
      case 'pdf':
        return 'fas fa-file-pdf icon-pdf';
      case 'excel':
        return 'fas fa-file-excel icon-excel';
      case 'csv':
        return 'fas fa-file-csv icon-csv';
      default:
        return 'fas fa-file-alt';
    }
  }
}
