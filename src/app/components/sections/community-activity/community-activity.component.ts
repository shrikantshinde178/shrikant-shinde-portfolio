import {
  Component,
  HostListener,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface HackathonItem {
  title: string;
  event: string;
  date: string;
  result?: string;
  description: string;
  tags?: string[];
  duration?: string;
  image?: string;
  link?: string;
}

export interface ProposedSolutionItem {
  title: string;
  description: string;
  status: 'Proposed' | 'In Progress' | 'Implemented';
  tags: string[];
  link?: string;
}

export interface EventItem {
  title: string;
  role: 'Attendee' | 'Speaker' | 'Panelist' | 'Organizer';
  date: string;
  location?: string;
  description: string;
  link?: string;
}

export interface YoutubeItem {
  title: string;
  product: string;
  module: string;
  date: string;
  duration: string;
  description?: string;
  videoId: string;
}

export interface GalleryImage {
  src: string;
  caption: string;
}

export interface ActivityDetail {
  title: string;
  eyebrow?: string;
  description: string;
  image?: string;
  date?: string;
  tags?: string[];
  result?: string;
}

@Component({
  selector: 'app-community-activity',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './community-activity.component.html',
  styleUrls: ['./community-activity.component.scss'],
})
export class CommunityActivityComponent implements OnDestroy {
  private readonly router = inject(Router);

  readonly playingVideoId = signal<string | null>(null);
  readonly showModal = signal(false);
  readonly activeVideo = signal<YoutubeItem | null>(null);
  readonly activeDetail = signal<ActivityDetail | null>(null);
  readonly showDetailModal = signal(false);

  readonly fallbackImg =
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80';

  private readonly youtubeVideoIdPattern = /^[a-zA-Z0-9_-]{11}$/;

  hackathons: HackathonItem[] = [
    {
      title: 'KurukSheTra 2.0 — Multi-Agent Resume Screening Platform',
      event: 'MIT Arts, Commerce & Science College',
      date: 'Oct 2026',
      result: 'Finalist',
      duration: '24 hrs',
      description:
        'Built a Multi-Agent Resume Screening and Job Matching Platform using Agentic AI, NLP, and LLMs. Specialized agents analyze resumes, parse job descriptions, surface skill gaps, and generate recruiter-ready summaries — shifting recruitment from keyword matching to genuine candidate fit.',
      tags: ['Agentic AI', 'NLP', 'LLMs', 'Python', 'Resume Screening'],
      image:
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
      link: '',
    },
    {
      title: 'Hack It Sapiens',
      event: 'MIT Arts, Commerce & Science College',
      date: 'Oct 2026',
      result: 'Finalist',
      duration: '24 hrs',
      description:
        'Built a Multi-Agent Resume Screening and Job Matching Platform using Agentic AI, NLP, and LLMs. Specialized agents analyze resumes, parse job descriptions, surface skill gaps, and generate recruiter-ready summaries — shifting recruitment from keyword matching to genuine candidate fit.',
      tags: ['Agentic AI', 'NLP', 'LLMs', 'Python', 'Resume Screening'],
      image:
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
      link: '',
    },
    {
      title: 'Saffiers 6.2',
      event: 'MIT Arts, Commerce & Science College',
      date: 'Oct 2026',
      result: 'Finalist',
      duration: '24 hrs',
      description:
        'Built a Multi-Agent Resume Screening and Job Matching Platform using Agentic AI, NLP, and LLMs. Specialized agents analyze resumes, parse job descriptions, surface skill gaps, and generate recruiter-ready summaries — shifting recruitment from keyword matching to genuine candidate fit.',
      tags: ['Agentic AI', 'NLP', 'LLMs', 'Python', 'Resume Screening'],
      image:
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
      link: '',
    },
    {
      title: 'AIT 2.0',
      event: 'MIT Arts, Commerce & Science College',
      date: 'Oct 2026',
      result: 'Finalist',
      duration: '24 hrs',
      description:
        'Built a Multi-Agent Resume Screening and Job Matching Platform using Agentic AI, NLP, and LLMs. Specialized agents analyze resumes, parse job descriptions, surface skill gaps, and generate recruiter-ready summaries — shifting recruitment from keyword matching to genuine candidate fit.',
      tags: ['Agentic AI', 'NLP', 'LLMs', 'Python', 'Resume Screening'],
      image:
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
      link: '',
    },
    {
      title: 'BDesk 2026',
      event: 'Hackathon 2026',
      date: 'Mar 2026',
      result: 'Finalist',
      duration: '24 hrs',
      description:
        'Engineered an automated data reconciliation assistant that catches ledger imbalances during cutovers before they reach the books, built on SQL Server validation checks.',
      tags: ['SQL Server', 'T-SQL', 'ETL', 'Automation'],
      image:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      link: '',
    },
  ];

  proposedSolutions: ProposedSolutionItem[] = [
    {
      title: 'Automated Move-In Certificate Validator',
      description:
        'Autonomous T-SQL check preventing orphaned unit assignments prior to bulk ETL ingestion into Yardi Voyager. Reduces cutover errors by validating referential integrity before go-live.',
      status: 'In Progress',
      tags: ['SQL Server', 'Automation', 'Validation', 'Yardi'],
    },
    {
      title: 'YSR Report Diff Engine',
      description:
        'A lightweight diff tool that compares two YSR financial report outputs and surfaces line-level variances — useful for regression testing after schema changes.',
      status: 'Proposed',
      tags: ['YSR', 'Reporting', 'T-SQL', 'Yardi Voyager'],
    },
    {
      title: 'Cutover Pre-flight Checklist Automation',
      description:
        'Pre-flight validation suite that runs a sequence of SQL checks against staging data before any production cutover window, generating a pass/fail PDF report.',
      status: 'Proposed',
      tags: ['ETL', 'SQL Server', 'Validation', 'Reporting'],
    },
  ];

  events: EventItem[] = [
    {
      title: 'Enterprise Architecture & SQL Tuning Meetup',
      role: 'Attendee',
      date: 'Jan 2026',
      location: 'Virtual',
      description:
        'Deep dive into parameter sniffing, plan caching, and clustered index alignments for high-volume transactional systems.',
    },
    {
      title: 'Yardi Advanced User Conference',
      role: 'Attendee',
      date: 'Nov 2025',
      location: 'Virtual',
      description:
        'Sessions covering Voyager 8 migration patterns, RentCafe configuration, and affordable housing compliance workflows.',
    },
  ];

  youtubeVideos: YoutubeItem[] = [
    {
      title: 'Spotlight on Multifamily Data Migration',
      product: 'Yardi Voyager',
      module: 'Residential',
      date: 'Mar 11, 2026',
      duration: '38:16',
      description:
        'Deep dive into ETL patterns for multifamily residential data migration to Voyager 7S.',
      videoId: 'VIDEO_ID_1',
    },
    {
      title: 'Meet Virtuoso Support: AI Power with Human Touch',
      product: 'Yardi Virtuoso',
      module: 'Support',
      date: 'Mar 11, 2026',
      duration: '16:02',
      description:
        'Overview of the Virtuoso AI-assisted support platform and its integration with Voyager workflows.',
      videoId: 'VIDEO_ID_2',
    },
    {
      title: 'AI-Assisted Course Authoring & YSR Scripts',
      product: 'Aspire',
      module: 'Aspire',
      date: 'Mar 11, 2026',
      duration: '20:54',
      description:
        'Using AI tools to accelerate Aspire course authoring and automate YSR report script generation.',
      videoId: 'VIDEO_ID_3',
    },
  ];

  hackathonImages: GalleryImage[] = [
    {
      src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80',
      caption: 'Team at KurukSheTra 2.0',
    },
    {
      src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
      caption: 'Late night build session',
    },
    {
      src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
      caption: 'Demo presentation',
    },
    {
      src: 'https://images.unsplash.com/photo-1560439514-4e9645039924?auto=format&fit=crop&w=400&q=80',
      caption: 'Finalist announcement',
    },
  ];

  /** Image state for the two cross-fading layers on each card. */
  readonly hackathonCardImageIndexes: Record<number, number> = {};
  readonly hackathonCardLayerIndexes: Record<number, [number, number]> = {};
  readonly hackathonCardVisibleLayers: Record<number, 0 | 1> = {};
  private readonly hackathonCardPreviewTimers = new Map<
    number,
    ReturnType<typeof setInterval>
  >();
  private readonly hackathonCardFadeTimers = new Map<
    number,
    ReturnType<typeof setTimeout>
  >();

  /** Use the card cover plus the existing event gallery as preview images. */
  getHackathonCardImages(hackathon: HackathonItem): string[] {
    const sources = [
      hackathon.image || this.fallbackImg,
      ...this.hackathonImages.map((image) => image.src),
    ];
    return [...new Set(sources.filter(Boolean))];
  }

  getHackathonCardLayerImage(
    hackathon: HackathonItem,
    cardIndex: number,
    layer: 0 | 1,
  ): string {
    const images = this.getHackathonCardImages(hackathon);
    if (!images.length) return this.fallbackImg;
    const layerIndexes = this.hackathonCardLayerIndexes[cardIndex] ?? [0, 0];
    return images[layerIndexes[layer] % images.length] || this.fallbackImg;
  }

  startHackathonCardPreview(index: number): void {
    const hackathon = this.hackathons[index];
    if (!hackathon || this.getHackathonCardImages(hackathon).length < 2) return;

    this.stopHackathonCardPreview(index, false);
    const images = this.getHackathonCardImages(hackathon);
    const currentIndex = this.hackathonCardImageIndexes[index] ?? 0;
    this.hackathonCardLayerIndexes[index] = [currentIndex, currentIndex];
    this.hackathonCardVisibleLayers[index] = 0;

    const timer = setInterval(() => {
      const visibleLayer = this.hackathonCardVisibleLayers[index] ?? 0;
      const hiddenLayer: 0 | 1 = visibleLayer === 0 ? 1 : 0;
      const nextIndex =
        ((this.hackathonCardImageIndexes[index] ?? 0) + 1) % images.length;

      // Load the next image on the hidden layer, then cross-fade to it.
      this.hackathonCardLayerIndexes[index] =
        hiddenLayer === 0
          ? [nextIndex, this.hackathonCardLayerIndexes[index]?.[1] ?? 0]
          : [this.hackathonCardLayerIndexes[index]?.[0] ?? 0, nextIndex];
      this.hackathonCardImageIndexes[index] = nextIndex;

      const previousFade = this.hackathonCardFadeTimers.get(index);
      if (previousFade) clearTimeout(previousFade);
      const fadeTimer = setTimeout(() => {
        this.hackathonCardVisibleLayers[index] = hiddenLayer;
        this.hackathonCardFadeTimers.delete(index);
      }, 80);
      this.hackathonCardFadeTimers.set(index, fadeTimer);
    }, 900);

    this.hackathonCardPreviewTimers.set(index, timer);
  }

  stopHackathonCardPreview(index: number, resetImage = true): void {
    const timer = this.hackathonCardPreviewTimers.get(index);
    if (timer) {
      clearInterval(timer);
      this.hackathonCardPreviewTimers.delete(index);
    }
    const fadeTimer = this.hackathonCardFadeTimers.get(index);
    if (fadeTimer) {
      clearTimeout(fadeTimer);
      this.hackathonCardFadeTimers.delete(index);
    }

    if (resetImage) {
      this.hackathonCardImageIndexes[index] = 0;
      this.hackathonCardLayerIndexes[index] = [0, 0];
      this.hackathonCardVisibleLayers[index] = 0;
    }
  }

  get featuredHackathon(): HackathonItem | null {
    return this.hackathons[0] ?? null;
  }

  get heroSlideshowImages(): GalleryImage[] {
    return this.hackathonImages.length
      ? this.hackathonImages
      : [{ src: this.fallbackImg, caption: 'Hackathon event' }];
  }

  /** Navigate to the dedicated hackathon detail page using its route slug. */
  navigateToHackathonDetail(hackathon: HackathonItem): void {
    const title = hackathon.title.toLowerCase();
    let slug: string | null = null;

    if (
      title.startsWith('kurukshetra 2.0') ||
      title.startsWith('kurukshetra 2')
    ) {
      slug = 'kurukshetra-2';
    } else if (title.startsWith('beyond the desk 2026')) {
      slug = 'beyond-the-desk-2026';
    }

    if (!slug) {
      console.error(
        `No hackathon detail route is configured for: ${hackathon.title}`,
      );
      return;
    }

    void this.router.navigate(['/community/hackathons', slug]);
  }

  openHackathonDetail(hackathon: HackathonItem): void {
    this.activeDetail.set({
      title: hackathon.title,
      eyebrow: hackathon.event,
      description: hackathon.description,
      image: hackathon.image || this.fallbackImg,
      date: `${hackathon.date}${hackathon.duration ? ` · ${hackathon.duration}` : ''}`,
      tags: hackathon.tags ?? [],
      result: hackathon.result,
    });
    this.showDetailModal.set(true);
  }

  openSolutionDetail(solution: ProposedSolutionItem): void {
    this.activeDetail.set({
      title: solution.title,
      eyebrow: `Proposed solution · ${solution.status}`,
      description: solution.description,
      tags: solution.tags,
    });
    this.showDetailModal.set(true);
  }

  openEventDetail(event: EventItem): void {
    this.activeDetail.set({
      title: event.title,
      eyebrow: `${event.role}${event.location ? ` · ${event.location}` : ''}`,
      description: event.description,
      date: event.date,
    });
    this.showDetailModal.set(true);
  }

  openGalleryDetail(image: GalleryImage): void {
    this.activeDetail.set({
      title: image.caption,
      eyebrow: 'Hackathon gallery',
      description: `Photo from ${image.caption.toLowerCase()}.`,
      image: image.src,
    });
    this.showDetailModal.set(true);
  }

  closeDetailModal(): void {
    this.showDetailModal.set(false);
    this.activeDetail.set(null);
  }

  get finalistCount(): number {
    return this.hackathons.filter((hackathon) =>
      hackathon.result?.toLowerCase().includes('finalist'),
    ).length;
  }

  constructor(private readonly sanitizer: DomSanitizer) {}

  isValidVideoId(videoId: string): boolean {
    return this.youtubeVideoIdPattern.test(videoId);
  }

  handleVideoClick(video: YoutubeItem): void {
    if (!video || !this.isValidVideoId(video.videoId)) {
      return;
    }

    this.playingVideoId.update((currentId) =>
      currentId === video.videoId ? null : video.videoId,
    );
  }

  stopVideo(event: Event): void {
    event.stopPropagation();
    this.playingVideoId.set(null);
  }

  getMutedEmbedUrl(videoId: string): SafeResourceUrl {
    if (!this.isValidVideoId(videoId)) {
      throw new Error('Invalid YouTube video ID.');
    }

    const url =
      `https://www.youtube-nocookie.com/embed/${videoId}` +
      '?autoplay=1&mute=1&controls=1&rel=0';

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getFullEmbedUrl(videoId: string): SafeResourceUrl {
    if (!this.isValidVideoId(videoId)) {
      throw new Error('Invalid YouTube video ID.');
    }

    const url =
      `https://www.youtube-nocookie.com/embed/${videoId}` + '?autoplay=1&rel=0';

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getYoutubeThumbnail(videoId: string): string {
    if (!this.isValidVideoId(videoId)) {
      return this.fallbackImg;
    }

    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement | null;

    if (!image || image.dataset['fallbackApplied'] === 'true') {
      return;
    }

    image.dataset['fallbackApplied'] = 'true';
    image.src = this.fallbackImg;
  }

  openVideoModal(video: YoutubeItem): void {
    if (!video) {
      return;
    }

    this.playingVideoId.set(null);
    this.activeVideo.set(video);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.activeVideo.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.showModal()) {
      this.closeModal();
    } else if (this.showDetailModal()) {
      this.closeDetailModal();
    } else {
      this.playingVideoId.set(null);
    }
  }

  openLink(url?: string): void {
    if (!url) {
      return;
    }

    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
        return;
      }

      window.open(parsedUrl.href, '_blank', 'noopener,noreferrer');
    } catch {
      // Ignore invalid URLs.
    }
  }

  ngOnDestroy(): void {
    this.hackathonCardPreviewTimers.forEach((timer) => clearInterval(timer));
    this.hackathonCardPreviewTimers.clear();
    this.hackathonCardFadeTimers.forEach((timer) => clearTimeout(timer));
    this.hackathonCardFadeTimers.clear();
    this.playingVideoId.set(null);
    this.activeVideo.set(null);
    this.showModal.set(false);
    this.activeDetail.set(null);
    this.showDetailModal.set(false);
  }
}
