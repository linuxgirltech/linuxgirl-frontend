import { STRAPI_URL } from "./env.server";
import type { EditablePost, Post, PostInput, PostSummary, SaveStatus } from "./types";

/** A failed Strapi call; `message` is safe to show to the author. */
export class StrapiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  { params, method = "GET", body, jwt }: {
    params?: URLSearchParams;
    method?: string;
    body?: unknown;
    jwt?: string;
  } = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const qs = params?.toString();
  let res: Response;
  try {
    res = await fetch(`${STRAPI_URL}/api/${path}${qs ? `?${qs}` : ""}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new StrapiError(502, "can't reach the backend");
  }

  if (res.status === 204) return undefined as T;
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new StrapiError(res.status, json?.error?.message ?? `${res.status} ${res.statusText}`);
  }
  return json as T;
}

const SUMMARY_FIELDS = ["title", "slug", "date", "excerpt"];

function summaryParams(extra: Record<string, string> = {}) {
  const params = new URLSearchParams({ sort: "date:desc", ...extra });
  SUMMARY_FIELDS.forEach((f, i) => params.append(`fields[${i}]`, f));
  params.set("pagination[pageSize]", "100");
  return params;
}

/* ── Reading ─────────────────────────────────────────────────── */

export async function listPosts(): Promise<PostSummary[]> {
  const { data } = await request<{ data: PostSummary[] }>("posts", { params: summaryParams() });
  return data;
}

/** Posts that have never been published (drafts of published posts excluded). */
export async function listDrafts(jwt: string): Promise<PostSummary[]> {
  const [drafts, published] = await Promise.all([
    request<{ data: PostSummary[] }>("posts", { params: summaryParams({ status: "draft" }), jwt }),
    listPosts(),
  ]);
  const live = new Set(published.map((p) => p.documentId));
  return drafts.data.filter((d) => !live.has(d.documentId));
}

/** Published post by slug, or the latest draft when a JWT is given. */
export async function getPost(slug: string, jwt?: string): Promise<Post> {
  const params = new URLSearchParams({ "filters[slug][$eq]": slug });
  if (jwt) params.set("status", "draft");
  const { data } = await request<{ data: Post[] }>("posts", { params, jwt });
  if (!data.length) throw new StrapiError(404, "Not found");
  return data[0];
}

export async function getPostForEdit(slug: string, jwt: string): Promise<EditablePost> {
  const draft = await getPost(slug, jwt);
  const params = new URLSearchParams({ "filters[documentId][$eq]": draft.documentId });
  params.set("fields[0]", "documentId");
  const { data } = await request<{ data: unknown[] }>("posts", { params });
  return { ...draft, isLive: data.length > 0 };
}

/* ── Writing ─────────────────────────────────────────────────── */

export async function createPost(jwt: string, input: PostInput, status: SaveStatus) {
  const { data } = await request<{ data: Post }>("posts", {
    method: "POST",
    params: new URLSearchParams({ status }),
    body: { data: input },
    jwt,
  });
  return data;
}

export async function updatePost(
  jwt: string,
  documentId: string,
  input: PostInput,
  status: SaveStatus,
) {
  const { data } = await request<{ data: Post }>(`posts/${encodeURIComponent(documentId)}`, {
    method: "PUT",
    params: new URLSearchParams({ status }),
    body: { data: input },
    jwt,
  });
  return data;
}

export async function deletePost(jwt: string, documentId: string) {
  await request(`posts/${encodeURIComponent(documentId)}`, { method: "DELETE", jwt });
}

/* ── Auth ────────────────────────────────────────────────────── */

export async function login(identifier: string, password: string) {
  return request<{ jwt: string; user: { username: string } }>("auth/local", {
    method: "POST",
    body: { identifier, password },
  });
}
