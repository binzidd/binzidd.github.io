"use client";

import { useEffect } from "react";
import { logVisitorEvent } from "@/lib/visitorWebhook";

// Logs one "visit" per session, independent of whether the visitor fills in
// or skips the identification step in IntroLoader — a raw traffic count
// shouldn't depend on someone completing a form.
export default function VisitLogger() {
  useEffect(() => {
    if (sessionStorage.getItem("visitLogged")) return;
    sessionStorage.setItem("visitLogged", "1");
    logVisitorEvent({
      type: "visit",
      path: window.location.pathname,
      referrer: document.referrer,
    });
  }, []);

  return null;
}
