/** Shared between server and browser code. No secrets, no Node APIs. */

export type PostSummary = {
  documentId: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string | null;
};

export type Post = PostSummary & { content: string };

/** Latest (draft) version of a post plus whether a published version exists. */
export type EditablePost = Post & { isLive: boolean };

export type PostInput = {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
};

export type SaveStatus = "draft" | "published";

/** The logged-in author as the browser sees it (the JWT stays on the server). */
export type User = { username: string };

export function formatDate(iso: string) {
  return iso.slice(0, 10);
}
