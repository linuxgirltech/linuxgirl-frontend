import { useRef } from "react";

export type EditorView = "write" | "preview";

type Props = {
  view: EditorView;
  onView: (view: EditorView) => void;
  onFile: (file: File) => void;
};

/** Write/preview tabs (hidden on wide screens) and the ":r file.md" import. */
export default function EditorToolbar({ view, onView, onFile }: Props) {
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <div className="tabs" role="tablist">
      <button role="tab" aria-selected={view === "write"} onClick={() => onView("write")}>
        write
      </button>
      <button role="tab" aria-selected={view === "preview"} onClick={() => onView("preview")}>
        preview
      </button>

      <button className="load" onClick={() => fileInput.current?.click()}>
        :r file.md
      </button>
      <input
        ref={fileInput}
        type="file"
        accept=".md,.markdown,.txt,text/markdown"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = ""; // allow re-loading the same file
          if (file) onFile(file);
        }}
      />
    </div>
  );
}
