import { Component, signal, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CoreCompetenciesComponent } from '../sections/core-competencies/core-competencies.component';
import { FullstackAppsComponent } from '../sections/fullstack-apps/fullstack-apps.component';
import { SkillsMatrixComponent } from '../sections/skills-matrix/skills-matrix.component';
import { TechnicalArticlesComponent } from '../sections/technical-articles/technical-articles.component';

export type SectionType = 'work' | 'fullstack' | 'skills' | 'blogs';

export interface MarqueeItem {
  name: string;
  category: string;
  logoUrl?: string;
  icon?: string;
}

@Component({
  selector: 'app-portfolio-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    CoreCompetenciesComponent,
    FullstackAppsComponent,
    SkillsMatrixComponent,
    TechnicalArticlesComponent,
  ],
  templateUrl: './portfolio-switcher.component.html',
  styleUrls: ['./portfolio-switcher.component.scss'],
})
export class PortfolioSwitcherComponent implements OnInit {
  activeSection = signal<SectionType | null>(null);
  showVideoModal = signal<boolean>(false);
  showGlobalContractNotice = signal<boolean>(false);

  contactEmail = 'contact@realprop.solutions';
  currentYear = new Date().getFullYear();

  // Trusted Portfolios with Real Estate Logos / Avatars
  clientPartners: MarqueeItem[] = [
    {
      name: 'Apex Property Management',
      category: 'Affordable Housing (HUD)',
      logoUrl: 'images/real-estate-logo/yardi voyager 7.png',
      icon: 'apartment',
    },
    {
      name: 'Redwood Residential',
      category: 'Multi-Family Residential',
      logoUrl: 'images/real-estate-logo/Rent cafe.png',
      icon: 'domain',
    },
    {
      name: 'Beacon Capital Real Estate',
      category: 'Procure-to-Pay (PayScan)',
      logoUrl: 'images/real-estate-logo/yardi p2p.png',
      icon: 'receipt_long',
    },
    {
      name: 'Vanguard Asset Partners',
      category: 'MSSQL Architecture',
      logoUrl: 'images/real-estate-logo/yardi voyager 7.png',
      icon: 'account_balance',
    },
  ];

  // Core Tech & Yardi Modules with Logos / Icons
  techStackItems: MarqueeItem[] = [
    {
      name: 'Yardi Voyager 7S / 8',
      category: 'Financial Core & Affordable',
      logoUrl: 'images/real-estate-logo/yardi voyager 7.png',
      icon: 'domain',
    },
    {
      name: 'Microsoft SQL Server',
      category: 'T-SQL, CTEs & SPs',
      logoUrl: 'images/real-estate-logo/yardi p2p.png',
      icon: 'database',
    },
    {
      name: 'Custom YSR Reporting',
      category: 'Financial Statement Exports',
      icon: 'analytics',
    },
    {
      name: 'PayScan & CheckScan',
      category: 'Procure-to-Pay Automation',
      logoUrl: 'images/real-estate-logo/yardi p2p.png',
      icon: 'payments',
    },
    {
      name: 'ETL Pipelines',
      category: 'OneSite / RealPage Migrations',
      icon: 'sync_alt',
    },
    {
      name: 'RentCafe & Elevate',
      category: 'Leasing & Resident Portals',
      logoUrl: 'images/real-estate-logo/Rent cafe.png',
      icon: 'devices',
    },
    {
      name: 'Angular & TypeScript',
      category: 'Enterprise UI Dashboards',
      icon: 'code',
    },
    {
      name: 'RESTful Integrations',
      category: 'API Data Synchronization',
      icon: 'hub',
    },
  ];

  sectionTitles: Record<SectionType, { title: string; subtitle: string }> = {
    work: {
      title: 'Core Practice & Expertise',
      subtitle:
        'Enterprise Yardi Voyager, Affordable Compliance & P2P Workflows',
    },
    fullstack: {
      title: 'Systems, Databases & Projects',
      subtitle:
        'Bespoke reporting scripts, ETL migrations and real estate tools',
    },
    skills: {
      title: 'Technical Matrix & Competencies',
      subtitle: 'SQL Server performance tuning, data models & modern frontend',
    },
    blogs: {
      title: 'Articles & Industry Deep-Dives',
      subtitle:
        'Architectural perspectives on enterprise real estate technology',
    },
  };

  ngOnInit(): void {
    const isDismissed = localStorage.getItem(
      'global_contract_notice_dismissed',
    );
    if (!isDismissed) {
      setTimeout(() => {
        this.showGlobalContractNotice.set(true);
      }, 800);
    }
  }

  dismissNotice(): void {
    this.showGlobalContractNotice.set(false);
    localStorage.setItem('global_contract_notice_dismissed', 'true');
  }

  openSection(section: SectionType): void {
    this.activeSection.set(section);
  }

  closeSection(): void {
    this.activeSection.set(null);
  }

  toggleVideoModal(state: boolean): void {
    this.showVideoModal.set(state);
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.showVideoModal()) {
      this.toggleVideoModal(false);
    } else if (this.activeSection()) {
      this.closeSection();
    } else if (this.showGlobalContractNotice()) {
      this.dismissNotice();
    }
  }
}
