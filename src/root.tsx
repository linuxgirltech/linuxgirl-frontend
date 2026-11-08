import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { getUser } from "./lib/session.server";
import { SITE_NAME } from "./config";
import "./styles/base.css";
import "./styles/forms.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  {
    rel: "preload",
    href: "/fonts/IosevkaTerm-Regular.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
];

/** Who's logged in, for the nav and edit links (null for visitors). */
export async function loader({ request }: Route.LoaderArgs) {
  return { user: await getUser(request) };
}

/** The HTML document shell, rendered on the server for every page. */
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0c0a" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

/** Last-resort error page if even the root loader fails. */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const status = isRouteErrorResponse(error) ? error.status : 500;
  return (
    <main className="shell">
      <title>{`error — ${SITE_NAME}`}</title>
      <p className="status error">
        [{status}] {SITE_NAME} failed to start. Try again in a moment.
      </p>
    </main>
  );
}
