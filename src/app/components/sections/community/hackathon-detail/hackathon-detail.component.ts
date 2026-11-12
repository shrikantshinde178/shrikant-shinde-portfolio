import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { map } from 'rxjs';

// ─────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────

export interface HackathonGalleryImage {
  src: string;
  caption: string;
}

export interface HackathonDetail {
  slug: string;
  title: string;
  subtitle: string;
  event: string;
  date: string;
  duration: string;
  result?: string;
  heroImage: string;
  overview: string;
  problem: string;
  solution: string;
  myContribution: string;
  technologies: string[];
  gallery: HackathonGalleryImage[];
  videoId?: string;
  architectureImage?: string;
  challenges: string[];
  learnings: string[];
  links: { label: string; url: string }[];
}

// ─────────────────────────────────────────────
// Hackathon data
// Replace sample gallery images and draft text
// with your actual project content.
// ─────────────────────────────────────────────

export const HACKATHON_DETAILS: HackathonDetail[] = [
  {
    slug: 'kurukshetra-2',
    title: 'KurukSheTra 2.0',
    subtitle: 'Multi-Agent Resume Screening Platform',
    event: 'MIT Arts, Commerce & Science College',
    date: 'Oct 2026',
    duration: '24 hrs',
    result: 'Finalist',

    heroImage:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1800&q=85',

    overview:
      'A multi-agent recruitment platform concept that uses AI-assisted resume analysis and job matching to help recruiters evaluate candidate fit beyond basic keyword matching.',

    problem:
      'Traditional screening workflows can rely heavily on keywords and manual review. This can make it difficult to compare candidate experience, identify relevant skills, and understand gaps against a job description.',

    solution:
      'The proposed platform uses specialized agents to analyze resumes, interpret job descriptions, identify relevant skills and skill gaps, and assemble recruiter-oriented summaries. Update this section to reflect the actual features your team implemented.',

    myContribution:
      'Describe your personal responsibilities, the components you built, the technical decisions you contributed to, and the work you can demonstrate. Replace this draft with your actual contribution.',

    technologies: ['Agentic AI', 'NLP', 'LLMs', 'Python', 'Resume Screening'],

    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80',
        caption: 'Team collaboration',
      },
      {
        src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
        caption: 'Collaborative development',
      },
      {
        src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
        caption: 'Project presentation',
      },
    ],

    challenges: [
      'Explain how the team handled resume parsing and inconsistent input formats.',
      'Describe how candidate skills were compared with job requirements.',
      'Document an actual technical challenge and how your team addressed it.',
    ],

    learnings: [
      'Describe what you learned about multi-agent system design.',
      'Explain what you learned about presenting and validating an AI-based solution.',
    ],

    links: [],
  },

  {
    slug: 'beyond-the-desk-2026',
    title: 'Beyond the Desk 2026',
    subtitle: 'Automated Reconciliation Assistant',
    event: 'Hackathon 2026',
    date: 'Mar 2026',
    duration: '24 hrs',
    result: 'Finalist',

    heroImage:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=85',

    overview:
      'A data reconciliation assistant concept designed to help identify ledger imbalances during data cutovers before they affect downstream financial processing.',

    problem:
      'Data migrations can introduce mismatches between source and destination records. Finding those differences manually can be time-consuming and may delay cutover validation.',

    solution:
      'The proposed approach uses SQL Server validation checks to compare relevant financial data and flag differences for investigation. Add your actual validation rules, workflow, and demonstrated results here.',

    myContribution:
      'Describe the SQL logic, reconciliation rules, testing, or other tasks you personally performed during the project.',

    technologies: [
      'SQL Server',
      'T-SQL',
      'ETL',
      'Automation',
      'Data Validation',
    ],

    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
        caption: 'Data analysis concept',
      },
      {
        src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
        caption: 'Analytics and reporting',
      },
      {
        src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
        caption: 'Project planning',
      },
    ],

    challenges: [
      'Describe a reconciliation scenario that was difficult to validate.',
      'Explain how you handled mismatches or exceptions.',
    ],

    learnings: [
      'Describe what you learned about financial data reconciliation.',
      'Explain what you learned about validating data before a cutover.',
    ],

    links: [],
  },
];

// ─────────────────────────────────────────────
// Hackathon detail component
// ─────────────────────────────────────────────

@Component({
  selector: 'app-hackathon-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hackathon-detail.component.html',
  styleUrl: './hackathon-detail.component.scss',
})
export class HackathonDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);

  // Read the slug from /community/hackathons/:slug
  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug'))),
    {
      initialValue: this.route.snapshot.paramMap.get('slug'),
    },
  );

  // Find the hackathon matching the current URL
  readonly hackathon = computed(
    () => HACKATHON_DETAILS.find((item) => item.slug === this.slug()) ?? null,
  );

  // Duplicate gallery items to create a continuous scrolling track
  readonly galleryTrack = computed(() => {
    const gallery = this.hackathon()?.gallery ?? [];
    return [...gallery, ...gallery];
  });

  // Only create a YouTube embed URL when a valid video ID is supplied
  readonly videoUrl = computed<SafeResourceUrl | null>(() => {
    const videoId = this.hackathon()?.videoId;

    if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return null;
    }

    const url = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  // Previous hackathon in the data array
  readonly previousHackathon = computed(() => {
    const current = this.hackathon();

    if (!current) {
      return null;
    }

    const index = HACKATHON_DETAILS.findIndex(
      (item) => item.slug === current.slug,
    );

    return index > 0 ? HACKATHON_DETAILS[index - 1] : null;
  });

  // Next hackathon in the data array
  readonly nextHackathon = computed(() => {
    const current = this.hackathon();

    if (!current) {
      return null;
    }

    const index = HACKATHON_DETAILS.findIndex(
      (item) => item.slug === current.slug,
    );

    return index >= 0 && index < HACKATHON_DETAILS.length - 1
      ? HACKATHON_DETAILS[index + 1]
      : null;
  });

  // Open only valid HTTP or HTTPS external links
  openExternalLink(url: string): void {
    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:') {
        window.open(parsedUrl.href, '_blank', 'noopener,noreferrer');
      }
    } catch {
      // Ignore malformed URLs.
    }
  }
}
