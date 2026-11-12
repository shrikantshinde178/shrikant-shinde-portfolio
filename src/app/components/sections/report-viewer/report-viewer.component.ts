import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

export interface ReportViewerData {
  project: {
    id: string;
    title: string;
    yardiModule?: string;
    reportPages?: string[]; // ordered page images
  };
}

@Component({
  selector: 'app-report-viewer-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule],
  templateUrl: './report-viewer.component.html',
  styleUrls: ['./report-viewer.component.scss'],
})
export class ReportViewerDialogComponent implements AfterViewInit, OnDestroy {
  private dialogRef = inject(MatDialogRef<ReportViewerDialogComponent>);
  readonly data = inject<ReportViewerData>(MAT_DIALOG_DATA);

  readonly project = this.data.project;
  readonly pages: string[] = this.project.reportPages ?? [];

  /** Text repeated diagonally over every page */
  readonly watermarkText = 'Client-owned • Portfolio demo only';
  readonly watermarkTiles = Array.from({ length: 24 });

  readonly minZoom = 50;
  readonly maxZoom = 160;
  zoom = signal<number>(100);
  currentPage = signal<number>(1);

  /** 100% zoom = fit the available width, up to 900px */
  readonly maxPageWidth = 900;
  private containerWidth = signal<number>(320);
  readonly pageWidth = computed(() =>
    Math.round(
      (Math.min(this.maxPageWidth, this.containerWidth()) * this.zoom()) / 100,
    ),
  );
  private resizeObserver?: ResizeObserver;

  private loaded = signal<Set<number>>(new Set());
  private failed = signal<Set<number>>(new Set());

  @ViewChild('scroller') scroller?: ElementRef<HTMLElement>;
  @ViewChildren('pageEl') pageEls?: QueryList<ElementRef<HTMLElement>>;

  ngAfterViewInit(): void {
    const box = this.scroller?.nativeElement;
    if (!box || typeof ResizeObserver === 'undefined') return;
    this.resizeObserver = new ResizeObserver(() => this.measure());
    this.resizeObserver.observe(box);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private measure(): void {
    const box = this.scroller?.nativeElement;
    if (!box) return;
    const cs = getComputedStyle(box);
    const pad =
      (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
    this.containerWidth.set(Math.max(200, box.clientWidth - pad));
  }

  /* ---------- image state ---------- */
  isLoaded(i: number): boolean {
    return this.loaded().has(i);
  }
  isFailed(i: number): boolean {
    return this.failed().has(i);
  }
  onImgLoad(i: number): void {
    this.loaded.update((s) => new Set(s).add(i));
  }
  onImgError(i: number): void {
    this.failed.update((s) => new Set(s).add(i));
  }

  /* ---------- zoom ---------- */
  zoomIn(): void {
    this.zoom.update((z) => Math.min(this.maxZoom, z + 10));
  }
  zoomOut(): void {
    this.zoom.update((z) => Math.max(this.minZoom, z - 10));
  }
  resetZoom(): void {
    this.zoom.set(100);
  }

  /* ---------- current page indicator ---------- */
  onScroll(): void {
    const box = this.scroller?.nativeElement;
    const els = this.pageEls?.toArray();
    if (!box || !els?.length) return;

    const mid = box.getBoundingClientRect().top + box.clientHeight / 2;
    let current = 1;
    els.forEach((el, i) => {
      const r = el.nativeElement.getBoundingClientRect();
      if (r.top <= mid) current = i + 1;
    });
    this.currentPage.set(current);
  }

  close(): void {
    this.dialogRef.close();
  }

  /* ---------- deterrents (view-only preview) ---------- */
  @HostListener('contextmenu', ['$event'])
  blockContextMenu(e: Event): void {
    e.preventDefault();
  }

  @HostListener('dragstart', ['$event'])
  blockDrag(e: Event): void {
    e.preventDefault();
  }

  @HostListener('document:keydown', ['$event'])
  blockShortcuts(e: KeyboardEvent): void {
    const key = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && ['s', 'p', 'u'].includes(key)) {
      e.preventDefault();
    }
  }
}
