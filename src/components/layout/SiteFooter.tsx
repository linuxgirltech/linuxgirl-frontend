import { Link } from "react-router";

import { useUser } from "../../lib/useUser";
import { SITE_NAME } from "../../config";

const YEAR = new Date().getFullYear();

export default function SiteFooter() {
  const user = useUser();

  return (
    <footer className="site-footer">
      © {YEAR} {SITE_NAME} · [process exited with code 0]
      {!user && (
        <>
          {" "}
          · <Link to="/login">login</Link>
        </>
      )}
    </footer>
  );
}
