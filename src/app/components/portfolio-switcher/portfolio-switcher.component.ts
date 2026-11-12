import {
  Component,
  signal,
  computed,
  OnInit,
  OnDestroy,
  HostListener,
  effect,
  inject,
} from '@angular/core';
import {
  Router,
  RouterOutlet,
  NavigationEnd,
  ActivatedRoute,
} from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// Child components (now shown inside popups)
import { CoreCompetenciesComponent } from '../sections/core-competencies/core-competencies.component';
import { FullstackAppsComponent } from '../sections/fullstack-apps/fullstack-apps.component';
import { TechnicalArticlesComponent } from '../sections/technical-articles/technical-articles.component';
import { ContactMeComponent } from '../sections/contact-me/contact-me.component';
import { CommunityActivityComponent } from '../sections/community-activity/community-activity.component';

export type SectionType =
  | 'home'
  | 'work'
  | 'fullstack'
  | 'blogs'
  | 'community'
  | 'connect';

/** Sections that open in a popup (everything except 'home') */
export type ModalSection = Exclude<SectionType, 'home'>;

export interface SectionMeta {
  title: string;
  subtitle: string;
}

export type SectionCatalog = Record<SectionType, SectionMeta>;
export type CommunityTab = 'hackathons' | 'solutions' | 'events' | 'youtube';

export interface NavItem {
  id: ModalSection;
  label: string;
  icon: string;
}

export interface SlideMeta {
  id: 'intro' | 'video' | 'hackathon' | 'articles';
  code: string;
}

export interface HighlightItem {
  kind: 'video' | 'update';
  tag: string;
  title: string;
  summary: string;
  points: string[];
  date: string;
  image: string;
  cta: string;
  videoId?: string;
  section?: SectionType;
  tab?: CommunityTab;
}

export interface LatestArticle {
  /** Must match the `slug` of an article in TechnicalArticlesComponent */
  id: string;
  title: string;
  tag: string;
  date: string;
  readTime: string;
  /** Optional external URL. If set, it opens in a new tab instead of the modal */
  url?: string;
}

@Component({
  selector: 'app-portfolio-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterOutlet,
    ReactiveFormsModule,
    CoreCompetenciesComponent,
    FullstackAppsComponent,
    CommunityActivityComponent,
    TechnicalArticlesComponent,
    ContactMeComponent,
  ],
  templateUrl: './portfolio-switcher.component.html',
  styleUrls: ['./portfolio-switcher.component.scss'],
})
export class PortfolioSwitcherComponent implements OnInit, OnDestroy {
  // ---------- Popup state ----------
  /** null = no popup open */
  activeModal = signal<ModalSection | null>(null);
  isCommunityDetail = signal<boolean>(false);
  showVideoModal = signal<boolean>(false);

  // ---------- Collaboration notification ----------
  notificationVisible = false;
  notificationPulse = false;
  popupOpen = false;

  private notificationTimer?: ReturnType<typeof setTimeout>;
  private notificationDismissed = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private readonly notificationStorageKey =
    'collaboration_notification_dismissed';

  private readonly notificationMinDelayMs = 5000;
  private readonly notificationMaxDelayMs = 12000;

  // ---------- Hero stage ("slides" stepped with Next / Back) ----------
  slides: SlideMeta[] = [
    { id: 'intro', code: 'PF 001' },
    { id: 'video', code: 'PF 002' },
    // { id: 'hackathon', code: 'PF 003' },
    { id: 'articles', code: 'PF 004' },
  ];
  slideIndex = signal<number>(0);
  currentSlide = computed(() => this.slides[this.slideIndex()]);
  isLastSlide = computed(() => this.slideIndex() === this.slides.length - 1);
  progress = computed(() =>
    Math.round(((this.slideIndex() + 1) / this.slides.length) * 100),
  );

  // Links under the title (each opens a popup)
  navItems: NavItem[] = [
    { id: 'work', label: 'Domain Expertise', icon: 'token' },
    { id: 'fullstack', label: 'Proof of Work', icon: 'terminal' },
    { id: 'blogs', label: 'Blogs & Articles', icon: 'menu_book' },
    { id: 'connect', label: 'Connect with me', icon: 'diversity_3' },
  ];

  private routeSubscription?: Subscription;
  private queryParamSub?: Subscription;

  showGlobalContractNotice = signal<boolean>(true);
  resumeDownloaded = signal<boolean>(false);

  // Collaboration popup banner
  showCollabPopup = signal<boolean>(false);
  private readonly collabPopupDelayMs = 6000;
  private readonly collabPopupStorageKey = 'collab_popup_dismissed';
  private collabPopupTimer: ReturnType<typeof setTimeout> | null = null;
  private resumeToastTimer: ReturnType<typeof setTimeout> | null = null;
  private lockedScrollY = 0;

