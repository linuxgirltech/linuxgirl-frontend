import { isRouteErrorResponse, Link, useLocation, useRouteError } from "react-router";
import Prompt from "../components/Prompt";

export default function ErrorPage() {
  const error = useRouteError();
  const { pathname } = useLocation();
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <>
      <Prompt cmd={notFound ? `cd ${pathname}` : "./load"} />
      <p className="status error">
        {notFound
          ? `zsh: cd: ${pathname}: No such file or directory`
          : "error: couldn't reach the backend. Is Strapi running?"}
      </p>
      <Link to="/">cd ~</Link>
    </>
  );
}
