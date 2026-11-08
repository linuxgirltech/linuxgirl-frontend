import { Link } from "react-router";

import PostList from "../components/PostList";
import Prompt from "../components/Prompt";
import type { PostSummary } from "../lib/types";

const RECENT = 5;

export default function HomePage({ posts }: { posts: PostSummary[] }) {
  return (
    <>
      <Prompt cmd={`ls -lt posts/ | head -${RECENT}`} />
      <PostList posts={posts.slice(0, RECENT)} />
      {posts.length > RECENT && (
        <p>
          <Link to="/posts">… {posts.length - RECENT} more</Link>
        </p>
      )}
    </>
  );
}
