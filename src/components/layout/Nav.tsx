import { Form, NavLink } from "react-router";
import { useUser } from "../../lib/useUser";

export default function Nav() {
  const user = useUser();

  return (
    <nav className="nav" aria-label="Main">
      <NavLink to="/" end>
        home
      </NavLink>
      <NavLink to="/posts">posts</NavLink>
      <NavLink to="/about">about</NavLink>
      {user && (
        <span className="nav-user">
          <NavLink to="/new">new</NavLink>
          <Form method="post" action="/logout">
            <button className="linklike" type="submit" title={`logged in as ${user.username}`}>
              logout
            </button>
          </Form>
        </span>
      )}
    </nav>
  );
}
