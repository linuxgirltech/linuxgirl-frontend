import { useState, type KeyboardEvent } from "react";

import Prompt from "../../components/Prompt";
import type { EditablePost } from "../../lib/types";
import EditorActions from "./EditorActions";
import EditorToolbar, { type EditorView } from "./EditorToolbar";
import MarkdownPanes from "./MarkdownPanes";
import PostFields from "./PostFields";
import StatusLine from "./StatusLine";
import { usePostForm } from "./usePostForm";
import { useSavePost } from "./useSavePost";
import { useUnsavedChangesGuard } from "./useUnsavedChangesGuard";
import "./Editor.css";

/** Markdown post editor. `existing` is null when writing a new post. */
export default function Editor({ existing }: { existing: EditablePost | null }) {
  const [view, setView] = useState<EditorView>("write");
  const { form, setField, setSlug, loadFile, dirty, markSaved } = usePostForm(existing);
  const { save, remove, busy, message, setMessage } = useSavePost(existing, form, markSaved);

  useUnsavedChangesGuard(dirty && !busy);

  // Ctrl/Cmd+S saves a draft, Ctrl/Cmd+Enter publishes.
  function onShortcut(e: KeyboardEvent) {
    if (!(e.ctrlKey || e.metaKey)) return;
    if (e.key === "s") {
      e.preventDefault();
      save("draft");
    } else if (e.key === "Enter") {
      e.preventDefault();
      save("published");
    }
  }

  const isLive = Boolean(existing?.isLive);

  return (
    <div className="editor" onKeyDown={onShortcut}>
      <Prompt path="~/posts" cmd={`vim ${form.slug || "untitled"}.md`} />

      <PostFields form={form} onField={setField} onSlug={setSlug} autoFocus={!existing} />

      <EditorToolbar
        view={view}
        onView={setView}
        onFile={async (file) => setMessage({ text: await loadFile(file) })}
      />
      <MarkdownPanes view={view} value={form.content} onChange={(v) => setField("content", v)} />

      <StatusLine
        message={message}
        dirty={dirty}
        state={isLive ? "live" : existing ? "draft" : "new"}
        content={form.content}
      />
      <EditorActions
        busy={busy}
        isLive={isLive}
        canDelete={Boolean(existing)}
        onSaveDraft={() => save("draft")}
        onPublish={() => save("published")}
        onDelete={remove}
      />
    </div>
  );
}
