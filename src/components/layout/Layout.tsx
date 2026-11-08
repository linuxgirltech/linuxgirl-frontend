import type { ReactNode } from "react";
import { Outlet, useNavigation } from "react-router";

import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import "./Layout.css";

/**
 * Page frame shared by every page: header, main content, footer.
 * Renders the matched route, or `children` (used by the error boundary).
 */
export default function Layout({ children }: { children?: ReactNode }) {
  const busy = useNavigation().state === "loading";

  return (
    <div className="shell">
      <SiteHeader />
      <main aria-busy={busy}>{children ?? <Outlet />}</main>
      <SiteFooter />
    </div>
  );
}
