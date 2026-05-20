"use client";

import * as React from "react";

// Client-side beacon: when a recipient lands on the case study with a valid
// one-time token, this component fires a single POST to /api/burn-share-token
// after the page has rendered. The burn is best-effort — if the API call
// fails the token stays usable, and you can re-trigger by viewing the page
// again. The component renders nothing.
export function BurnBeacon({ id }: { id: string }) {
  const firedRef = React.useRef(false);
  React.useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    fetch("/api/burn-share-token", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
      // The page has already rendered; we don't need to await this.
      keepalive: true,
    }).catch(() => {
      // Network errors are ignored — the burn will be retried on the next
      // view, which is fine because one-time tokens are short-lived anyway.
    });
  }, [id]);
  return null;
}
