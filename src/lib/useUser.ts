import { useRouteLoaderData } from "react-router";
import type { loader as rootLoader } from "../root";

/** The logged-in author, or null. Read from the root loader's data. */
export function useUser() {
  return useRouteLoaderData<typeof rootLoader>("root")?.user ?? null;
}
