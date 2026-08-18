"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MatrixDecoder from "@/components/MatrixDecoder";
import HeadingReveal from "@/components/motion/HeadingReveal";
import SceneDolly from "@/components/motion/SceneDolly";
import { logVisitorEvent } from "@/lib/visitorWebhook";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EMAIL = "binay.siddharth@gmail.com";

// What the engagement actually is, in the shape a buyer recognises. Kept to
// four so the choice is a glance, not a decision.
const OFFERS: { code: string; title: string; body: string }[] = [
  {
    code: "01",
    title: "Agentic AI, built to survive production",
    body: "Skill layers, orchestration, human-in-the-loop control points, evals and acceptance gates. The unglamorous parts that decide whether an agent ships or stays a demo.",
  },
  {
    code: "02",
    title: "Governed metric & data layers",
    body: "Metrics off spreadsheets and onto accountable source systems, with lineage and quality control that survives an audit and a reorg.",
  },
  {
    code: "03",
    title: "Advisory for teams already mid-flight",
    body: "Architecture decision records, build-vs-buy calls, review of an AI roadmap that has to clear risk and enterprise architecture.",
  },
  {
    code: "04",
    title: "Workshops that leave capability behind",
    body: "GenAI and analytics enablement for finance and data teams, aimed at the people who own the process rather than only the engineers.",
  },
];

