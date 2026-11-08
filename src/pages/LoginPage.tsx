import { Form, useNavigation } from "react-router";

import Prompt from "../components/Prompt";
import { SITE_NAME } from "../config";
import "./LoginPage.css";

type Props = { next: string; error?: string };

/** Plain HTML form posted to the login route's action — works without JS. */
export default function LoginPage({ next, error }: Props) {
  const busy = useNavigation().state === "submitting";

  return (
    <>
      <Prompt cmd="login" />
      <Form method="post" className="tty-form" replace>
        <input type="hidden" name="next" value={next} />
        <label>
          <span>{SITE_NAME} login:</span>
          <input name="identifier" autoFocus autoComplete="username" required />
        </label>
        <label>
          <span>Password:</span>
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        {error && (
          <p className="status error" role="alert">
            {error}
          </p>
        )}
        <button className="btn" type="submit" disabled={busy}>
          {busy ? "authenticating…" : "[ enter ]"}
        </button>
      </Form>
    </>
  );
}
