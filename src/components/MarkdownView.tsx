import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./MarkdownView.css";

/** Renders GitHub-flavoured markdown with the site's terminal styling. */
export default function MarkdownView({ source }: { source: string }) {
  return (
    <div className="markdown">
      <Markdown remarkPlugins={[remarkGfm]}>{source}</Markdown>
    </div>
  );
}
