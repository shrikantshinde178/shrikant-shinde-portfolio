import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-skills-matrix',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <section class="skills-view">
      <div class="section-heading">
        <h2>Technical Capabilities & Module Matrix</h2>
        <p>
          Specialized enterprise real estate ERP architectures and database
          engineering competencies.
        </p>
      </div>

      <div class="skills-grid">
        <div class="skill-category-card">
          <div class="category-title">
            <mat-icon>domain</mat-icon> Yardi ERP Modules
          </div>
          <ul class="skills-bullet-list">
            <li>
              <strong>Affordable Housing:</strong> HUD 50059, LIHTC & TIC
              Certification
            </li>
            <li>
              <strong>Residential Core:</strong> Resident Ledgers, Leases & Unit
              Availability Matrix
            </li>
            <li>
              <strong>Yardi Voyager:</strong> Core 7S & Voyager 8 Architectures
            </li>
            <li>
              <strong>Procure-to-Pay (P2P):</strong> PayScan, Purchase Orders &
              AP Approvals
            </li>
            <li>
              <strong>RentCafe & CheckScan:</strong> Online Applicant Ingestion
              & Payment Batches
            </li>
            <li>
              <strong>Elevate:</strong> Cloud Analytics & Performance Dashboards
            </li>
          </ul>
        </div>

        <div class="skill-category-card">
          <div class="category-title">
            <mat-icon>terminal</mat-icon> Database & ETL Engineering
          </div>
          <ul class="skills-bullet-list">
            <li>
              <strong>RDBMS:</strong> Microsoft SQL Server (MSSQL), T-SQL
              Scripting
            </li>
            <li>
              <strong>Performance Tuning:</strong> Execution Plans, Index Tuning
              & CTEs
            </li>
            <li>
              <strong>ETL & Data Pipelines:</strong> Staging Tables, MERGE Logic
              & Batch Jobs
            </li>
            <li>
              <strong>Reporting:</strong> Custom YSR (Yardi Spreadsheet
              Reports), Columnar
            </li>
            <li>
              <strong>Data Integrity:</strong> ACID Transactions, Audits &
              Reconciliation
            </li>
          </ul>
        </div>

        <div class="skill-category-card">
          <div class="category-title">
            <mat-icon>layers</mat-icon> Web & Integration Stack
          </div>
          <ul class="skills-bullet-list">
            <li>
              <strong>Frontend:</strong> Angular, TypeScript, HTML5, SCSS,
              Material UI
            </li>
            <li><strong>Backend:</strong> Node.js, Express, REST APIs</li>
            <li><strong>Version Control:</strong> Git, GitHub, GitLab</li>
            <li>
              <strong>Standards:</strong> SOC 2, SOX Section 404, GDPR Awareness
            </li>
          </ul>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./skills-matrix.component.scss'],
})
export class SkillsMatrixComponent {}
