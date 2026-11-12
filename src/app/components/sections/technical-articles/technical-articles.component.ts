import {
  Component,
  computed,
  inject,
  signal,
  ViewChild,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

import { ArticleBlock, SortKey, TechnicalArticle } from './article.model';
import { ArticleBodyComponent } from './article-body/article-body.component';

/* Re-exported so any file that imported these types from this component keeps working */
export type { ArticleSource, SortKey, TechnicalArticle } from './article.model';

@Component({
  selector: 'app-technical-articles',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, ArticleBodyComponent],
  templateUrl: './technical-articles.component.html',
  styleUrls: ['./technical-articles.component.scss'],
})
export class TechnicalArticlesComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  @Output() portfolioHomeRequested = new EventEmitter<void>();
  portfolioNavigationLoading = signal(false);

  readonly pageSize = 8; // 2 columns x 4 rows
  articlesSearch = signal('');
  articlesTagFilter = signal('All'); // default; '' (blank) also means no filter
  articlesSort = signal<SortKey>('newest'); // default; '' (blank) also means newest
  articlesCurrentPage = signal(1);
  shareOpen = signal(false);
  copied = signal(false);

  /* The URL is the source of truth: ?article=<slug> makes every article linkable */
  private slugParam = toSignal(
    this.route.queryParamMap.pipe(map((p) => p.get('article'))),
    { initialValue: null as string | null },
  );
  /* True when the visitor landed directly on an article URL (shared link).
    Read once at load, so in-site navigation never triggers it. */
  readonly arrivedViaLink = signal(
    !!this.route.snapshot.queryParamMap.get('article'),
  );
  ctaDismissed = signal(false);

  showTopBanner = computed(() => this.arrivedViaLink() && !this.ctaDismissed());

  selectedArticle = computed(() => {
    const slug = this.slugParam();
    const found = slug
      ? this.technicalArticles.find((a) => a.slug === slug)
      : null;
    // external articles never open inline
    return found && found.source === 'native' ? found : null;
  });

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  @HostListener('document:keydown', ['$event'])
  onGlobalKey(e: KeyboardEvent): void {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target as HTMLElement;
    if (
      ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName) ||
      t.isContentEditable
    )
      return;
    const input = this.searchInput?.nativeElement;
    if (input) {
      e.preventDefault();
      input.focus();
    }
  }

  readonly articleCategories = [
    'All',
    'Yardi PayScan',
    'MSSQL Tuning',
    'Custom YSR',
    'Compliance',
  ];

  readonly sortOptions: { value: SortKey; label: string }[] = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'title', label: 'Title A–Z' },
  ];

  /* Keep newest first. With 20+ items, move this array to /assets/articles.json
      and load it with HttpClient so adding an article never touches component code.
      NOTE: every article needs a unique `id` and a unique `slug`.

      Content: use `blocks` for rich articles (images, gallery, video, audio, code...)
      or the old `content: string[]` for plain text. If both exist, `blocks` wins. */
  readonly technicalArticles: TechnicalArticle[] = [
    {
      id: 'art-payscan',
      slug: 'eliminating-ap-duplicates-payscan',
      title:
        'Eliminating AP Duplicates in High-Volume Yardi PayScan Deployments',
      readTime: '12 min read',
      date: 'Aug 2026',
      categoryTag: 'Yardi PayScan',
      tags: ['PayScan', 'Indexing'],
      imageUrl: '/images/City Night View 2.webp',
      source: 'native',
      summary:
        'Indexing strategies for INVDET tables that prevent vendor double payments during peak month-end cycles.',
      /* LAYOUT 1: MEDIA-RICH FEATURE
          banner, labels, stats, split, steps, mosaic gallery, YouTube, audio, quote */
      blocks: [
        {
          type: 'banner',
          label: 'Case study',
          title: 'Zero duplicate payments across 5,000+ units',
          subtitle:
            'How indexing and staging pre-validation fixed month-end double payments.',
          img: {
            src: '/images/City Night View 2.webp',
            w: 1600,
            h: 686,
            alt: 'City skyline at night',
          },
        },
        {
          type: 'labels',
          items: [
            'Yardi PayScan',
            'SQL Server',
            'Indexing',
            'Accounts Payable',
          ],
        },
        {
          type: 'p',
          text: 'Duplicate invoice entry remains one of the costliest pain points in decentralized property management setups. In high-volume PayScan workflows, concurrent OCR batch ingestion frequently encounters race conditions where identical vendor invoice numbers bypass standard front-end validation checks.',
        },
        {
          type: 'stats',
          items: [
            { value: '78%', label: 'lower invoice lock time' },
            { value: '0', label: 'duplicate payments after rollout' },
            { value: '5,200', label: 'units on the pilot portfolio' },
            { value: '3 wks', label: 'from analysis to production' },
          ],
        },
        { type: 'h2', text: 'Where the duplicates came from' },
        {
          type: 'split',
          title: 'Race conditions at ingestion',
          text: 'Two OCR batches carrying the same vendor invoice number could reach INVDET within milliseconds of each other. Each passed the existing check because neither had committed yet.',
          img: {
            src: '/images/world.webp',
            w: 1200,
            h: 800,
            alt: 'Diagram placeholder: two concurrent batches',
          },
        },
        {
          type: 'split',
          flip: true,
          title: 'Month-end makes it worse',
          text: 'Close week multiplies the volume. Lock escalation on INVDET and TRANS stretched every insert, which widened the window in which a second copy could slip through.',
          img: {
            src: '/images/City.png',
            w: 1200,
            h: 800,
            alt: 'Chart placeholder: month-end volume',
          },
        },
        {
          type: 'quote',
          text: 'We never found a bad invoice. We found two good ones arriving at the same time.',
          by: 'AP lead, pilot portfolio',
        },
        { type: 'h2', text: 'The fix, step by step' },
        {
          type: 'steps',
          items: [
            {
              title: 'Capture the execution plans',
              text: 'Record plans for the insert path under month-end load and look for scans and lock waits.',
            },
            {
              title: 'Add composite filtered indexes',
              text: 'Index vendor plus invoice number, filtered to open statuses, so duplicate checks become seeks.',
            },
            {
              title: 'Pre-validate in staging',
              text: 'Reject or flag duplicates before they reach INVDET, not after.',
            },
            {
              title: 'Wrap the commit in a snapshot read',
              text: 'Use an atomic stored procedure so two sessions cannot both pass the check.',
            },
            {
              title: 'Monitor for a full close cycle',
              text: 'Track lock time and duplicate flags through one complete month-end before sign-off.',
            },
          ],
        },
        {
          type: 'code',
          lang: 'sql',
          text: 'CREATE NONCLUSTERED INDEX IX_INVDET_Vendor_InvNo\nON INVDET (HVENDOR, SINVOICENUM)\nWHERE ISTATUS <> 4;',
        },
        {
          type: 'callout',
          tone: 'warn',
          text: 'Test the filtered index on a restored copy first. A filter that does not match your query predicates is silently ignored.',
        },
        { type: 'h2', text: 'Before and after' },
        {
          type: 'gallery',
          layout: 'mosaic',
          span: 'full',
          images: [
            {
              src: '/images/City Night View 2.webp',
              w: 1200,
              h: 900,
              alt: 'Execution plan before',
            },
            {
              src: '/images/world.webp',
              w: 800,
              h: 600,
              alt: 'Execution plan after',
            },
            { src: '/images/City.png', w: 800, h: 600, alt: 'Lock wait graph' },
            {
              src: '/images/world.webp',
              w: 800,
              h: 600,
              alt: 'Duplicate flag report',
            },
            {
              src: '/images/City.png',
              w: 800,
              h: 600,
              alt: 'Month-end throughput',
            },
          ],
        },
        { type: 'divider' },
        { type: 'h2', text: 'Watch and listen' },
        {
          type: 'youtube',
          id: 'YOUR_VIDEO_ID',
          poster: '/images/world.webp',
          caption:
            'Screen recording: reproducing the race condition (replace the id with your video).',
        },
        {
          type: 'audio',
          src: '/audio/walkthrough.wav',
          title: 'Audio walkthrough, 12 seconds (test file)',
        },
        {
          type: 'list',
          style: 'check',
          items: [
            'Filtered composite index in place',
            'Staging pre-validation enabled',
            'Snapshot-read stored procedure deployed',
            'One full close cycle monitored',
          ],
        },
      ],
      externalUrl:
        'https://medium.com/@yourprofile/eliminating-ap-duplicates-yardi',
    },
    {
      id: 'art-ysr',
      slug: 'optimizing-custom-ysr-queries',
      title: 'Optimizing Custom YSR Columnar Queries Across 5,000+ Units',
      readTime: '15 min read',
      date: 'Jul 2026',
      categoryTag: 'Custom YSR',
      tags: ['YSR', 'Query Tuning'],
      imageUrl: '/images/world.webp',
      source: 'native',
      summary:
        'How replacing nested subqueries with indexed CTEs cut rent-roll generation latency by over 90%.',
      /* LAYOUT 2: LONG, TEXT-HEAVY DEEP DIVE
          many headings, code, callouts, one wide image, stats at the end */
      blocks: [
        {
          type: 'labels',
          items: ['Custom YSR', 'T-SQL', 'CTE', 'Window functions'],
        },
        {
          type: 'p',
          text: 'Custom YSR scripts often degrade sharply as unit counts cross enterprise thresholds. The usual bottleneck is correlated subqueries pulling charge codes for each row in isolation.',
        },
        {
          type: 'p',
          text: 'This write-up walks through one rent-roll report from first symptom to final fix. It is long on purpose: each step explains why the change helped, so you can apply the same reasoning to your own reports.',
        },
        { type: 'h2', text: '1. The symptom' },
        {
          type: 'p',
          text: 'The report ran in seconds on a 300-unit property and in over four minutes on a 5,200-unit portfolio. Runtime grew faster than unit count, which usually points to work being repeated per row rather than done once per set.',
        },
        {
          type: 'p',
          text: 'Users saw gateway timeouts, retried the report, and made the problem worse by stacking several copies on the same server.',
        },
        {
          type: 'callout',
          tone: 'info',
          text: 'Superlinear growth is the first clue. If doubling the data triples the time, look for per-row lookups.',
        },
        { type: 'h2', text: '2. Reading the plan' },
        {
          type: 'p',
          text: 'The actual execution plan showed a nested loop driving an index seek on the charge table once for every unit row. On small data that is cheap. On large data the same seek ran thousands of times.',
        },
        {
          type: 'p',
          text: 'Estimated and actual row counts also disagreed by two orders of magnitude on the charge lookup, so the optimizer was choosing loops where a hash join would have been better.',
        },
        {
          type: 'image',
          span: 'wide',
          img: {
            src: '/images/world.webp',
            w: 1400,
            h: 700,
            alt: 'Execution plan placeholder',
            caption:
              'Nested loop with a per-row seek on the charge table (placeholder image).',
          },
        },
        { type: 'h2', text: '3. The original pattern' },
        {
          type: 'p',
          text: 'Each column in the report was produced by its own correlated subquery. Every subquery re-read the charge table and filtered by unit and charge code.',
        },
        {
          type: 'code',
          lang: 'sql',
          text: "SELECT u.hUnit,\n  (SELECT SUM(c.dAmount) FROM CHARGE c\n    WHERE c.hUnit = u.hUnit AND c.sCode = 'RENT') AS Rent,\n  (SELECT SUM(c.dAmount) FROM CHARGE c\n    WHERE c.hUnit = u.hUnit AND c.sCode = 'PARK') AS Parking\nFROM UNIT u;",
        },
        {
          type: 'p',
          text: 'Two columns meant two reads of the charge table per unit. The real report had eleven columns.',
        },
        { type: 'h2', text: '4. Aggregate once, join once' },
        {
          type: 'p',
          text: 'Refactoring these into indexed CTEs with window functions lets the optimizer run single-pass hash joins instead of iterative index seeks. The charge table is read once, grouped by unit and code, and pivoted into columns.',
        },
        {
          type: 'code',
          lang: 'sql',
          text: "WITH charges AS (\n  SELECT hUnit,\n    SUM(CASE WHEN sCode = 'RENT' THEN dAmount END) AS Rent,\n    SUM(CASE WHEN sCode = 'PARK' THEN dAmount END) AS Parking\n  FROM CHARGE\n  GROUP BY hUnit\n)\nSELECT u.hUnit, c.Rent, c.Parking\nFROM UNIT u\nLEFT JOIN charges c ON c.hUnit = u.hUnit;",
        },
        {
          type: 'quote',
          text: 'The query did not get faster because it was cleverer. It got faster because it stopped doing the same work eleven times.',
        },
        { type: 'h2', text: '5. Supporting index' },
        {
          type: 'p',
          text: 'With the set-based shape in place, a covering index on the charge table removed the remaining lookups. Including the amount column kept the aggregate entirely inside the index.',
        },
        {
          type: 'code',
          lang: 'sql',
          text: 'CREATE NONCLUSTERED INDEX IX_CHARGE_Unit_Code\nON CHARGE (hUnit, sCode)\nINCLUDE (dAmount);',
        },
        {
          type: 'callout',
          tone: 'warn',
          text: 'Every extra index slows writes. Add this one only on tables that are read far more than they are written.',
        },
        { type: 'h2', text: '6. Results' },
        {
          type: 'p',
          text: 'On a 5,200-unit portfolio, report time dropped from 4 minutes 12 seconds to 18 seconds, ending gateway timeouts. Reads on the charge table fell from eleven per unit to one in total.',
        },
        {
          type: 'stats',
          items: [
            { value: '4m 12s', label: 'before' },
            { value: '18s', label: 'after' },
            { value: '94%', label: 'faster' },
          ],
        },
        { type: 'h2', text: '7. Checklist for your own reports' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            'Look for correlated subqueries in the SELECT list.',
            'Compare estimated and actual rows on every join.',
            'Aggregate once in a CTE, then join once.',
            'Add a covering index only after the query shape is fixed.',
            'Re-test on your largest portfolio, not your smallest.',
          ],
        },
      ],
    },
    {
      id: 'art-payscan2',
      slug: 'month-end-close-checklist-ap',
      title: 'A Month-End Close Checklist for Yardi AP Teams',
      readTime: '4 min read',
      date: 'Jul 2026',
      categoryTag: 'Yardi PayScan',
      tags: ['Checklist', 'Month-end'],
      imageUrl: '/images/City.png',
      source: 'native',
      summary:
        'A short, printable routine for the last three working days of the month, with two audio tips.',
      /* LAYOUT 3: SHORT, SCANNABLE CHECKLIST
          labels, check list, steps, two audio clips, 3-up gallery, tip callouts */
      blocks: [
        {
          type: 'labels',
          items: ['Checklist', 'Month-end', 'Accounts Payable'],
        },
        {
          type: 'p',
          text: 'Most close-week problems start three days earlier, with something small that was skipped. This checklist is the routine we run on every portfolio.',
        },
        {
          type: 'audio',
          src: '/audio/month-end-tips.wav',
          title: 'Tip 1: Why day minus three matters (test file)',
        },
        { type: 'h2', text: 'Three days before close' },
        {
          type: 'list',
          style: 'check',
          items: [
            'Clear the PayScan exception queue',
            'Confirm every vendor has current remit-to details',
            'Review invoices stuck in pending approval',
            'Freeze new vendor creation until close',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          text: 'Sort the exception queue by age. The oldest items are the ones most likely to be duplicates.',
        },
        { type: 'h2', text: 'Close day' },
        {
          type: 'steps',
          items: [
            {
              title: 'Run the duplicate report',
              text: 'Check vendor and invoice number pairs entered in the last 30 days.',
            },
            {
              title: 'Post accruals',
              text: 'Post accruals for approved invoices not yet entered.',
            },
            {
              title: 'Reconcile the AP control account',
              text: 'The subledger total must equal the GL balance before you lock the period.',
            },
          ],
        },
        {
          type: 'gallery',
          layout: '3up',
          images: [
            {
              src: '/images/City Night View 2.webp',
              w: 800,
              h: 600,
              alt: 'Exception queue screenshot',
            },
            {
              src: '/images/world.webp',
              w: 800,
              h: 600,
              alt: 'Duplicate report screenshot',
            },
            {
              src: '/images/City.png',
              w: 800,
              h: 600,
              alt: 'Reconciliation screenshot',
            },
          ],
        },
        {
          type: 'audio',
          src: '/audio/walkthrough.wav',
          title: 'Tip 2: Locking the period safely (test file)',
        },
        {
          type: 'callout',
          tone: 'warn',
          text: 'Do not lock the period until the reconciliation difference is zero.',
        },
      ],
    },
    {
      id: 'art-hud',
      slug: 'hud-50059-recertification-alerts',
      title:
        'Architecting HUD 50059 Recertification Alert Workflows in Voyager',
      readTime: '5 min read',
      date: 'Jun 2026',
      categoryTag: 'Compliance',
      tags: ['HUD 50059', 'Compliance'],
      imageUrl: '/images/City.png',
      source: 'linkedin',
      summary:
        'Automating Tenant Income Certification tracking and HAP subsidy ledger reconciliation.',
      externalUrl: 'https://www.linkedin.com/posts/your-post-id',
    },
    {
      id: 'art-payscan3',
      slug: 'reading-execution-plans-visual-guide',
      title: 'Reading SQL Server Execution Plans: A Visual Guide',
      readTime: '5 min read',
      date: 'Jun 2026',
      categoryTag: 'MSSQL Tuning',
      tags: ['MSSQL', 'Execution plans'],
      imageUrl: '/images/world.webp',
      source: 'native',
      summary:
        'Image-led walkthrough of the five operators that explain most slow queries.',
      /* LAYOUT 4: IMAGE-LED VISUAL ESSAY
          very little text, full-bleed images, split rows, 2-up, big quote, video */
      blocks: [
        {
          type: 'image',
          span: 'full',
          img: {
            src: '/images/world.webp',
            w: 1600,
            h: 700,
            alt: 'Execution plan overview',
            caption: 'A whole plan at a glance (placeholder image).',
          },
        },
        {
          type: 'p',
          text: 'You do not need to understand every operator. Five of them explain most slow queries.',
        },
        {
          type: 'split',
          title: 'Table scan',
          text: 'Reads every row. Fine on small tables, costly on large ones.',
          img: {
            src: '/images/City Night View 2.webp',
            w: 1000,
            h: 700,
            alt: 'Table scan operator',
          },
        },
        {
          type: 'split',
          flip: true,
          title: 'Key lookup',
          text: 'One extra read per row. Many lookups usually mean a missing included column.',
          img: {
            src: '/images/City.png',
            w: 1000,
            h: 700,
            alt: 'Key lookup operator',
          },
        },
        {
          type: 'quote',
          text: 'Fat arrows are the plan telling you where the rows are.',
        },
        {
          type: 'gallery',
          layout: '2up',
          images: [
            {
              src: '/images/City Night View 2.webp',
              w: 900,
              h: 675,
              alt: 'Estimated rows',
            },
            { src: '/images/world.webp', w: 900, h: 675, alt: 'Actual rows' },
          ],
        },
        {
          type: 'callout',
          tone: 'info',
          text: 'When estimated and actual rows differ by a lot, check statistics first.',
        },
        {
          type: 'video',
          src: '/video/plan-demo.mp4',
          poster: '/images/City.png',
          w: 1280,
          h: 720,
          caption:
            'Two-minute demo (add your own MP4 at /video/plan-demo.mp4).',
        },
      ],
    },
    {
      id: 'art-hud-2',
      slug: 'hud-50059-recertification-alerts-2',
      title:
        'Architecting HUD 50059 Recertification Alert Workflows in Voyager',
      readTime: '5 min read',
      date: 'Jun 2026',
      categoryTag: 'Compliance',
      tags: ['HUD 50059', 'Compliance'],
      imageUrl: '/images/City.png',
      source: 'linkedin',
      summary:
        'Automating Tenant Income Certification tracking and HAP subsidy ledger reconciliation.',
      externalUrl: 'https://www.linkedin.com/posts/your-post-id',
    },
    {
      id: 'art-payscan4',
      slug: 'eliminating-ap-duplicates-payscan-4',
      title:
        'Eliminating AP Duplicates in High-Volume Yardi PayScan Deployments',
      readTime: '6 min read',
      date: 'Aug 2026',
      categoryTag: 'Yardi PayScan',
      tags: ['PayScan', 'Indexing'],
      imageUrl: '/images/City Night View 2.webp',
      source: 'native',
      summary:
        'Indexing strategies for INVDET tables that prevent vendor double payments during peak month-end cycles.',
      content: [
        'Duplicate invoice entry remains one of the costliest pain points in decentralized property management setups. In high-volume PayScan workflows, concurrent OCR batch ingestion frequently encounters race conditions where identical vendor invoice numbers bypass standard front-end validation checks.',
        'By analyzing execution plans on SQL Server staging tables, we identified parameter sniffing and lock escalation on the primary INVDET and TRANS tables. Composite non-clustered filtered indexes plus strict staging pre-validation reduced invoice processing lock-times by 78%.',
        'Atomic stored procedure checks using isolated snapshot read transactions then prevent multi-tab duplicate commits across remote accounts payable teams without creating blocking locks.',
      ],
      externalUrl:
        'https://medium.com/@yourprofile/eliminating-ap-duplicates-yardi',
    },
    {
      id: 'art-payscan5',
      slug: 'eliminating-ap-duplicates-payscan-5',
      title:
        'Eliminating AP Duplicates in High-Volume Yardi PayScan Deployments',
      readTime: '6 min read',
      date: 'Aug 2026',
      categoryTag: 'Yardi PayScan',
      tags: ['PayScan', 'Indexing'],
      imageUrl: '/images/City Night View 2.webp',
      source: 'native',
      summary:
        'Indexing strategies for INVDET tables that prevent vendor double payments during peak month-end cycles.',
      content: [
        'Duplicate invoice entry remains one of the costliest pain points in decentralized property management setups. In high-volume PayScan workflows, concurrent OCR batch ingestion frequently encounters race conditions where identical vendor invoice numbers bypass standard front-end validation checks.',
        'By analyzing execution plans on SQL Server staging tables, we identified parameter sniffing and lock escalation on the primary INVDET and TRANS tables. Composite non-clustered filtered indexes plus strict staging pre-validation reduced invoice processing lock-times by 78%.',
        'Atomic stored procedure checks using isolated snapshot read transactions then prevent multi-tab duplicate commits across remote accounts payable teams without creating blocking locks.',
      ],
      externalUrl:
        'https://medium.com/@yourprofile/eliminating-ap-duplicates-yardi',
    },
    {
      id: 'art-hud-3',
      slug: 'hud-50059-recertification-alerts-3',
      title:
        'Architecting HUD 50059 Recertification Alert Workflows in Voyager',
      readTime: '5 min read',
      date: 'Jun 2026',
      categoryTag: 'Compliance',
      tags: ['HUD 50059', 'Compliance'],
      imageUrl: '/images/City.png',
      source: 'linkedin',
      summary:
        'Automating Tenant Income Certification tracking and HAP subsidy ledger reconciliation.',
      externalUrl: 'https://www.linkedin.com/posts/your-post-id',
    },
    {
      id: 'art-mssql-1',
      slug: 'checkscan-deadlocks',
      title: 'Resolving Database Deadlocks During CheckScan Batch Processing',
      readTime: '7 min read',
      date: 'May 2026',
      categoryTag: 'MSSQL Tuning',
      tags: ['MSSQL', 'Deadlocks'],
      imageUrl: '/images/world.webp',
      source: 'medium',
      summary:
        'Transaction isolation levels and atomic MERGE upsert patterns for real estate payment staging tables.',
      externalUrl: 'https://medium.com/@yourprofile/checkscan-deadlocks-sql',
    },
    // ...add the remaining articles here
  ];

  /* Old `content: string[]` articles become simple paragraph blocks,
      so they keep working with no rewrite. */
  blocksOf(a: TechnicalArticle): ArticleBlock[] {
    return (
      a.blocks ??
      (a.content ?? []).map((text) => ({ type: 'p', text }) as ArticleBlock)
    );
  }

  /* ---------- list state ---------- */
  private readonly months = [
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
  ];

  /* "Aug 2026" -> sortable number (avoids Date.parse quirks in Safari) */
  private dateValue(a: TechnicalArticle): number {
    const [m, y] = a.date.split(' ');
    return (
      Number(y) * 12 +
      Math.max(0, this.months.indexOf((m ?? '').toLowerCase().slice(0, 3)))
    );
  }

  filteredArticles = computed(() => {
    const q = this.articlesSearch().toLowerCase().trim();
    const tag = this.articlesTagFilter();
    const sort = this.articlesSort();

    const list = this.technicalArticles.filter((a) => {
      const okTag = !tag || tag === 'All' || a.categoryTag === tag;
      const okSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        !!a.tags?.some((t) => t.toLowerCase().includes(q));
      return okTag && okSearch;
    });

    return [...list].sort(
      (a, b) =>
        sort === 'title'
          ? a.title.localeCompare(b.title)
          : sort === 'oldest'
            ? this.dateValue(a) - this.dateValue(b)
            : this.dateValue(b) - this.dateValue(a), // 'newest' or blank
    );
  });

  goToPortfolioHome(): void {
    // Prevent multiple clicks while navigation is in progress.
    if (this.portfolioNavigationLoading()) {
      return;
    }

    this.portfolioNavigationLoading.set(true);
    this.shareOpen.set(false);

    // Allow the loading animation to appear before navigating.
    setTimeout(() => {
      this.portfolioHomeRequested.emit();
    }, 800);
  }

  /* Featured = newest article. Only in the unfiltered "Newest first" view
      (blank counts as unfiltered / newest); it is removed from the grid on every
      page so no article appears twice, and shown on page 1. */
  private featuredMode = computed(
    () =>
      ['', 'All'].includes(this.articlesTagFilter()) &&
      ['', 'newest'].includes(this.articlesSort()) &&
      !this.articlesSearch().trim() &&
      this.filteredArticles().length > 0,
  );

  featuredArticle = computed(() =>
    this.featuredMode() && this.articlesCurrentPage() === 1
      ? this.filteredArticles()[0]
      : null,
  );

  private gridSource = computed(() =>
    this.featuredMode()
      ? this.filteredArticles().slice(1)
      : this.filteredArticles(),
  );

  paginatedArticles = computed(() => {
    const start = (this.articlesCurrentPage() - 1) * this.pageSize;
    return this.gridSource().slice(start, start + this.pageSize);
  });

  totalArticlesPages = computed(
    () => Math.ceil(this.gridSource().length / this.pageSize) || 1,
  );

  rangeLabel = computed(() => {
    const total = this.filteredArticles().length;
    const shown =
      this.paginatedArticles().length + (this.featuredArticle() ? 1 : 0);
    return `Showing ${shown} of ${total} articles`;
  });

  related = computed(() => {
    const cur = this.selectedArticle();
    if (!cur) return [];
    return this.technicalArticles
      .filter((a) => a.id !== cur.id)
      .sort(
        (a, b) =>
          Number(b.categoryTag === cur.categoryTag) -
          Number(a.categoryTag === cur.categoryTag),
      )
      .slice(0, 2);
  });

  /* True when search text or a non-default category / sort is set -> shows Clear */
  hasActiveFilters = computed(
    () =>
      !!this.articlesSearch().trim() ||
      !['', 'All'].includes(this.articlesTagFilter()) ||
      !['', 'newest'].includes(this.articlesSort()),
  );

  getCategoryCount(cat: string): number {
    return cat === 'All'
      ? this.technicalArticles.length
      : this.technicalArticles.filter((a) => a.categoryTag === cat).length;
  }

  setArticlesTag(tag: string): void {
    this.articlesTagFilter.set(tag);
    this.articlesCurrentPage.set(1);
  }

  setArticlesSort(v: SortKey): void {
    this.articlesSort.set(v);
    this.articlesCurrentPage.set(1);
  }

  setSearch(v: string): void {
    this.articlesSearch.set(v);
    this.articlesCurrentPage.set(1);
  }

  /* Reset search, category, sort and page back to the defaults */
  clearAll(): void {
    this.articlesSearch.set('');
    this.articlesTagFilter.set('All');
    this.articlesSort.set('newest');
    this.articlesCurrentPage.set(1);
  }

  changeArticlesPage(delta: number): void {
    const next = this.articlesCurrentPage() + delta;
    if (next >= 1 && next <= this.totalArticlesPages())
      this.articlesCurrentPage.set(next);
  }

  trackArticleById = (_: number, a: TechnicalArticle) => a.id;

  sourceLabel(a: TechnicalArticle): string {
    return a.source === 'medium'
      ? 'Medium'
      : a.source === 'linkedin'
        ? 'LinkedIn'
        : '';
  }

  /* ---------- open / back ---------- */

  openArticle(a: TechnicalArticle): void {
    if (a.source !== 'native') {
      if (a.externalUrl) {
        window.open(a.externalUrl, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    this.shareOpen.set(false);

    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: { article: a.slug },
        queryParamsHandling: 'merge',
      })
      .then((navigated) => {
        if (!navigated) return;

        // Wait until Angular updates and renders the article reader.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const reader = document.querySelector('.reader');

            reader?.scrollIntoView({
              behavior: 'auto',
              block: 'start',
            });
          });
        });
      });
  }

  backToList(): void {
    this.shareOpen.set(false);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { article: null },
      queryParamsHandling: 'merge',
    });
  }

  /* ---------- sharing ---------- */
  shareUrl(a: TechnicalArticle): string {
    if (a.source !== 'native' && a.externalUrl) return a.externalUrl;
    return `${window.location.origin}${window.location.pathname}?article=${a.slug}`;
  }

  async copyLink(a: TechnicalArticle): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.shareUrl(a));
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      window.prompt('Copy this link:', this.shareUrl(a));
    }
  }

  shareLinkedIn(a: TechnicalArticle): void {
    const url = encodeURIComponent(this.shareUrl(a));
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      '_blank',
      'noopener,noreferrer,width=600,height=640',
    );
  }

  shareX(a: TechnicalArticle): void {
    const url = encodeURIComponent(this.shareUrl(a));
    const text = encodeURIComponent(a.title);
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      '_blank',
      'noopener,noreferrer,width=600,height=500',
    );
  }

  async nativeShare(a: TechnicalArticle): Promise<void> {
    if (navigator.share) {
      try {
        await navigator.share({
          title: a.title,
          text: a.summary,
          url: this.shareUrl(a),
        });
      } catch {
        /* user cancelled */
      }
    } else {
      this.shareOpen.update((v) => !v);
    }
  }

  canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;
}
