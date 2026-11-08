import type { Route } from "./+types/not-found";
import { pageMeta } from "../lib/meta";

export const meta: Route.MetaFunction = () => pageMeta("404");

/** Catch-all: hand off to the layout's error boundary as a real 404. */
export function loader() {
  throw new Response("Not found", { status: 404 });
}

export default function NotFound() {
  return null;
}
