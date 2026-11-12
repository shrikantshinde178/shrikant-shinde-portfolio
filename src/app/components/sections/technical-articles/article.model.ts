/**
 * native   -> full text lives on YOUR site, opens inline
 * medium   -> cross-post; card opens the Medium page in a new tab
 * linkedin -> LinkedIn post/article; card opens LinkedIn in a new tab
 */
export type ArticleSource = 'native' | 'medium' | 'linkedin';

/** '' = blank option (behaves like "newest") */
export type SortKey = '' | 'newest' | 'oldest' | 'title';

/**
 * How wide a block wants to be inside the article grid.
 * content -> readable text column (700px)
 * wide    -> text column + 120px each side
 * full    -> full width of the reader
 */
export type Span = 'content' | 'wide' | 'full';

export interface Media {
  src: string;
  alt: string;
  /** intrinsic width in px (reserves space, prevents layout shift) */
  w: number;
  /** intrinsic height in px */
  h: number;
  caption?: string;
}

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'image'; img: Media; span?: Span }
  | {
      type: 'gallery';
      layout: '2up' | '3up' | 'mosaic';
      images: Media[];
      span?: Span;
    }
  | {
      type: 'video';
      src: string;
      poster: string;
      w: number;
      h: number;
      caption?: string;
      span?: Span;
    }
  | {
      type: 'youtube';
      id: string;
      poster: string;
      caption?: string;
      span?: Span;
    }
  | { type: 'audio'; src: string; title: string }
  | { type: 'quote'; text: string; by?: string }
  | { type: 'callout'; tone: 'info' | 'tip' | 'warn'; text: string }
  | { type: 'code'; lang: string; text: string }
  | { type: 'stats'; items: { value: string; label: string }[] }
  /** Big hero image with title overlay. Defaults to full width. */
  | {
      type: 'banner';
      img: Media;
      title: string;
      subtitle?: string;
      label?: string;
      span?: Span;
    }
  /** Row of small tag chips, e.g. ['SQL Server', 'Indexing'] */
  | { type: 'labels'; items: string[] }
  /** Image next to text. flip=true puts the image on the right. */
  | {
      type: 'split';
      img: Media;
      title?: string;
      text: string;
      flip?: boolean;
      span?: Span;
    }
  /** Numbered process. Only use for real sequences. */
  | { type: 'steps'; items: { title: string; text: string }[] }
  | { type: 'list'; style: 'bullet' | 'check'; items: string[] }
  | { type: 'divider' };

export interface TechnicalArticle {
  id: string;
  slug: string; // used in the share link: ?article=<slug>
  title: string;
  readTime: string;
  date: string; // display, e.g. "Aug 2026"
  categoryTag: string;
  summary: string;
  tags?: string[];
  imageUrl?: string;
  source: ArticleSource;
  /** New rich format. Takes priority over `content` when present. */
  blocks?: ArticleBlock[];
  /** Old plain-paragraph format. Still supported. */
  content?: string[];
  externalUrl?: string;
}
