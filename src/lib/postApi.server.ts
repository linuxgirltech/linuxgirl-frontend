/**
 * Shared plumbing for the /api/posts endpoints the editor calls: same-origin
 * checks, session auth, strict input parsing, and JSON errors.
 */
import { destroySessionCookie, getAuth } from "./session.server";
import { StrapiError } from "./strapi.server";
import type { PostInput, SaveStatus } from "./types";

export function jsonError(status: number, error: string, headers?: HeadersInit) {
  return Response.json({ error }, { status, headers });
}

/**
 * Reject cross-site requests. The session cookie is SameSite=Lax (not sent on
 * cross-site POST/PUT/DELETE) — this is a second, explicit check.
 */
function isSameOrigin(request: Request) {
  const origin = request.headers.get("Origin");
  if (!origin) return true; // same-origin fetches may omit it; Lax cookie still applies
  try {
    return new URL(origin).host === request.headers.get("Host");
  } catch {
    return false;
  }
}

const FIELDS = ["title", "slug", "date", "excerpt", "content"] as const;

/** Accept only the known post fields, as strings, so nothing else reaches Strapi. */
export async function parsePostBody(
  request: Request,
): Promise<{ input: PostInput; status: SaveStatus } | Response> {
  if (!request.headers.get("Content-Type")?.includes("application/json")) {
    return jsonError(415, "expected application/json");
  }
  const body = (await request.json().catch(() => null)) as {
    input?: Record<string, unknown>;
    status?: unknown;
  } | null;
  if (!body?.input || (body.status !== "draft" && body.status !== "published")) {
    return jsonError(400, "malformed request");
  }
  const input = {} as PostInput;
  for (const key of FIELDS) {
    const value = body.input[key] ?? "";
    if (typeof value !== "string") return jsonError(400, `${key} must be text`);
    input[key] = value;
  }
  return { input, status: body.status };
}

/**
 * Run `fn` with the author's Strapi JWT, mapping auth and Strapi failures to
 * JSON responses the editor understands.
 */
export async function withAuthor(
  request: Request,
  fn: (jwt: string) => Promise<Response>,
): Promise<Response> {
  if (!isSameOrigin(request)) return jsonError(403, "cross-site request refused");
  const auth = await getAuth(request);
  if (!auth) return jsonError(401, "not logged in");
  try {
    return await fn(auth.jwt);
  } catch (error) {
    if (error instanceof StrapiError) {
      if (error.status === 401) {
        return jsonError(401, "session expired", {
          "Set-Cookie": await destroySessionCookie(request),
        });
      }
      return jsonError(error.status, error.message);
    }
    throw error;
  }
}
