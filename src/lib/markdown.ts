export function slugify(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export type FrontMatter = Partial<Record<"title" | "slug" | "date" | "excerpt", string>>;

/**
 * Split an optional YAML-ish front matter block from a markdown file:
 *
 *   ---
 *   title: My post
 *   date: 2026-11-08
 *   ---
 *   body…
 *
 * Only flat `key: value` lines are understood, which is all a post needs.
 */
export function parseFrontMatter(source: string): { meta: FrontMatter; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  if (!match) return { meta: {}, body: source };

  const meta: FrontMatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^\s*(title|slug|date|excerpt)\s*:\s*(.*?)\s*$/i.exec(line);
    if (!kv) continue;
    const value = kv[2].replace(/^(['"])(.*)\1$/, "$2");
    meta[kv[1].toLowerCase() as keyof FrontMatter] = value;
  }
  return { meta, body: source.slice(match[0].length) };
}

/** Fallback title: first `# Heading` in the body. */
export function firstHeading(body: string) {
  return /^#\s+(.+)$/m.exec(body)?.[1].trim();
}
