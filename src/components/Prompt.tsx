import "./Prompt.css";
import { SITE_NAME, SITE_USER } from "../config";
import { useUser } from "../lib/useUser";

export default function Prompt({
  path = "~",
  cmd,
}: {
  path?: string;
  cmd: string;
}) {
  const user = useUser();
  const promptUser = user ? SITE_USER : "visitor";

  return (
    <p className="prompt" aria-hidden="true">
      <span className="user">
        {promptUser}@{SITE_NAME}
      </span>
      :<span className="path">{path}</span>$ <span className="cmd">{cmd}</span>
    </p>
  );
}
