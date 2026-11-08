import { redirect } from "react-router";

import type { Route } from "./+types/logout";
import { destroySessionCookie } from "../lib/session.server";

/** POST /logout clears the session cookie. */
export async function action({ request }: Route.ActionArgs) {
  return redirect("/", { headers: { "Set-Cookie": await destroySessionCookie(request) } });
}

/** Visiting /logout directly does nothing harmful: just go home. */
export function loader() {
  return redirect("/");
}
