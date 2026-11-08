import type { Config } from "@react-router/dev/config";

/**
 * Hosts allowed to submit forms (login, logout) to this site.
 *
 * React Router rejects a form POST whose `Origin` doesn't match the URL the
 * server sees (CSRF protection). Behind Render/Cloudflare, TLS ends at the
 * proxy, so the server sees `http://linuxgirl.tech` while the browser sends
 * `Origin: https://linuxgirl.tech` — and every login fails with 400.
 *
 * List exact hostnames only. A wildcard like "*.onrender.com" would let any
 * site hosted on Render submit forms here.
 */
const allowedActionOrigins = [
  "linuxgirl.tech",
  "www.linuxgirl.tech",
  // The service's own *.onrender.com hostname (Render sets this at build time).
  process.env.RENDER_EXTERNAL_HOSTNAME,
].filter((host): host is string => Boolean(host));

export default {
  appDirectory: "src",
  ssr: true,
  allowedActionOrigins,
} satisfies Config;
