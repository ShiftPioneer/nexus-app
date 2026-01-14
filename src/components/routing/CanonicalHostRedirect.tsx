import { useEffect } from "react";

const CANONICAL_HOST = "nexus-app.lovable.app";

/**
 * Auth sessions are scoped per-domain (browser storage + cookies), so using multiple
 * domains (Lovable subdomain, Vercel subdomain, custom domain) will feel like
 * “different accounts” and break cross-device sync.
 *
 * This component forces a single canonical host in production to keep auth + data consistent.
 */
export function CanonicalHostRedirect() {
  useEffect(() => {
    // Avoid redirect loops in preview/dev environments
    if (import.meta.env.MODE !== "production") return;

    const host = window.location.host;
    const shouldRedirectFromVercel = host.endsWith("vercel.app");

    if (!shouldRedirectFromVercel) return;
    if (host === CANONICAL_HOST) return;

    const target = `https://${CANONICAL_HOST}${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.location.replace(target);
  }, []);

  return null;
}
