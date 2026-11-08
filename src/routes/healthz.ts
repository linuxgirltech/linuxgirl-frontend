/**
 * GET /healthz — Render's health check. Deliberately doesn't call Strapi, so a
 * backend hiccup doesn't make Render restart a healthy frontend.
 */
export function loader() {
  return new Response("ok", { headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" } });
}
