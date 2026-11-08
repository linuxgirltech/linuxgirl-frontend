import type { Route } from "./+types/edit";
import Editor from "../pages/editor/Editor";
import { pageMeta } from "../lib/meta";
import { requireAuth, strapiErrorResponse } from "../lib/session.server";
import { getPostForEdit } from "../lib/strapi.server";

export const meta: Route.MetaFunction = ({ loaderData }) =>
  pageMeta(loaderData ? `edit ${loaderData.post.slug}` : "edit");

export async function loader(args: Route.LoaderArgs) {
  const { params } = args;
  const { jwt } = await requireAuth(args);
  try {
    return { post: await getPostForEdit(params.slug, jwt) };
  } catch (error) {
    return strapiErrorResponse(error, args);
  }
}

/** Keyed per document so moving between posts mounts a fresh editor. */
export default function EditPost({ loaderData }: Route.ComponentProps) {
  return <Editor key={loaderData.post.documentId} existing={loaderData.post} />;
}