  // Contact links
  contactEmail = 'mr.shrikantshinde@gmail.com';
  resumeUrl = '/assets/resume.pdf';
  linkedinUrl = 'https://linkedin.com/in/';
  meetingUrl = 'https://calendly.com';

  /**
   * Where the "Tell me a bit about you" form is POSTed as JSON.
   * Replace with your real endpoint (Formspree, an Azure Function, your API...).
   * Leave it empty to fall back to opening the visitor's mail app.
   */
  contactEndpoint = 'https://formspree.io/f/YOUR_FORM_ID';

  // "Let's talk" box -> details popup
  draftMessage = signal<string>('');
  messageHint = signal<boolean>(false);
  showContactForm = signal<boolean>(false);
  submitStatus = signal<'idle' | 'sending' | 'success' | 'error'>('idle');
  submittedName = signal<string>('');

  contactForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    company: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl('', { nonNullable: true }),
    jobTitle: new FormControl('', { nonNullable: true }),
    engagementType: new FormControl('Contract', { nonNullable: true }),
    about: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    message: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    website: new FormControl('', { nonNullable: true }), // honeypot
  });
  currentYear = new Date().getFullYear();

  // Intro video
  introVideoId = 'YOUR_INTRO_VIDEO_ID';
  introVideoThumbnail =
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80';
  introVideoDuration = '2:00';
  introPlaying = signal<boolean>(false);

  activeModalVideoId = signal<string | null>(null);
  activeModalTitle = signal<string>('Introduction');

  sectionTitles: SectionCatalog = {
    home: {
      title: 'Portfolio Overview',
      subtitle: 'Summary of skills, enterprise systems, and proof of work',
    },
    work: {
      title: 'Domain Expertise',
      subtitle: 'The platforms, processes, and to ols I work with',
    },
    fullstack: {
      title: 'Proof of Work',
      subtitle: "Take a look at some of the solutions I've developed",
    },
    blogs: {
      title: 'Articles & Insights',
      subtitle:
        'Architectural perspectives on enterprise real estate technology',
    },
    community: {
      title: 'Community & Activity',
      subtitle:
        'Hackathons, proposed solutions, recent events and video walkthroughs',
    },
    connect: {
      title: 'Connect with me',
      subtitle: 'Tell me about your project or schedule a call',
    },
  };

  featured: HighlightItem = {
    kind: 'update',
    tag: 'Hackathon',
    title: 'Finalist at Beyond the Desk 2026',
    summary:
      'An automated reconciliation assistant that catches ledger imbalances before they reach the books during cutovers.',
    points: [
      'Flags imbalances during data cutovers',
      'Built on SQL Server validation checks',
      'Selected as a finalist',
    ],
    date: 'Mar 2026',
    image:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
    cta: 'Read more',
    section: 'community',
    tab: 'hackathons',
  };

  /** `id` must equal the `slug` of a native article in TechnicalArticlesComponent */
  latestArticles: LatestArticle[] = [
    {
      id: 'eliminating-ap-duplicates-payscan',
      title:
        'Eliminating AP Duplicates in High-Volume Yardi PayScan Deployments',
      tag: 'Yardi PayScan',
      date: 'Aug 2026',
      readTime: '12 min read',
    },
    {
      id: 'optimizing-custom-ysr-queries',
      title: 'Optimizing Custom YSR Columnar Queries Across 5,000+ Units',
      tag: 'Custom YSR',
      date: 'Jul 2026',
      readTime: '15 min read',
    },
  ];

  activeCommunityTab = signal<CommunityTab>('hackathons');

  constructor(private sanitizer: DomSanitizer) {
    // Lock page scroll while any popup is open
    effect(() => {
      const anyOpen =
        this.showVideoModal() ||
        this.activeModal() !== null ||
        this.showContactForm();
      if (anyOpen) {
        this.lockBodyScroll();
      } else {
        this.unlockBodyScroll();
      }
    });
  }

  private lockBodyScroll(): void {
    this.lockedScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.lockedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  }

  private unlockBodyScroll(): void {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, this.lockedScrollY);
  }

  ngOnInit(): void {
    this.syncDetailRoute();

    this.routeSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.syncDetailRoute());

    // Open Blogs & Articles whenever the URL carries ?article=<slug>
    // (first page load, browser Back/Forward, or in-page navigation)
    this.queryParamSub = this.route.queryParamMap.subscribe((params) => {
      const articleSlug = params.get('article');

      if (articleSlug) {
        if (this.activeModal() !== 'blogs') {
          this.openModal('blogs');
        }
      }
    });

    if (localStorage.getItem('global_contract_notice_dismissed')) {
      this.showGlobalContractNotice.set(false);
    }

    if (!sessionStorage.getItem(this.collabPopupStorageKey)) {
      this.collabPopupTimer = setTimeout(
        () => this.showCollabPopup.set(true),
        this.collabPopupDelayMs,
      );
    }
    // Show the notification only if the visitor has not dismissed it.
    this.notificationDismissed =
      sessionStorage.getItem(this.notificationStorageKey) === 'true';

    if (!this.notificationDismissed) {
      const delay =
        this.notificationMinDelayMs +
        Math.random() *
          (this.notificationMaxDelayMs - this.notificationMinDelayMs);

      this.notificationTimer = setTimeout(() => {
        if (!this.notificationDismissed) {
          this.notificationVisible = true;
          this.notificationPulse = true;
        }
      }, delay);
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.queryParamSub?.unsubscribe();
    if (this.resumeToastTimer) clearTimeout(this.resumeToastTimer);
    if (this.collabPopupTimer) clearTimeout(this.collabPopupTimer);
    if (this.notificationTimer) clearTimeout(this.notificationTimer);
    this.unlockBodyScroll();
  }

  // ---------- Popups ----------
  openModal(section: ModalSection): void {
    if (this.isCommunityDetail() && section !== 'community') {
      void this.router.navigateByUrl('/');
    }
    this.introPlaying.set(false);
    this.activeModal.set(section);
  }

  closeModal(): void {
    if (this.isCommunityDetail()) {
      void this.router.navigateByUrl('/');
    }
    this.activeModal.set(null);

    // Clear ?article= so a refresh (or the subscription) doesn't reopen the modal
    if (this.route.snapshot.queryParamMap.has('article')) {
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { article: null },
        queryParamsHandling: 'merge',
      });
    }
  }

  /** Dashboard tab: close any popup and return to the first slide */
  /** Close all overlays and return to the clean portfolio homepage. */
  goHome(): void {
    // Close all popup windows
    this.activeModal.set(null);
    this.showVideoModal.set(false);
    this.showContactForm.set(false);
    this.showCollabPopup.set(false);

    // Reset collaboration popup state
    this.popupOpen = false;

    // Reset route and video-related state
    this.isCommunityDetail.set(false);
    this.introPlaying.set(false);
    this.activeModalVideoId.set(null);

    // Return to the first portfolio slide
    this.slideIndex.set(0);

    // Navigate to the clean homepage.
    // This also removes ?article=<slug> from the URL.
    void this.router.navigateByUrl('/', {
      replaceUrl: true,
    });
  }

  // ---------- Hero stage ----------
  setSlide(index: number): void {
    this.introPlaying.set(false);
    this.slideIndex.set(index);
  }

  nextSlide(): void {
    this.setSlide(this.isLastSlide() ? 0 : this.slideIndex() + 1);
  }

  prevSlide(): void {
    if (this.slideIndex() > 0) this.setSlide(this.slideIndex() - 1);
  }

  // ---------- Misc UI ----------
  dismissNotice(): void {
    this.showGlobalContractNotice.set(false);
    localStorage.setItem('global_contract_notice_dismissed', 'true');
  }

  dismissCollabPopup(): void {
    this.showCollabPopup.set(false);
    if (this.collabPopupTimer) {
      clearTimeout(this.collabPopupTimer);
      this.collabPopupTimer = null;
    }
    sessionStorage.setItem(this.collabPopupStorageKey, 'true');
  }

  toggleCollaboration(): void {
    if (!this.notificationVisible || this.notificationDismissed) {
      return;
    }

    this.popupOpen = !this.popupOpen;

    if (this.popupOpen) {
      // The visitor has opened the notification.
      this.notificationPulse = false;
    }
  }

  closeCollaboration(): void {
    this.dismissCollaboration();
  }

  dismissCollaboration(): void {
    this.notificationDismissed = true;
    this.notificationVisible = false;
    this.notificationPulse = false;
    this.popupOpen = false;

    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
      this.notificationTimer = undefined;
    }

    sessionStorage.setItem(this.notificationStorageKey, 'true');
  }

  openHighlight(h: HighlightItem): void {
    if (h.kind === 'video' && h.videoId) {
      this.openVideo(h.videoId, h.title);
      return;
    }
    if (h.tab) this.setCommunityTab(h.tab);
    this.openModal((h.section as ModalSection) ?? 'community');
  }

  /**
   * Hero "latest articles" links.
   * External URL -> new tab. Otherwise set ?article=<id>; the queryParamMap
   * subscription opens the Blogs modal and TechnicalArticlesComponent opens the reader.
   */
  openArticle(article: LatestArticle): void {
    if (article.url) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
      return;
    }

    this.openModal('blogs');

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        article: article.id,
        entry: 'home',
      },
      queryParamsHandling: 'merge',
    });
  }

  showTopBanner(): boolean {
    const params = this.route.snapshot.queryParamMap;

    return params.has('article') && params.get('entry') !== 'home';
  }

  toggleVideoModal(state: boolean): void {
    this.showVideoModal.set(state);
  }

  setCommunityTab(tab: CommunityTab): void {
    this.activeCommunityTab.set(tab);
  }

  // ---------- "Let's talk" -> details popup -> endpoint ----------
  onDraft(value: string): void {
    this.draftMessage.set(value);
    if (value.trim()) this.messageHint.set(false);
  }

  /** Send button: needs a message first, then asks for the visitor's details */
  startContactForm(textarea: HTMLTextAreaElement): void {
    const text = this.draftMessage().trim();
    if (!text) {
      this.messageHint.set(true);
      textarea.focus();
      return;
    }
    this.contactForm.controls.message.setValue(text);
    this.submitStatus.set('idle');
    this.showContactForm.set(true);
  }

  closeContactForm(): void {
    this.showContactForm.set(false);
  }

  invalid(controlName: string): boolean {
    const c = this.contactForm.get(controlName);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  async submitContact(): Promise<void> {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    const v = this.contactForm.getRawValue();

    // Honeypot filled in => a bot. Pretend success, send nothing.
    if (v.website) {
      this.submitStatus.set('success');
      return;
    }

    const { website, ...fields } = v;
    const payload = {
      ...fields,
      _subject: `Portfolio enquiry from ${v.name} (${v.company})`,
      source: 'portfolio',
      submittedAt: new Date().toISOString(),
    };

    // No endpoint configured: fall back to the visitor's mail app
    if (!this.contactEndpoint) {
      const body = encodeURIComponent(
        Object.entries(fields)
          .map(([k, val]) => `${k}: ${val}`)
          .join('\n'),
      );
      window.location.href = `mailto:${this.contactEmail}?subject=${encodeURIComponent(payload._subject)}&body=${body}`;
      return;
    }

    this.submitStatus.set('sending');
    try {
      const res = await fetch(this.contactEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      this.submittedName.set(v.name);
      this.submitStatus.set('success');
      this.contactForm.reset();
      this.draftMessage.set('');
    } catch {
      this.submitStatus.set('error');
    }
  }

  handleResumeDownload(): void {
    this.resumeDownloaded.set(true);
    if (this.resumeToastTimer) clearTimeout(this.resumeToastTimer);
    this.resumeToastTimer = setTimeout(
      () => this.resumeDownloaded.set(false),
      6000,
    );

    const anchor = document.createElement('a');
    anchor.href = this.resumeUrl;
    anchor.download = 'Resume.pdf';
    anchor.click();
  }

  // ---------- Intro video ----------
  playIntro(): void {
    this.introPlaying.set(true);
  }

  stopIntro(): void {
    this.introPlaying.set(false);
  }

  getIntroEmbedUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${this.introVideoId}?autoplay=1&rel=0`,
    );
  }

  goFullscreen(el: HTMLElement): void {
    const anyEl = el as HTMLElement & {
      webkitRequestFullscreen?: () => void;
      msRequestFullscreen?: () => void;
    };
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (anyEl.webkitRequestFullscreen) {
      anyEl.webkitRequestFullscreen();
    } else if (anyEl.msRequestFullscreen) {
      anyEl.msRequestFullscreen();
    }
  }

  // ---------- Video popup ----------
  getYoutubeEmbedUrl(videoId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`,
    );
  }

  openVideo(videoId: string, title = 'Technical Walkthrough'): void {
    this.activeModalVideoId.set(videoId);
    this.activeModalTitle.set(title);
    this.toggleVideoModal(true);
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.showContactForm()) {
      this.closeContactForm();
    } else if (this.showVideoModal()) {
      this.toggleVideoModal(false);
    } else if (this.activeModal()) {
      this.closeModal();
    } else if (this.showCollabPopup()) {
      this.dismissCollabPopup();
    } else if (this.introPlaying()) {
      this.stopIntro();
    } else if (this.showGlobalContractNotice()) {
      this.dismissNotice();
    }
  }

  private syncDetailRoute(): void {
    const isDetail =
      /^\/community\/(hackathons|videos|solutions|events)\//.test(
        this.router.url,
      );

    this.isCommunityDetail.set(isDetail);

    if (isDetail) {
      this.activeModal.set('community');
      this.introPlaying.set(false);
    }
  }
}
