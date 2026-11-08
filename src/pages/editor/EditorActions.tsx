type Props = {
  busy: boolean;
  isLive: boolean;
  canDelete: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
  onDelete: () => void;
};

export default function EditorActions({
  busy,
  isLive,
  canDelete,
  onSaveDraft,
  onPublish,
  onDelete,
}: Props) {
  return (
    <div className="actions">
      <button className="btn" disabled={busy} onClick={onSaveDraft} title="Ctrl+S">
        :w save draft
      </button>
      <button className="btn primary" disabled={busy} onClick={onPublish} title="Ctrl+Enter">
        :wq {isLive ? "update" : "publish"}
      </button>
      {canDelete && (
        <button className="btn danger" disabled={busy} onClick={onDelete}>
          :!rm delete
        </button>
      )}
    </div>
  );
}
