import type { Route } from "./+types/api.post";
import { jsonError, parsePostBody, withAuthor } from "../lib/postApi.server";
import { deletePost, updatePost } from "../lib/strapi.server";

/** PUT /api/posts/:documentId updates; DELETE removes. */
export async function action({ request, params }: Route.ActionArgs) {
  const { documentId } = params;

  if (request.method === "PUT") {
    return withAuthor(request, async (jwt) => {
      const body = await parsePostBody(request);
      if (body instanceof Response) return body;
      return Response.json(await updatePost(jwt, documentId, body.input, body.status));
    });
  }

  if (request.method === "DELETE") {
    return withAuthor(request, async (jwt) => {
      await deletePost(jwt, documentId);
      return Response.json({ ok: true });
    });
  }

  return jsonError(405, "method not allowed");
}

export function loader() {
  return jsonError(405, "method not allowed");
}
