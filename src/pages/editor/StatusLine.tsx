import type { StatusMessage } from "./useSavePost";

type Props = {
  message: StatusMessage | null;
  dirty: boolean;
  state: "new" | "draft" | "live";
  content: string;
};

/** Vim-style status bar: last message or mode on the left, stats on the right. */
export default function StatusLine({ message, dirty, state, content }: Props) {
  const lines = content ? content.split("\n").length : 0;

  return (
    <div className="statusline" role="status">
      <span className={message?.error ? "error" : ""}>
        {message?.text ?? (dirty ? "-- INSERT -- [+]" : "-- NORMAL --")}
      </span>
      <span>
        {state} · {lines}L {content.length}B
      </span>
    </div>
  );
}
