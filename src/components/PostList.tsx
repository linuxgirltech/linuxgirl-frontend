import { Link } from "react-router";
import { formatDate, type PostSummary } from "../lib/types";
import "./PostList.css";

export default function PostList({
  posts,
  hrefFor = (p) => `/posts/${p.slug}`,
}: {
  posts: PostSummary[];
  hrefFor?: (post: PostSummary) => string;
}) {
  if (!posts.length) {
    return <p className="status">total 0 — nothing published yet.</p>;
  }
  return (
    <ul className="post-list">
      {posts.map((p) => (
        <li key={p.documentId}>
          <time dateTime={p.date}>{formatDate(p.date)}</time>
          <Link to={hrefFor(p)}>{p.title}</Link>
          {p.excerpt && <span className="excerpt">{p.excerpt}</span>}
        </li>
      ))}
    </ul>
  );
}
