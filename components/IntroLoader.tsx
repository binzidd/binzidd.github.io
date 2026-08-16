"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logVisitorEvent } from "@/lib/visitorWebhook";

// ── Boot sequence lines ──────────────────────────────────────────────────────────
const BOOT_LINES = [
  { text: "BIOS v9.0.0  —  BINAY SIDDHARTH PORTFOLIO", bright: true,  delay: 0    },
  { text: "RAM check: 12 yrs analytics ... OK",         bright: false, delay: 200  },
  { text: "Loading kernel modules:",                     bright: false, delay: 390  },
  { text: "  [  OK  ] data_analytics.core",             bright: false, delay: 530  },
  { text: "  [  OK  ] people_leadership.mod (6+ yrs)",  bright: false, delay: 650  },
  { text: "  [  OK  ] genai_engineering.mod (2,000+ usr)",bright: false, delay: 770  },
  { text: "  [  OK  ] aws_certs.mod (×3 certified)",    bright: false, delay: 890  },
  { text: "  [  OK  ] agentic_ai.mod",                  bright: false, delay: 990  },
  { text: "Mounting filesystems ... done",              bright: false, delay: 1120 },
  { text: "Network: Sydney, AU  //  data & GenAI",      bright: false, delay: 1280 },
  { text: "System ready.",                              bright: true,  delay: 1460 },
] as const;

const BOOT_TOTAL_MS = 1800;

// ASCII progress bar
function progressBar(pct: number): string {
  const W = 24;
  const filled = Math.round(pct * W);
  return "[" + "█".repeat(filled) + "░".repeat(W - filled) + "]  " + Math.round(pct * 100) + "%";
}

// ── Steps ────────────────────────────────────────────────────────────────────
type Step = "boot" | "name" | "thanks";

const CRUMBS: { key: Step; label: string }[] = [
  { key: "boot",   label: "Init"     },
  { key: "name",   label: "Identify" },
  { key: "thanks", label: "Launch"   },
];

const STEP_ORDER: Step[] = ["boot", "name", "thanks"];

// Lightweight shape-check, not live verification — a static site can't
// resolve whether a profile actually exists without a backend to proxy the
// request through (and CORS blocks that from client JS anyway). This just
// keeps out empty/junk entries and confirms it's a LinkedIn/GitHub profile
// link or a plausible email, which is "verification" at the static-site
// ceiling.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function contactKind(value: string): "linkedin" | "github" | "email" | null {
  const v = value.trim().toLowerCase();
  if (!v) return null;
  if (/linkedin\.com\/(in|company)\//.test(v)) return "linkedin";
  if (/github\.com\/[a-z0-9-]+/i.test(v)) return "github";
  if (EMAIL_RE.test(value.trim())) return "email";
  return null;
}

const RELATIONSHIPS: { value: string; label: string }[] = [
  { value: "friend",     label: "Friend of Binay" },
  { value: "recruiter",  label: "Recruiter" },
  { value: "researcher", label: "Researcher" },
  { value: "other",      label: "Other" },
];

