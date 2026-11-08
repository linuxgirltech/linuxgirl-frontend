import "./Prompt.css";
import { SITE_NAME, SITE_USER } from "../config";

export default function Prompt({
  path = "~",
  cmd,
}: {
  path?: string;
  cmd: string;
}) {
  return (
    <p className="prompt" aria-hidden="true">
      <span className="user">
        {SITE_USER}@{SITE_NAME}
      </span>
      :<span className="path">{path}</span>$ <span className="cmd">{cmd}</span>
    </p>
  );
}
