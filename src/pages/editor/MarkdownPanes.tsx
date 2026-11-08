import type { KeyboardEvent } from "react";

import MarkdownView from "../../components/MarkdownView";
import type { EditorView } from "./EditorToolbar";

type Props = {
  view: EditorView;
  value: string;
  onChange: (value: string) => void;
};

const PLACEHOLDER =
  "# Write markdown here\n\nOr load a .md file — front matter (title, date, slug, excerpt) is picked up.";

/** Markdown source and live preview; side by side on wide screens. */
export default function MarkdownPanes({ view, value, onChange }: Props) {
  // Tab inserts two spaces instead of leaving the textarea.
  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Tab" || e.shiftKey) return;
    e.preventDefault();
    const el = e.currentTarget;
    const { selectionStart: start, selectionEnd: end } = el;
    onChange(value.slice(0, start) + "  " + value.slice(end));
    requestAnimationFrame(() => el.setSelectionRange(start + 2, start + 2));
  }

  return (
    <div className={`panes show-${view}`}>
      <textarea
        className="pane source"
        aria-label="Markdown content"
        spellCheck
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={PLACEHOLDER}
      />
      <div className="pane preview" aria-label="Preview">
        {value.trim() ? (
          <MarkdownView source={value} />
        ) : (
          <p className="status">~ nothing to preview</p>
        )}
      </div>
    </div>
  );
}
