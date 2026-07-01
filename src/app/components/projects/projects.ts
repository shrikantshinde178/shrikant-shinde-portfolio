import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';

export interface Project {
  title: string;
  description: string;
  category: 'Yardi' | 'Web';
  image?: string;
  tech?: string[];
  fileType?: 'pdf' | 'excel' | 'csv';
  reportType?: 'YSR' | 'Columnar' | 'Matrix' | 'Script' | 'Custom';
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
  constructor(public dialogRef: MatDialogRef<Project>) {}
  selectedProject: Project | null = null;
  activeTab: string = 'All';
  searchQuery: string = '';

  zoom = 1;
  zoomLevel = 100;
  visiblePages: string[] = [];
  pageBatchSize = 3;

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
      tech: ['Angular', 'Java', 'RestAPI', 'Auth 0.2'],
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
      tech: ['JavaScript', 'React', 'AWS', 'S3'],
      sourceCode: 'https://github.com/shrikantshinde178/React-to-S3-Bucket',
      url: 'https://demo.com',
      details: {
        overview:
          'A React application that allows direct image uploads to Amazon S3 via AWS Lambda, streamlining file storage and enhancing cloud management efficiency.',
        techtype: 'Cloud Storage & File Management',
      },
    },
    {
      title: 'Weekly Matrix Report',
      description: 'Custom Yardi SQL report.',
      category: 'Yardi',
      fileType: 'pdf',
      reportType: 'YSR',
      pages: this.generatePages('weekly-matrix', 4),
    },
    {
      title: 'Custom Financial Quarterly Budget',
      description: 'Custom Yardi SQL report.',
      category: 'Yardi',
      fileType: 'pdf',
      reportType: 'YSR',
      pages: this.generatePages('Quarterly-Custom-Financials', 9),
    },
    {
      title: 'Quaterly RentRoll Summary Report',
      description: 'Custom Yardi SQL report.',
      category: 'Yardi',
      fileType: 'excel',
      reportType: 'YSR',
      pages: this.generatePages('role-contacts', 7),
    },
    {
      title: 'Residential Stacking Plan',
      description:
        'Custom Yardi React app for direct image uploads to S3 using Lambda.',
      category: 'Yardi',
      fileType: 'csv',
      reportType: 'Columnar',
      pages: this.generatePages('residential-stacking', 3),
    },
    {
      title: 'Accommodation Inspection Report',
      description:
        'Custom Yardi React app for direct image uploads to S3 using Lambda.',
      category: 'Yardi',
      fileType: 'csv',
      reportType: 'YSR',
      pages: this.generatePages('accommodation-inspection', 5),
    },
    {
      title: 'Rogers Move In-Out Activity',
      description: 'Custom Yardi SQL report.',
      category: 'Yardi',
      fileType: 'excel',
      reportType: 'Columnar',
      pages: this.generatePages('rogers-activity', 4),
    },
  ];

  generatePages(folder: string, totalPages: number): string[] {
    const pages: string[] = [];
    for (let i = 1; i <= totalPages; i++) {
      const num = i.toString().padStart(4, '0');
      pages.push(`assets/yardi-reports/${folder}/page-${num}.jpg`);
    }
    return pages;
  }

  /* ================= MASTER ENGINE PARSER INDEX ================= */
  get filteredProjects() {
    const query = (this.searchQuery || '').toLowerCase().trim();

    if (query !== '') {
      return this.allProjects.filter((project) => {
        const title = (project.title || '').toLowerCase();
        const description = (project.description || '').toLowerCase();
        const category = (project.category || '').toLowerCase();
        const fileType = (project.fileType || '').toLowerCase();
        const overview = (project.details?.overview || '').toLowerCase();
        const techtype = (project.details?.techtype || '').toLowerCase();
        const reportType = (project.reportType || '').toLowerCase();

        const textMatch =
          title.includes(query) ||
          description.includes(query) ||
          category.includes(query) ||
          fileType.includes(query) ||
          overview.includes(query) ||
          reportType.includes(query) ||
          techtype.includes(query);

        const techMatch =
          Array.isArray(project.tech) &&
          project.tech.some((t) => (t || '').toLowerCase().includes(query));

        return textMatch || techMatch;
      });
    }

    if (this.activeTab !== 'All') {
      return this.allProjects.filter((p) => p.category === this.activeTab);
    }

    return this.allProjects;
  }

  getSearchResultsByCategory(category: 'Yardi' | 'Web'): Project[] {
    return this.filteredProjects.filter(
      (project) => project.category === category,
    );
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.searchQuery = '';
  }

  handleProjectClick(project: Project) {
    this.selectedProject = project;
    if (project.category === 'Yardi') {
      this.zoom = 1;
      this.zoomLevel = 100;
      this.visiblePages = project.pages?.slice(0, this.pageBatchSize) || [];
    } else {
      this.visiblePages = [];
    }
  }

  openWebLauncher(event: Event, project: Project) {
    event.stopPropagation();
    event.preventDefault();
    this.selectedProject = project;
    this.visiblePages = [];
  }

  redirectToLiveUrl(url?: string) {
    if (url) {
      window.open(url, '_blank');
    }
    this.close();
  }

  close() {
    this.selectedProject = null;
    this.visiblePages = [];
  }

  onScroll(event: any) {
    const element = event.target;
    const atBottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 100;
    if (atBottom && this.selectedProject?.category === 'Yardi') {
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
      }
    }
  }

  getFileIcon(type?: string): string {
    switch (type) {
      case 'pdf':
        return 'fas fa-file-pdf';
      case 'excel':
        return 'fas fa-file-excel';
      case 'csv':
        return 'fas fa-file-csv';
      default:
        // Fallback icon for Web projects
        return 'fas fa-globe'; // baseline choice: globe icon. (Or use 'fas fa-code' for brackets)
    }
  }
}