const ENGAGEMENTS = ["Advisory", "Build", "Data platform", "Workshop", "Not sure yet"];
const TIMELINES = ["Just exploring", "Next few weeks", "This quarter", "Urgent"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "sent";

export default function Consulting() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [engagement, setEngagement] = useState("");
  const [timeline, setTimeline] = useState("");
  const [brief, setBrief] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [touchedEmail, setTouchedEmail] = useState(false);

  const emailOk = EMAIL_RE.test(email.trim());
  const canSend =
    name.trim() !== "" && emailOk && brief.trim().length >= 10 && engagement !== "";

  const submit = () => {
    if (!canSend) return;
    logVisitorEvent({
      type: "engage",
      name: name.trim().slice(0, 120),
      email: email.trim().slice(0, 160),
      company: company.trim().slice(0, 160),
      engagement,
      timeline: timeline || "unspecified",
      brief: brief.trim().slice(0, 2000),
    });
    setStatus("sent");
  };

  // Pre-filled fallback, so a failed background POST is never a dead end.
  const mailto =
    `mailto:${EMAIL}?subject=${encodeURIComponent(
      `Engagement enquiry${company.trim() ? ` — ${company.trim()}` : ""}`
    )}&body=${encodeURIComponent(
      [
        `Name: ${name || ""}`,
        `Company: ${company || ""}`,
        `Engagement: ${engagement || ""}`,
        `Timeline: ${timeline || ""}`,
        "",
        brief || "",
      ].join("\n")
    )}`;

  const fieldStyle = {
    background: "var(--c-bg)",
    border: "1px solid var(--c-border)",
    color: "var(--c-text)",
    fontFamily: "var(--font-inter), sans-serif",
  } as const;

  return (
    <section id="consulting" className="py-28 px-6" style={{ background: "var(--c-surface)" }}>
      <SceneDolly className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <p
            className="text-[10px] tracking-[0.25em] uppercase mb-3"
            style={{ color: "var(--c-accent)", fontFamily: "var(--font-mono), monospace" }}
          >
            <MatrixDecoder text="// open_for_engagement" />
          </p>
          <h2
            className="text-5xl md:text-6xl font-light mb-4"
            style={{ color: "var(--c-text)", fontFamily: "var(--font-cormorant), serif" }}
          >
            <HeadingReveal>
              <MatrixDecoder text="Work With Me" />
            </HeadingReveal>
          </h2>
          <p
            className="text-sm max-w-2xl leading-relaxed"
            style={{ color: "var(--c-muted)", fontFamily: "var(--font-inter), sans-serif" }}
          >
            I take on a small number of consulting and AI-forward engineering engagements
            outside my day role, in a personal capacity. Selectively, because there are only
            so many spare evenings, and because the work is more useful when I can actually
            think about it. If you have something specific in mind, the front door is below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* What the engagement looks like */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {OFFERS.map((o, i) => (
              <motion.div
                key={o.code}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: EASE }}
                className="rounded-2xl p-5"
                style={{ background: "var(--c-bg)", border: "1px solid var(--c-border)" }}
              >
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span
                    className="text-[10px] tabular-nums"
                    style={{ color: "var(--c-dim)", fontFamily: "var(--font-mono), monospace" }}
                  >
                    {o.code}
                  </span>
                  <h3
                    className="text-[13px] font-semibold leading-snug"
                    style={{ color: "var(--c-accent)", fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {o.title}
                  </h3>
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--c-muted)", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {o.body}
                </p>
              </motion.div>
            ))}

            <p
              className="text-[10px] leading-relaxed mt-1"
              style={{ color: "var(--c-dim)", fontFamily: "var(--font-mono), monospace" }}
            >
              {"// engagements are independent of my employer and taken on personal time."}
            </p>
          </div>

          {/* The front door */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="lg:col-span-3 rounded-2xl p-6 md:p-8 flex flex-col justify-center"
            style={{ background: "var(--c-bg)", border: "1px solid var(--c-border)" }}
          >
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="py-8"
                >
                  <p
                    className="text-[10px] tracking-[0.2em] uppercase mb-3"
                    style={{ color: "var(--c-accent)", fontFamily: "var(--font-mono), monospace" }}
                  >
                    {"> transmission_sent"}
                  </p>
                  <p
                    className="text-lg mb-3"
                    style={{ color: "var(--c-text)", fontFamily: "var(--font-cormorant), serif" }}
                  >
                    Thanks {name.trim().split(" ")[0]}. That landed.
                  </p>
                  <p
                    className="text-xs leading-relaxed mb-5 max-w-md"
                    style={{ color: "var(--c-muted)", fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    I read everything that comes through here and reply to the ones I can
                    genuinely help with, usually within a few days, to{" "}
                    <span style={{ color: "var(--c-accent)" }}>{email.trim()}</span>.
                  </p>
                  <p
                    className="text-[11px] leading-relaxed"
                    style={{ color: "var(--c-dim)", fontFamily: "var(--font-mono), monospace" }}
                  >
                    {"// if you'd rather have it in your own sent items, "}
                    <a
                      href={mailto}
                      style={{ color: "var(--c-accent)", textDecoration: "underline" }}
                    >
                      send the same thing by email
                    </a>
                    .
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <p
                    className="text-[10px] tracking-[0.2em] uppercase mb-5"
                    style={{ color: "var(--c-accent)", fontFamily: "var(--font-mono), monospace" }}
                  >
                    {"> start_a_conversation"}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label
                        htmlFor="eng-name"
                        className="block text-[10px] mb-1.5"
                        style={{ color: "var(--c-dim)", fontFamily: "var(--font-mono), monospace" }}
                      >
                        NAME *
                      </label>
                      <input
                        id="eng-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="your name"
                        className="w-full px-3 py-2 rounded-lg text-[13px] outline-none placeholder:opacity-30"
                        style={fieldStyle}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="eng-email"
                        className="block text-[10px] mb-1.5"
                        style={{ color: "var(--c-dim)", fontFamily: "var(--font-mono), monospace" }}
                      >
                        EMAIL *
                      </label>
                      <input
                        id="eng-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setTouchedEmail(true)}
                        placeholder="you@company.com"
                        className="w-full px-3 py-2 rounded-lg text-[13px] outline-none placeholder:opacity-30"
                        style={{
                          ...fieldStyle,
                          borderColor:
                            touchedEmail && email.trim() && !emailOk
                              ? "#CC5533"
                              : "var(--c-border)",
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="eng-company"
                      className="block text-[10px] mb-1.5"
                      style={{ color: "var(--c-dim)", fontFamily: "var(--font-mono), monospace" }}
                    >
                      COMPANY
                    </label>
                    <input
                      id="eng-company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="optional"
                      className="w-full px-3 py-2 rounded-lg text-[13px] outline-none placeholder:opacity-30"
                      style={fieldStyle}
                    />
                  </div>

                  <p
                    className="text-[10px] mb-2"
                    style={{ color: "var(--c-dim)", fontFamily: "var(--font-mono), monospace" }}
                  >
                    WHAT KIND OF ENGAGEMENT *
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ENGAGEMENTS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setEngagement(opt)}
                        className="px-3 py-1.5 text-[11px] rounded-full transition-all"
                        style={{
                          background:
                            engagement === opt ? "rgba(var(--c-accent-rgb),0.15)" : "transparent",
                          border: `1px solid ${engagement === opt ? "var(--c-accent)" : "var(--c-border)"}`,
                          color: engagement === opt ? "var(--c-accent)" : "var(--c-dim)",
                          fontFamily: "var(--font-mono), monospace",
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <p
                    className="text-[10px] mb-2"
                    style={{ color: "var(--c-dim)", fontFamily: "var(--font-mono), monospace" }}
                  >
                    TIMELINE
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {TIMELINES.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setTimeline(timeline === opt ? "" : opt)}
                        className="px-3 py-1.5 text-[11px] rounded-full transition-all"
                        style={{
                          background:
                            timeline === opt ? "rgba(var(--c-accent-rgb),0.15)" : "transparent",
                          border: `1px solid ${timeline === opt ? "var(--c-accent)" : "var(--c-border)"}`,
                          color: timeline === opt ? "var(--c-accent)" : "var(--c-dim)",
                          fontFamily: "var(--font-mono), monospace",
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <label
                    htmlFor="eng-brief"
                    className="block text-[10px] mb-1.5"
                    style={{ color: "var(--c-dim)", fontFamily: "var(--font-mono), monospace" }}
                  >
                    WHAT ARE YOU TRYING TO DO *
                  </label>
                  <textarea
                    id="eng-brief"
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    rows={4}
                    placeholder="The problem, roughly where you're up to, and what a good outcome looks like. A few sentences is plenty."
                    className="w-full px-3 py-2 rounded-lg text-[13px] outline-none resize-y placeholder:opacity-30 leading-relaxed"
                    style={fieldStyle}
                  />

                  <div className="flex flex-wrap items-center gap-3 mt-5">
                    <button
                      type="button"
                      onClick={submit}
                      disabled={!canSend}
                      className="px-6 py-2.5 rounded-full text-[12px] font-medium transition-all"
                      style={{
                        background: canSend ? "var(--c-accent)" : "transparent",
                        color: canSend ? "var(--c-bg)" : "var(--c-border)",
                        border: `1px solid ${canSend ? "var(--c-accent)" : "var(--c-border)"}`,
                        fontFamily: "var(--font-mono), monospace",
                        cursor: canSend ? "pointer" : "not-allowed",
                      }}
                    >
                      ./send_enquiry
                    </button>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="text-[11px] transition-colors"
                      style={{ color: "var(--c-dim)", fontFamily: "var(--font-mono), monospace" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "var(--c-accent)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "var(--c-dim)"; }}
                    >
                      or just email me
                    </a>
                  </div>

                  <p
                    className="text-[10px] mt-4 leading-relaxed"
                    style={{ color: "var(--c-dim)", fontFamily: "var(--font-mono), monospace" }}
                  >
                    {"// goes straight to me. no list, no CRM, no follow-up sequence."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </SceneDolly>
    </section>
  );
}
