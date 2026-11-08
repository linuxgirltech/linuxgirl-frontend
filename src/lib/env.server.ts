/**
 * Server-side configuration. Values come from the process environment (set
 * them in Render's dashboard); a local frontend/.env is loaded if present.
 */
try {
  process.loadEnvFile(); // does not override variables that are already set
} catch {
  /* no .env file — fine */
}

const isProduction = process.env.NODE_ENV === "production";

function required(name: string, devFallback: string) {
  const value = process.env[name];
  if (value) return value;
  if (isProduction) throw new Error(`Missing required environment variable ${name}`);
  return devFallback;
}

/** Where the SSR server reaches Strapi. Never sent to the browser. */
export const STRAPI_URL = (process.env.STRAPI_URL ?? "http://localhost:1337").replace(/\/$/, "");

/** Signs the session cookie. Must be a long random string in production. */
export const SESSION_SECRET = required("SESSION_SECRET", "dev-only-insecure-session-secret");

export { isProduction };
