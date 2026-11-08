import type { Route } from "./+types/new";
import Editor from "../pages/editor/Editor";
import { pageMeta } from "../lib/meta";
import { requireAuth } from "../lib/session.server";

export const meta: Route.MetaFunction = () => pageMeta("new post");

export async function loader(args: Route.LoaderArgs) {
  await requireAuth(args);
  return null;
}

export default function NewPost() {
  return <Editor existing={null} />;
}
