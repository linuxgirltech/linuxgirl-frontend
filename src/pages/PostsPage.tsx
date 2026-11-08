import PostList from "../components/PostList";
import Prompt from "../components/Prompt";
import type { PostSummary } from "../lib/types";

type Props = { posts: PostSummary[]; drafts: PostSummary[] };

export default function PostsPage({ posts, drafts }: Props) {
  return (
    <>
      <Prompt path="~/posts" cmd="ls -lt" />
      <PostList posts={posts} />

      {drafts.length > 0 && (
        <section className="drafts">
          <Prompt path="~/posts" cmd="ls -lt .drafts/" />
          <PostList posts={drafts} hrefFor={(p) => `/edit/${p.slug}`} />
        </section>
      )}
    </>
  );
}
