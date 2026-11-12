import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ArticleBlock, Span } from '../article.model';

/**
 * Draws a list of typed article blocks on one shared "breakout" grid.
 * Knows nothing about routing, search or sharing.
 * Requires Angular 17.1+ (signal inputs).
 */
@Component({
  selector: 'app-article-body',
  standalone: true,
  templateUrl: './article-body.component.html',
  styleUrls: ['./article-body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleBodyComponent {
  blocks = input.required<ArticleBlock[]>();

  private sanitizer = inject(DomSanitizer);
  private playing = signal<Set<string>>(new Set());

  isPlaying(id: string): boolean {
    return this.playing().has(id);
  }

  /** YouTube loads only after the visitor clicks the poster (facade). */
  play(id: string): void {
    this.playing.update((s) => new Set(s).add(id));
  }

  ytUrl(id: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`,
    );
  }

  span(s: Span | undefined, fallback: Span): string {
    return 'span-' + (s ?? fallback);
  }
}
