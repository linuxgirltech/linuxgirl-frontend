import { Link } from "react-router";

import Nav from "./Nav";
import { SITE_NAME, SITE_TAGLINE } from "../../config";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <h1 className="site-title">
        <Link to="/">{SITE_NAME}</Link>
        <span className="cursor" aria-hidden="true" />
      </h1>
      <p className="tagline"># {SITE_TAGLINE}</p>
      <Nav />
    </header>
  );
}
