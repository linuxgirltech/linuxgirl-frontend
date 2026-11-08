import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  // Pages: rendered inside the site header/footer.
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("posts", "routes/posts.tsx"),
    route("posts/:slug", "routes/post.tsx"),
    route("about", "routes/about.tsx"),
    route("login", "routes/login.tsx"),
    route("new", "routes/new.tsx"),
    route("edit/:slug", "routes/edit.tsx"),
    route("*", "routes/not-found.tsx"),
  ]),

  // Server-only endpoints (no UI).
  route("healthz", "routes/healthz.ts"),
  route("logout", "routes/logout.ts"),
  route("api/posts", "routes/api.posts.ts"),
  route("api/posts/:documentId", "routes/api.post.ts"),
] satisfies RouteConfig;
