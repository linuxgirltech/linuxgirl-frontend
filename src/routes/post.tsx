import type { Route } from "./+types/post";
import PostPage from "../pages/PostPage";
import { pageMeta } from "../lib/meta";
import { strapiErrorResponse } from "../lib/session.server";
import { getPost } from "../lib/strapi.server";

export const meta: Route.MetaFunction = ({ loaderData }) =>
  loaderData
    ? [
        ...pageMeta(loaderData.post.title, loaderData.post.excerpt),
        { property: "og:type", content: "article" },
        { property: "article:published_time", content: loaderData.post.date },
      ]
    : pageMeta("404");

export async function loader(args: Route.LoaderArgs) {
  const { params } = args;
  try {
    return { post: await getPost(params.slug) };
  } catch (error) {
    return strapiErrorResponse(error, args);
  }
}

export default function Post({ loaderData }: Route.ComponentProps) {
  return <PostPage post={loaderData.post} />;
}
