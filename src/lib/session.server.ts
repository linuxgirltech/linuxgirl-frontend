import { createCookieSessionStorage, redirect } from "react-router";

import { isProduction, SESSION_SECRET } from "./env.server";
import { StrapiError } from "./strapi.server";
import type { User } from "./types";

type SessionData = { jwt: string; username: string };

/**
 * The Strapi JWT lives in a signed, httpOnly cookie: page scripts can't read
 * it, and it's only ever used by this server when calling Strapi.
 */
const storage = createCookieSessionStorage<SessionData>({
  cookie: {
    name: "__session",
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // matches Strapi's default 30-day JWT lifetime
    secrets: [SESSION_SECRET],
  },
});

const getSession = (request: Request) => storage.getSession(request.headers.get("Cookie"));

/** Returns the JWT and author for a logged-in request, otherwise null. */
export async function getAuth(request: Request): Promise<(SessionData & { user: User }) | null> {
  const session = await getSession(request);
  const jwt = session.get("jwt");
  const username = session.get("username");
  return jwt && username ? { jwt, username, user: { username } } : null;
}

export async function getUser(request: Request): Promise<User | null> {
  return (await getAuth(request))?.user ?? null;
}

/**
 * Loader args we need. Use React Router's `url` (not `request.url`): in v8 the
 * raw request URL of a client-side navigation ends in `.data`.
 */
type RouteArgs = { request: Request; url: URL };

function loginUrl(url: URL) {
  return `/login?next=${encodeURIComponent(url.pathname + url.search)}`;
}

/** For loaders: send anonymous visitors to /login and back again after. */
export async function requireAuth({ request, url }: RouteArgs) {
  const auth = await getAuth(request);
  if (!auth) throw redirect(loginUrl(url));
  return auth;
}

export async function createUserSession(data: SessionData, redirectTo: string) {
  const session = await storage.getSession();
  session.set("jwt", data.jwt);
  session.set("username", data.username);
  return redirect(redirectTo, {
    headers: { "Set-Cookie": await storage.commitSession(session) },
  });
}

export async function destroySessionCookie(request: Request) {
  return storage.destroySession(await getSession(request));
}

/** Only allow same-site relative paths as post-login destinations. */
export function safeRedirect(to: FormDataEntryValue | string | null, fallback = "/") {
  if (typeof to !== "string" || !to.startsWith("/") || to.startsWith("//")) return fallback;
  return to;
}

/**
 * Turn a Strapi failure inside a loader into the right response: an expired
 * token logs the author out; anything else becomes an error page.
 */
export async function strapiErrorResponse(error: unknown, args: RouteArgs): Promise<never> {
  if (error instanceof StrapiError) {
    if (error.status === 401) {
      throw redirect(loginUrl(args.url), {
        headers: { "Set-Cookie": await destroySessionCookie(args.request) },
      });
    }
    throw new Response(error.message, { status: error.status });
  }
  throw error;
}
