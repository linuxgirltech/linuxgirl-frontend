import type { Route } from "./+types/home";
import HomePage from "../pages/HomePage";
import { pageMeta } from "../lib/meta";
import { strapiErrorResponse } from "../lib/session.server";
import { listPosts } from "../lib/strapi.server";

export const meta: Route.MetaFunction = () => pageMeta();

export async function loader(args: Route.LoaderArgs) {
  try {
    return { posts: await listPosts() };
  } catch (error) {
    return strapiErrorResponse(error, args);
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <HomePage posts={loaderData.posts} />;
}
