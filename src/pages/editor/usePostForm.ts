import { useState } from "react";

import type { EditablePost, PostInput } from "../../lib/types";
import { firstHeading, parseFrontMatter, slugify } from "../../lib/markdown";

const today = () => new Date().toISOString().slice(0, 10);

function fromPost(post: EditablePost | null): PostInput {
  return post
    ? {
        title: post.title,
        slug: post.slug,
        date: post.date.slice(0, 10),
        excerpt: post.excerpt ?? "",
        content: post.content,
      }
    : { title: "", slug: "", date: today(), excerpt: "", content: "" };
}

/**
 * Form state for one post: field updates, slug auto-generation, importing a
 * markdown file, and tracking unsaved changes.
 */
export function usePostForm(existing: EditablePost | null) {
  const [form, setForm] = useState<PostInput>(() => fromPost(existing));
  const [saved, setSaved] = useState<PostInput>(form);
  // The slug follows the title until the author edits it by hand.
  const [slugTouched, setSlugTouched] = useState(Boolean(existing));

  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  function setField<K extends keyof PostInput>(key: K, value: PostInput[K]) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "title" && !slugTouched) next.slug = slugify(value);
      return next;
    });
  }

  function setSlug(value: string) {
    setSlugTouched(true);
    setField("slug", slugify(value));
  }

  /** Fill the form from a .md file; returns a status line for the editor. */
  async function loadFile(file: File): Promise<string> {
    const { meta, body } = parseFrontMatter(await file.text());
    setForm((f) => {
      const title =
        meta.title ||
        f.title ||
        firstHeading(body) ||
        file.name.replace(/\.(md|markdown|txt)$/i, "");
      return {
        title,
        slug: meta.slug ?? (slugTouched ? f.slug : slugify(title)),
        date: meta.date?.slice(0, 10) ?? f.date,
        excerpt: meta.excerpt ?? f.excerpt,
        content: body.replace(/^\s+/, ""),
      };
    });
    if (meta.slug) setSlugTouched(true);
    return `"${file.name}" ${body.split("\n").length}L read`;
  }

  /** Call after a successful save/delete so the form counts as clean. */
  const markSaved = () => setSaved(form);

  return { form, setField, setSlug, loadFile, dirty, markSaved };
}
