export const STATUSES = [
  "draft",
  "submitted",
  "under_review",
  "changes_requested",
  "approved",
  "rejected",
  "published",
  "archived",
] as const;

export type Status = (typeof STATUSES)[number];

export const ROLES = ["reader", "author", "editor", "admin"] as const;
export type Role = (typeof ROLES)[number];

export type Person = { slug: string; name: string };
export type Category = { slug: string; name: string };

export type FileMeta = {
  id: string;
  kind: "pdf" | "epub" | "cover";
  mime: string;
  byteSize: number;
  sha256: string;
  originalName: string;
};

export type Chapter = {
  id: string;
  position: number;
  title: string;
  body: string;
};

export type BookCard = {
  id: string;
  slug: string;
  title: string;
  synopsis: string;
  language: string;
  status: Status;
  allowDownload: boolean;
  isDemonstrative: boolean;
  publishedAt: string | null;
  authors: Person[];
  categories: Category[];
  coverUrl: string | null;
};

export type BookDetail = BookCard & {
  editorNote: string;
  locked: boolean;
  isOwner: boolean;
  files: FileMeta[];
  chapters: Chapter[];
};

export type AuthorCard = {
  slug: string;
  name: string;
  bio: string;
  isDemonstrative: boolean;
  publishedCount: number;
};

export type AuthorDetail = AuthorCard & { books: BookCard[] };

export type CreateBookInput = {
  title: string;
  synopsis: string;
  categorySlug: string;
  allowDownload: boolean;
  rightsHolder: string;
  rightsStatement: string;
  rightsConfirmed: boolean;
};

export type MyBook = BookCard & {
  editorNote: string;
  locked: boolean;
  files: FileMeta[];
};

export type ProgressItem = {
  slug: string;
  title: string;
  locator: string;
  progressPct: number;
  updatedAt: string;
};

export type BookmarkItem = {
  id: string;
  slug: string;
  title: string;
  locator: string;
  note: string;
  createdAt: string;
};

export type AccountSnapshot = {
  displayName: string;
  email: string;
  bio: string;
  role: Role;
  needsBootstrap: boolean;
  progress: ProgressItem[];
  bookmarks: BookmarkItem[];
  books: { slug: string; title: string; status: Status; editorNote: string }[];
};

export type NoticeStatus = "open" | "reviewing" | "resolved" | "dismissed";

export type NoticeItem = {
  id: string;
  bookSlug: string | null;
  bookTitle: string | null;
  claimantName: string;
  contactEmail: string;
  workReference: string;
  statement: string;
  status: NoticeStatus;
  staffNote: string;
  createdAt: string;
};

export type AuditItem = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  fromStatus: string | null;
  toStatus: string | null;
  detail: string;
  createdAt: string;
  actorId: string;
};

export type TeamMember = {
  userId: string;
  displayName: string;
  email: string;
  role: Role;
};

export type AdminDesk =
  | { state: "bootstrap" }
  | { state: "forbidden"; role: Role }
  | {
      state: "ready";
      role: Role;
      counts: { published: number; queue: number; readers: number };
      queue: (BookCard & { editorNote: string; locked: boolean; isOwner: boolean })[];
      published: BookCard[];
      audit: AuditItem[];
      notices: NoticeItem[];
      team: TeamMember[];
    };
