import { data, redirect } from "react-router";

import type { Route } from "./+types/login";
import LoginPage from "../pages/LoginPage";
import { pageMeta } from "../lib/meta";
import { createUserSession, getUser, safeRedirect } from "../lib/session.server";
import { login, StrapiError } from "../lib/strapi.server";

export const meta: Route.MetaFunction = () => pageMeta("login");

export async function loader({ request, url }: Route.LoaderArgs) {
  const next = safeRedirect(url.searchParams.get("next"), "/new");
  if (await getUser(request)) throw redirect(next);
  return { next };
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const identifier = String(form.get("identifier") ?? "");
  const password = String(form.get("password") ?? "");
  const next = safeRedirect(form.get("next"), "/new");

  let res: Awaited<ReturnType<typeof login>>;
  try {
    res = await login(identifier, password);
  } catch (error) {
    if (!(error instanceof StrapiError)) throw error; // real bug: let the error page show it
    console.error(`login failed: Strapi ${error.status} ${error.message}`);
    if (error.status === 400) return data({ error: "Login incorrect" }, { status: 400 });
    if (error.status === 429) {
      return data({ error: "login: too many attempts, wait a minute" }, { status: 429 });
    }
    const message =
      error.message === "can't reach the backend"
        ? "login: can't reach the backend"
        : `login: backend error (${error.status})`;
    return data({ error: message }, { status: 502 });
  }

  // Outside the try: a session failure is a bug, not a bad password.
  return createUserSession({ jwt: res.jwt, username: res.user.username }, next);
}

export default function Login({ loaderData, actionData }: Route.ComponentProps) {
  return <LoginPage next={loaderData.next} error={actionData?.error} />;
}
