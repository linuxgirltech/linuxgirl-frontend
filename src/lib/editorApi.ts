/**
 * Browser → this site's own server. The editor calls these; the server adds
 * the author's Strapi token from the session cookie and forwards the request.
 */
import type { Post, PostInput, SaveStatus } from "./types";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function call<T>(path: string, method: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      method,
      credentials: "same-origin",
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "can't reach the server");
  }

  if (res.status === 401) {
    // Session expired: log in again and come back here.
    location.assign(`/login?next=${encodeURIComponent(location.pathname)}`);
    throw new ApiError(401, "session expired");
  }
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, json?.error ?? `${res.status} ${res.statusText}`);
  return json as T;
}

export const createPost = (input: PostInput, status: SaveStatus) =>
  call<Post>("/api/posts", "POST", { input, status });

export const updatePost = (documentId: string, input: PostInput, status: SaveStatus) =>
  call<Post>(`/api/posts/${encodeURIComponent(documentId)}`, "PUT", { input, status });

export const deletePost = (documentId: string) =>
  call<{ ok: true }>(`/api/posts/${encodeURIComponent(documentId)}`, "DELETE");
