import {
  Component,
  computed,
  signal,
  inject,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReportViewerDialogComponent } from '../report-viewer/report-viewer.component';

export interface FullStackProject {
  id: string;
  title: string;
  categoryTag: 'Yardi related' | 'Web applications' | 'Database' | string;
  description: string;
  stack?: string[];
  yardiModule?: string;
  databaseEngine?: string;
  liveDemoUrl?: string;
  githubUrl?: string;
  reportPages?: string[];
  logoUrl?: string;
  imageUrl?: string;
  reportPdf?: string[];
}

@Component({
  selector: 'app-fullstack-apps',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './fullstack-apps.component.html',
  styleUrls: ['./fullstack-apps.component.scss'],
})
export class FullstackAppsComponent {
  private dialog = inject(MatDialog);

  fullstackSearch = signal<string>('');
  fullstackTagFilter = signal<string>('All');
  fullstackCurrentPage = signal<number>(1);

  readonly pageSize = 6;

  externalTarget = signal<FullStackProject | null>(null);

  @ViewChild('searchInput')
  searchInput?: ElementRef<HTMLInputElement>;

  @HostListener('document:keydown', ['$event'])
  onGlobalKey(e: KeyboardEvent): void {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;

    const t = e.target as HTMLElement;

    const typing =
      ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName) ||
      t.isContentEditable;

    if (typing) return;

    const input = this.searchInput?.nativeElement;

