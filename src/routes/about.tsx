import type { Route } from "./+types/about";
import AboutPage from "../pages/AboutPage";
import { pageMeta } from "../lib/meta";

export const meta: Route.MetaFunction = () => pageMeta("about");

export default function About() {
  return <AboutPage />;
}
