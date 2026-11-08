import type { Route } from "./+types/posts";
import PostsPage from "../pages/PostsPage";
import { pageMeta } from "../lib/meta";
import { getAuth, strapiErrorResponse } from "../lib/session.server";
import { listDrafts, listPosts } from "../lib/strapi.server";

export const meta: Route.MetaFunction = () => pageMeta("posts");

/** Published posts for everyone; never-published drafts too when logged in. */
export async function loader(args: Route.LoaderArgs) {
  const { request } = args;
  const auth = await getAuth(request);
  try {
    const [posts, drafts] = await Promise.all([
      listPosts(),
      auth ? listDrafts(auth.jwt) : Promise.resolve([]),
    ]);
    return { posts, drafts };
  } catch (error) {
    return strapiErrorResponse(error, args);
  }
}

export default function Posts({ loaderData }: Route.ComponentProps) {
  return <PostsPage posts={loaderData.posts} drafts={loaderData.drafts} />;
}
