// ── Visitor logging: Google Sheet webhook ──────────────────────────────────
//
// This is a static export with no backend, so submissions go straight to a
// Google Apps Script Web App that appends a row to a spreadsheet. See
// scripts/apps-script-webhook.gs for the script to deploy, and README.md /
// the setup notes for the deployment steps.
//
// The deployed Web App URL isn't a secret in the auth-token sense — it's a
// public endpoint meant to be called from client JS, same as any form
// action URL — so it's fine as a plain constant rather than a build secret.
// It's blank until deployed; every call below no-ops until it's filled in.
export const SHEETS_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbw2eqvPLJhpx8YB40nNBSvT2ncrT4UsqwvjgKNw-V0G4DGqCYbMxI_futv_zlQsbArapQ/exec";

export type VisitorEvent =
  | { type: "visit"; path: string; referrer: string }
  | {
      type: "identify";
      name: string;
      relationship: string;
      contactUrl: string;
      contactKind: "linkedin" | "github" | "email" | null;
      isOwner: boolean;
    };

/**
 * Fire-and-forget POST to the Sheet webhook. Apps Script Web Apps don't
 * return CORS headers a browser fetch can read, so this uses mode:"no-cors"
 * with a text/plain body — the standard workaround that avoids a failed
 * preflight (a JSON content-type would trigger one Apps Script can't answer).
 * The response is opaque either way, so there's nothing to await beyond
 * "the request went out" — never let a network hiccup here block the UI.
 */
export function logVisitorEvent(event: VisitorEvent) {
  if (!SHEETS_WEBHOOK_URL) return;
  try {
    fetch(SHEETS_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        ...event,
        ts: new Date().toISOString(),
        ua: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 200) : "",
      }),
    }).catch(() => {});
  } catch {
    // Analytics must never break the page.
  }
}
