import type { Route } from "./+types/api.posts";
import { jsonError, parsePostBody, withAuthor } from "../lib/postApi.server";
import { createPost } from "../lib/strapi.server";

/** POST /api/posts — create a post (draft or published). */
export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") return jsonError(405, "method not allowed");
  return withAuthor(request, async (jwt) => {
    const body = await parsePostBody(request);
    if (body instanceof Response) return body;
    return Response.json(await createPost(jwt, body.input, body.status), { status: 201 });
  });
}

export function loader() {
  return jsonError(405, "method not allowed");
}
