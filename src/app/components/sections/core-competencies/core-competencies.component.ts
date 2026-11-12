import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface SkillRow {
  label: string;
  detail: string;
}

export interface SkillColumn {
  id: string;
  title: string;
  icon: string;
  items: SkillRow[];
}

export interface TechRow {
  label: string;
  tags: string[];
}

@Component({
  selector: 'app-core-competencies',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './core-competencies.component.html',
  styleUrls: ['./core-competencies.component.scss'],
})
export class CoreCompetenciesComponent {
  // Notify the parent portfolio component to open Proof of Work.
  @Output() proofOfWorkRequested = new EventEmitter<void>();

  openProofOfWork(): void {
    this.proofOfWorkRequested.emit();
  }

  /** PRIMARY: Yardi expertise */
  readonly yardiColumns: SkillColumn[] = [
    {
      id: 'support',
      title: 'Yardi Voyager',
      icon: 'domain',
      items: [
        {
          label: 'Affordable Housing',
          detail: 'HUD 50059 · Section 8 · LIHTC',
        },
        {
          label: 'Residential Core',
          detail: 'Ledgers · Availability · Move-In/Out',
        },
        {
          label: 'Voyager 7S/8',
          detail: 'Financials · Commercial · Property setup',
        },
        {
          label: 'Procure-to-Pay',
          detail: 'PayScan · CheckScan · AP routing',
        },
        {
          label: 'RentCafe & Elevate',
          detail: 'Leasing portals · Dashboards',
        },
      ],
    },
    {
      id: 'handle',
      title: 'Functional Workflows',
      icon: 'alt_route',
      items: [
        {
          label: 'HUD Compliance',
          detail: '90/60/30-day recerts · Vouchers',
        },
        {
          label: 'Residential Leases',
          detail: 'Deposits · CheckScan batches · Rent roll',
        },
        {
          label: 'P2P Automation',
          detail: 'Invoice approvals · Duplicate AP checks',
        },
        {
          label: 'Month-End Close',
          detail: 'GL postings · Sub-ledger balancing',
        },
        {
          label: 'Reporting',
          detail: 'Custom columnar · YSR exports',
        },
      ],
    },
  ];

  /** SECONDARY: technical edge */
  readonly techRows: TechRow[] = [
    {
      label: 'Database',
      tags: [
        'MSSQL',
        'T-SQL',
        'Stored Procedures',
        'Query Tuning',
        'Indexing',
        'ETL & MERGE pipelines',
      ],
    },
    {
      label: 'Applications',
      tags: [
        'Angular',
        'TypeScript',
        'Spring Boot',
        'Java 8',
        'Python',
        'Node.js',
        'REST APIs',
      ],
    },
  ];
}
