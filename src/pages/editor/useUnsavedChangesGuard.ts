import { useEffect } from "react";
import { useBlocker } from "react-router";

/**
 * Ask before leaving while `active` is true: confirms in-app navigation and
 * triggers the browser's own prompt on reload / tab close.
 */
export function useUnsavedChangesGuard(active: boolean) {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      active && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (blocker.state !== "blocked") return;
    if (confirm("E37: No write since last change. Leave anyway?")) blocker.proceed();
    else blocker.reset();
  }, [blocker]);

  useEffect(() => {
    if (!active) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    addEventListener("beforeunload", warn);
    return () => removeEventListener("beforeunload", warn);
  }, [active]);
}
