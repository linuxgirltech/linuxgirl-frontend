import { SITE_DESCRIPTION, SITE_NAME } from "../config";

/** Standard <title>, description and Open Graph tags for a route's `meta`. */
export function pageMeta(title?: string, description?: string | null) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  const desc = description || SITE_DESCRIPTION;
  return [
    { title: fullTitle },
    { name: "description", content: desc },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: desc },
    { property: "og:site_name", content: SITE_NAME },
  ];
}
