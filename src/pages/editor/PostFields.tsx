import type { PostInput } from "../../lib/types";

type Props = {
  form: PostInput;
  onField: <K extends keyof PostInput>(key: K, value: PostInput[K]) => void;
  onSlug: (value: string) => void;
  autoFocus?: boolean;
};

/** Title, slug, date and excerpt inputs. */
export default function PostFields({ form, onField, onSlug, autoFocus }: Props) {
  return (
    <div className="fields">
      <label className="field wide">
        <span>title</span>
        <input
          value={form.title}
          onChange={(e) => onField("title", e.target.value)}
          autoFocus={autoFocus}
        />
      </label>
      <label className="field">
        <span>slug</span>
        <input value={form.slug} onChange={(e) => onSlug(e.target.value)} />
      </label>
      <label className="field">
        <span>date</span>
        <input type="date" value={form.date} onChange={(e) => onField("date", e.target.value)} />
      </label>
      <label className="field wide">
        <span>excerpt</span>
        <input
          value={form.excerpt}
          maxLength={280}
          onChange={(e) => onField("excerpt", e.target.value)}
          placeholder="one line for the post list (optional)"
        />
      </label>
    </div>
  );
}