// ── Component ────────────────────────────────────────────────────────────────────
export default function IntroLoader() {
  const [mounted,    setMounted]    = useState(false);
  const [visible,    setVisible]    = useState(true);
  const [step,       setStep]       = useState<Step>("boot");
  const [bootLines,  setBootLines]  = useState<number>(0);   // how many lines shown
  const [progress,   setProgress]   = useState(0);           // 0–1
  const [nameVal,      setNameVal]      = useState("");
  const [relationship, setRelationship] = useState("");
  const [contactUrl,   setContactUrl]   = useState("");
  const [vName,      setVName]      = useState("");
  const [exiting,    setExiting]    = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const isOwner = nameVal.trim().toLowerCase().includes("binay");
  const contactMatch = contactKind(contactUrl);
  const canLaunch = nameVal.trim() !== "" && (isOwner || (relationship !== "" && contactMatch !== null));

  // ── Session gate ────────────────────────────────────────────────────
  useEffect(() => {
    if (sessionStorage.getItem("introShown")) {
      setVisible(false);
    } else {
      setMounted(true);
    }
  }, []);

  // ── Boot sequence: reveal lines + progress bar ──────────────────────────────────
  useEffect(() => {
    if (!mounted || step !== "boot") return;

    // Progress interpolation
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const pct = Math.min((now - start) / BOOT_TOTAL_MS, 1);
      setProgress(pct);
      if (pct < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Line reveals
    const timers = BOOT_LINES.map((_, i) =>
      setTimeout(() => setBootLines((n) => Math.max(n, i + 1)), BOOT_LINES[i].delay)
    );

    // Advance to name step after boot completes
    const advance = setTimeout(() => setStep("name"), BOOT_TOTAL_MS + 220);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      clearTimeout(advance);
    };
  }, [mounted, step]);

  // Focus input on step change
  useEffect(() => {
    if (step === "name") setTimeout(() => nameRef.current?.focus(), 60);
  }, [step]);

  // ── Exit ───────────────────────────────────────────────────────────────────────
  const exit = useCallback(() => {
    sessionStorage.setItem("introShown", "1");
    setExiting(true);
    setTimeout(() => setVisible(false), 700);
  }, []);

  const goThanks = useCallback((name: string, relationship: string, contactUrl: string) => {
    const safe = name.slice(0, 80); // clamp length before storing
    const safeUrl = contactUrl.slice(0, 200);
    setVName(safe);
    if (safe) {
      sessionStorage.setItem("visitorName", safe);
      logVisitorEvent({
        type: "identify",
        name: safe,
        relationship,
        contactUrl: safeUrl,
        contactKind: contactKind(safeUrl),
        isOwner: safe.toLowerCase().includes("binay"),
      });
    }
    setStep("thanks");
    setTimeout(exit, 1600);
  }, [exit]);

  if (!visible) return null;

  const crumbIndex = STEP_ORDER.indexOf(step);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="fixed inset-0 z-[300] flex flex-col"
          style={{ background: "#000500", fontFamily: "var(--font-mono), monospace" }}
        >
          {/* Scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.015) 2px, rgba(0,255,65,0.015) 4px)",
              zIndex: 1,
            }}
          />

          {/* Top bar — breadcrumb */}
          <div
            className="relative z-10 flex items-center gap-0 px-6 py-3"
            style={{ borderBottom: "1px solid #001a00" }}
          >
            <span className="text-[10px]" style={{ color: "#003300", marginRight: 12 }}>
              binay@portfolio:~$
            </span>
            {CRUMBS.map((c, i) => {
              const active = i === crumbIndex;
              const past   = i < crumbIndex;
              return (
                <span key={c.key} className="flex items-center">
                  {i > 0 && (
                    <span className="mx-2 text-[10px]" style={{ color: "#002200" }}>/</span>
                  )}
                  <span
                    className="text-[10px] tracking-widest uppercase"
                    style={{
                      color: active ? "#00FF41" : past ? "#004400" : "#002200",
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    {c.label}
                  </span>
                </span>
              );
            })}
          </div>

          {/* Terminal body */}
          <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-16 max-w-3xl w-full mx-auto py-8">

            {/* ── BOOT ── */}
            {step === "boot" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                {/* ASCII header */}
                <div className="mb-6 hidden md:block">
                  <pre className="text-[11px] leading-tight select-none" style={{ color: "#00FF41" }}>{`
 ██████╗ ██╗███╗   ██╗ █████╗ ██╗   ██╗
 ██╔══██╗██║████╗  ██║██╔══██╗╚██╗ ██╔╝
 ██████╔╝██║██╔██╗ ██║███████║ ╚████╔╝
 ██╔══██╗██║██║╚██╗██║██╔══██║  ╚██╔╝
 ██████╔╝██║██║ ╚████║██║  ██║   ██║
 ╚═════╝ ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝   ╚═╝  `}</pre>
                </div>
                {/* Mobile name */}
                <div className="mb-6 md:hidden">
                  <p className="text-2xl font-semibold tracking-widest" style={{ color: "#00FF41" }}>
                    BINAY SIDDHARTH
                  </p>
                </div>

                {/* Boot lines */}
                <div className="space-y-0.5">
                  {BOOT_LINES.slice(0, bootLines).map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.18 }}
                      className="text-[12px] leading-6 whitespace-pre"
                      style={{ color: line.bright ? "#00FF41" : "#006600" }}
                    >
                      {line.text}
                    </motion.div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="mt-5 text-[12px]" style={{ color: "#008F11" }}>
                  {progressBar(progress)}
                </div>
              </motion.div>
            )}

            {/* ── NAME ── */}
            {step === "name" && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <p className="text-[11px] mb-6" style={{ color: "#006600" }}>
                  {"> "}<span style={{ color: "#008F11" }}>SYSTEM READY.</span> Identify yourself to continue.
                </p>
                <div className="mb-2 text-[12px]" style={{ color: "#00FF41" }}>
                  &gt; WHO_ARE_YOU:
                </div>
                <div className="flex items-center gap-2 mb-2" style={{ borderBottom: "1px solid #003300", paddingBottom: 6 }}>
                  <span className="text-[12px]" style={{ color: "#00FF41" }}>&gt;</span>
                  <input
                    ref={nameRef}
                    value={nameVal}
                    onChange={(e) => setNameVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && canLaunch) goThanks(nameVal.trim(), relationship, contactUrl.trim());
                    }}
                    placeholder="type your name..."
                    className="flex-1 bg-transparent outline-none text-[13px] placeholder:opacity-30"
                    style={{ color: "#00FF41", caretColor: "#00FF41" }}
                  />
                  <span
                    className="inline-block w-[2px] h-4"
                    style={{ background: "#00FF41", animation: "blink 1s step-end infinite" }}
                  />
                </div>

                <AnimatePresence initial={false}>
                  {nameVal.trim() && isOwner && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-[11px] mt-2 mb-2"
                      style={{ color: "#008F11" }}
                    >
                      &gt; welcome back. skipping the paperwork.
                    </motion.p>
                  )}

                  {nameVal.trim() && !isOwner && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="mt-4 mb-2 text-[12px]" style={{ color: "#00FF41" }}>
                        &gt; RELATIONSHIP_TO_BINAY:
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {RELATIONSHIPS.map((r) => (
                          <button
                            key={r.value}
                            type="button"
                            onClick={() => setRelationship(r.value)}
                            className="px-3 py-1.5 text-[11px] rounded-full transition-all"
                            style={{
                              background: relationship === r.value ? "rgba(0,255,65,0.15)" : "transparent",
                              border: `1px solid ${relationship === r.value ? "#00FF41" : "#002200"}`,
                              color: relationship === r.value ? "#00FF41" : "#006600",
                            }}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>

                      <div className="mb-2 text-[12px]" style={{ color: "#00FF41" }}>
                        &gt; CONTACT (linkedin / github / email):
                      </div>
                      <div className="flex items-center gap-2 mb-1" style={{ borderBottom: "1px solid #003300", paddingBottom: 6 }}>
                        <span className="text-[12px]" style={{ color: "#00FF41" }}>&gt;</span>
                        <input
                          value={contactUrl}
                          onChange={(e) => setContactUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && canLaunch) goThanks(nameVal.trim(), relationship, contactUrl.trim());
                          }}
                          placeholder="linkedin.com/in/... · github.com/... · you@email.com"
                          className="flex-1 bg-transparent outline-none text-[13px] placeholder:opacity-30"
                          style={{ color: "#00FF41", caretColor: "#00FF41" }}
                        />
                      </div>
                      <p className="text-[10px] mb-2" style={{ color: contactUrl.trim() && !contactMatch ? "#CC5533" : "#003300" }}>
                        {contactUrl.trim() && !contactMatch
                          ? "needs a linkedin.com/in/…, github.com/…, or a real email"
                          : "no verification service on a static site — this just confirms the shape"}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => goThanks(nameVal.trim(), relationship, contactUrl.trim())}
                    disabled={!canLaunch}
                    className="px-4 py-1.5 text-[11px] rounded transition-all"
                    style={{
                      background: canLaunch ? "rgba(0,255,65,0.1)" : "transparent",
                      border: `1px solid ${canLaunch ? "rgba(0,255,65,0.4)" : "#002200"}`,
                      color: canLaunch ? "#00FF41" : "#003300",
                    }}
                  >
                    ./launch
                  </button>
                  <button
                    onClick={() => goThanks("", "", "")}
                    className="px-4 py-1.5 text-[11px] rounded transition-all"
                    style={{ background: "transparent", border: "1px solid #002200", color: "#003300" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#006600"; e.currentTarget.style.borderColor = "#003300"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#003300"; e.currentTarget.style.borderColor = "#002200"; }}
                  >
                    --skip
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── THANKS ── */}
            {step === "thanks" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="space-y-1 text-[12px]" style={{ color: "#006600" }}>
                  <p>&gt; log saved.</p>
                  {vName && <p style={{ color: "#008F11" }}>&gt; access granted: {vName}</p>}
                  <p style={{ color: "#00FF41" }}>&gt; launching portfolio...</p>
                </div>
                {/* Blinking cursor at end */}
                <div className="mt-3 flex items-center gap-1">
                  <span className="text-[12px]" style={{ color: "#00FF41" }}>&gt;</span>
                  <span
                    className="inline-block w-[2px] h-4"
                    style={{ background: "#00FF41", animation: "blink 1s step-end infinite" }}
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Bottom status bar */}
          <div
            className="relative z-10 flex items-center justify-between px-6 py-2"
            style={{ borderTop: "1px solid #001a00" }}
          >
            <span className="text-[10px]" style={{ color: "#002a00" }}>
              Sydney, AU  //  data &amp; genai
            </span>
            <span className="text-[10px]" style={{ color: "#002a00" }}>
              {step === "boot" ? `BOOTING ${Math.round(progress * 100)}%` : step.toUpperCase()}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
