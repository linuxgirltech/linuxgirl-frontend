import { Link } from "react-router";

import MarkdownView from "../components/MarkdownView";
import Prompt from "../components/Prompt";
import { formatDate, type Post } from "../lib/types";
import { useUser } from "../lib/useUser";
import "./PostPage.css";

export default function PostPage({ post }: { post: Post }) {
  const user = useUser();

  return (
    <article className="post">
      <Prompt path="~/posts" cmd={`cat ${post.slug}.md`} />

      <h1>{post.title}</h1>
      <p className="meta">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </p>

      <MarkdownView source={post.content} />

      <p className="post-nav">
        <Link to="/posts">← cd ..</Link>
        {user && <Link to={`/edit/${post.slug}`}>vim {post.slug}.md</Link>}
      </p>
    </article>
  );
}
