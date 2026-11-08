import Layout from "../components/layout/Layout";
import ErrorPage from "../pages/ErrorPage";

export default function SiteLayout() {
  return <Layout />;
}

/** Errors in any page (404s, Strapi down) render inside the normal frame. */
export function ErrorBoundary() {
  return (
    <Layout>
      <ErrorPage />
    </Layout>
  );
}
