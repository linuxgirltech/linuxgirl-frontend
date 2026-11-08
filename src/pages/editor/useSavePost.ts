import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { ApiError, createPost, deletePost, updatePost } from "../../lib/editorApi";
import type { EditablePost, PostInput, SaveStatus } from "../../lib/types";

export type StatusMessage = { text: string; error?: boolean };

/**
 * Saves for the editor (draft, publish, delete) via this site's /api/posts
 * endpoints, which add the Strapi token server-side. Owns the busy flag and
 * the status-line message, and handles post-save navigation.
 */
export function useSavePost(
  existing: EditablePost | null,
  form: PostInput,
  markSaved: () => void,
) {
  const navigate = useNavigate();
  // A message handed over from the previous URL (e.g. /new → /edit/:slug).
  const flash = (useLocation().state as { flash?: string } | null)?.flash;

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<StatusMessage | null>(
    flash ? { text: flash } : null,
  );

  async function save(status: SaveStatus) {
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      setMessage({ text: "E32: title, slug and content are required", error: true });
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const post = existing
        ? await updatePost(existing.documentId, form, status)
        : await createPost(form, status);
      markSaved();

      if (status === "published") {
        navigate(`/posts/${post.slug}`, { replace: true });
        return;
      }
      const text = `"${post.slug}.md" written (draft)`;
      setMessage({ text });
      if (post.slug !== existing?.slug) {
        navigate(`/edit/${post.slug}`, { replace: true, state: { flash: text } });
      }
    } catch (err) {
      setMessage({
        text: err instanceof ApiError ? `E212: ${err.message}` : "E212: can't reach the backend",
        error: true,
      });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!existing || !confirm(`rm ${existing.slug}.md — delete this post for good?`)) return;
    setBusy(true);
    try {
      await deletePost(existing.documentId);
      markSaved();
      navigate("/posts", { replace: true });
    } catch (err) {
      setMessage({ text: err instanceof ApiError ? err.message : "delete failed", error: true });
      setBusy(false);
    }
  }

  return { save, remove, busy, message, setMessage };
}