    if (input) {
      e.preventDefault();
      input.focus();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.externalTarget()) {
      this.closeExternal();
    }
  }

  readonly fullstackCategories: string[] = [
    'All',
    'Yardi related',
    'Web applications',
    'Database',
  ];

  readonly fullstackProjects: FullStackProject[] = [
    {
      id: 'medi-remind',
      title: 'Medi Remind',
      categoryTag: 'Web applications',
      description:
        'Responsive real estate management interface featuring tenant service request dispatching.',
      stack: ['Angular', 'TypeScript', 'Material UI', 'REST APIs', 'SCSS'],
      logoUrl: 'images/real-estate-logo/Rent cafe.png',
      imageUrl: 'images/world.webp',
      liveDemoUrl: '#',
      githubUrl: '#',
    },
    {
      id: 'hud-cert-tracker',
      title: 'HUD 50059 Recertification Alert Portal',
      categoryTag: 'Yardi related',
      description: '',
      yardiModule: 'HUD 50059 • Affordable Housing',
      reportPdf: [
        'yardi-reports/hud-page-1.png',
        'yardi-reports/hud-page-2.png',
      ],
    },
    {
      id: 'invoice-reconciler',
      title: 'PayScan AP Batch Reconciler & Ingestion Utility',
      categoryTag: 'Yardi related',
      description: '',
      yardiModule: 'PayScan • AP Batches',
      reportPdf: [
        'yardi-reports/payscan-page-1.png',
        'yardi-reports/payscan-page-2.png',
        'yardi-reports/payscan-page-3.png',
      ],
    },
    {
      id: 'rentroll-aggregator',
      title: 'Multi-Entity Ledger & Rent Roll Aggregator',
      categoryTag: 'Database',
      description:
        'High-throughput microservice syncing daily resident ledger charges, payments, and CheckScan batches into standardized JSON data feeds.',
      databaseEngine: 'MSSQL Server • T-SQL • Stored Procedures',
      liveDemoUrl: '#',
      githubUrl: '#',
      imageUrl: 'images/db projects/database proj2.jpeg',
    },
    {
      id: 'peervista',
      title: 'PeerVista',
      categoryTag: 'Web applications',
      description:
        'Responsive real estate management interface featuring tenant service request dispatching.',
      stack: ['Angular', 'TypeScript', 'Material UI', 'REST APIs', 'SCSS'],
      logoUrl: 'images/real-estate-logo/Rent cafe.png',
      imageUrl: 'images/City.png',
      liveDemoUrl: '#',
      githubUrl: '#',
    },
    {
      id: 'peervista-2',
      title: 'PeerVista',
      categoryTag: 'Web applications',
      description:
        'Responsive real estate management interface featuring tenant service request dispatching.',
      stack: ['Angular', 'TypeScript', 'Material UI', 'REST APIs', 'SCSS'],
      logoUrl: 'images/real-estate-logo/Rent cafe.png',
      imageUrl: 'images/City.png',
      liveDemoUrl: '#',
      githubUrl: '#',
    },
    {
      id: 'peervista-3',
      title: 'PeerVista',
      categoryTag: 'Web applications',
      description:
        'Responsive real estate management interface featuring tenant service request dispatching.',
      stack: ['Angular', 'TypeScript', 'Material UI', 'REST APIs', 'SCSS'],
      logoUrl: 'images/real-estate-logo/Rent cafe.png',
      imageUrl: 'images/City.png',
      liveDemoUrl: '#',
      githubUrl: '#',
    },
    {
      id: 'peervista-4',
      title: 'PeerVista',
      categoryTag: 'Web applications',
      description:
        'Responsive real estate management interface featuring tenant service request dispatching.',
      stack: ['Angular', 'TypeScript', 'Material UI', 'REST APIs', 'SCSS'],
      logoUrl: 'images/real-estate-logo/Rent cafe.png',
      imageUrl: 'images/City.png',
      liveDemoUrl: '#',
      githubUrl: '#',
    },

    {
      id: 'custom-financials',
      title: 'Quarterly Custom Financials & General Ledger',
      categoryTag: 'Yardi related',
      description: '',
      yardiModule: 'YSR Custom Financials • YSQL',
      reportPages: [
        'yardi-reports/Quarterly-Custom-Financials/page-0001.jpg',
        'yardi-reports/Quarterly-Custom-Financials/page-0002.jpg',
        'yardi-reports/Quarterly-Custom-Financials/page-0003.jpg',
        'yardi-reports/Quarterly-Custom-Financials/page-0004.jpg',
        'yardi-reports/Quarterly-Custom-Financials/page-0005.jpg',
        'yardi-reports/Quarterly-Custom-Financials/page-0006.jpg',
        'yardi-reports/Quarterly-Custom-Financials/page-0007.jpg',
        'yardi-reports/Quarterly-Custom-Financials/page-0008.jpg',
        'yardi-reports/Quarterly-Custom-Financials/page-0009.jpg',
      ],
    },
    {
      id: 'rentroll-aggregator',
      title: 'Multi-Entity Ledger & Rent Roll Aggregator',
      categoryTag: 'Database',
      description:
        'High-throughput microservice syncing daily resident ledger charges, payments, and CheckScan batches into standardized JSON data feeds.',
      databaseEngine: 'MSSQL Server • T-SQL • Stored Procedures',
      liveDemoUrl: '#',
      githubUrl: '#',
      imageUrl: 'images/db projects/database proj1.jpeg',
    },
  ];

  private readonly categoryMeta: Record<
    string,
    { tone: string; icon: string; kicker: string }
  > = {
    All: { tone: 'slate', icon: 'apps', kicker: 'PROJECT' },
    'Yardi related': { tone: 'cobalt', icon: 'business', kicker: 'YSR' },
    'Web applications': {
      tone: 'emerald',
      icon: 'language',
      kicker: 'WEB APP',
    },
    Database: { tone: 'amber', icon: 'storage', kicker: 'DATABASE' },
  };

  filteredFullstack = computed(() => {
    const q = this.fullstackSearch().toLowerCase().trim();
    const tag = this.fullstackTagFilter();

    return this.fullstackProjects.filter((app) => {
      const matchesTag = tag === 'All' || app.categoryTag === tag;

      const matchesSearch =
        !q ||
        app.title.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        (app.stack && app.stack.some((s) => s.toLowerCase().includes(q))) ||
        (app.yardiModule && app.yardiModule.toLowerCase().includes(q)) ||
        (app.databaseEngine && app.databaseEngine.toLowerCase().includes(q));

      return matchesTag && matchesSearch;
    });
  });

  paginatedFullstack = computed(() => {
    const list = this.filteredFullstack();
    const page = this.fullstackCurrentPage();
    const start = (page - 1) * this.pageSize;

    return list.slice(start, start + this.pageSize);
  });

  totalFullstackPages = computed(() => {
    return Math.ceil(this.filteredFullstack().length / this.pageSize) || 1;
  });

  setFullstackTag(tag: string): void {
    this.fullstackTagFilter.set(tag);
    this.fullstackCurrentPage.set(1);
  }

  changeFullstackPage(delta: number): void {
    const nextPage = this.fullstackCurrentPage() + delta;

    if (nextPage >= 1 && nextPage <= this.totalFullstackPages()) {
      this.fullstackCurrentPage.set(nextPage);
    }
  }

  openReport(project: FullStackProject): void {
    this.dialog.open(ReportViewerDialogComponent, {
      width: '90vw',
      maxWidth: '1200px',
      height: '85vh',
      hasBackdrop: true,
      panelClass: 'report-viewer-dialog-panel',
      backdropClass: 'report-viewer-backdrop',
      data: { project },
    });
  }

  openExternal(project: FullStackProject): void {
    if (project.liveDemoUrl) {
      this.externalTarget.set(project);
    }
  }

  closeExternal(): void {
    this.externalTarget.set(null);
  }

  externalHost(url?: string): string {
    try {
      return new URL(url ?? '').host;
    } catch {
      return '';
    }
  }

  /* ---------- Template helpers ---------- */

  toneOf(tag: string): string {
    return this.categoryMeta[tag]?.tone ?? 'slate';
  }

  iconOf(tag: string): string {
    return this.categoryMeta[tag]?.icon ?? 'folder';
  }

  kickerOf(tag: string): string {
    return this.categoryMeta[tag]?.kicker ?? tag.toUpperCase();
  }

  categoryCount(tag: string): number {
    return tag === 'All'
      ? this.fullstackProjects.length
      : this.fullstackProjects.filter((p) => p.categoryTag === tag).length;
  }

  pageCount(project: FullStackProject): number {
    return (project.reportPages ?? project.reportPdf ?? []).length;
  }

  initialsOf(title: string): string {
    return title
      .split(/\s+/)
      .filter((w) => /^[A-Za-z0-9]/.test(w))
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');
  }

  splitBadge(value: string): string[] {
    return value
      .split('•')
      .map((s) => s.trim())
      .filter(Boolean);
  }
}
