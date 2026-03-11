"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { qaEntries } from "@/data/resume";

interface Message {
  type: "user" | "assistant";
  text: string;
}

const SUGGESTIONS = [
  "Tell me about Adobe",
  "What is Project SPUR?",
  "What GenAI projects has he built?",
  "Tell me about his education",
  "What certifications does he have?",
  "Tell me about NL to SQL",
  "What skills does he have?",
];

function findAnswer(query: string): string {
  const q = query.toLowerCase();
  for (const entry of qaEntries) {
    if (entry.keywords.some((kw) => q.includes(kw.toLowerCase()))) {
      return entry.answer;
    }
  }
  return "No direct match found. Reach Binay at binay.siddharth@gmail.com or connect on LinkedIn. Explore the timeline and projects sections for more detail.";
}

function TypewriterText({ text, onDone }: { text: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
        onDone?.();
      }
    }, 10);
    return () => clearInterval(interval);
  }, [text, onDone]);

  return (
    <span>
      {displayed}
      {!done && (
        <span
          className="inline-block w-[2px] h-3.5 ml-0.5 align-middle"
          style={{ background: "#00FF41", animation: "blink 1s step-end infinite" }}
        />
      )}
    </span>
  );
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setInput("");
  }, []);

  const handleSubmit = useCallback(
    (query?: string) => {
      const q = (query ?? input).trim();
      if (!q) return;
      setInput("");
      setMessages((prev) => [...prev, { type: "user", text: q }]);
      setTyping(true);
      setTimeout(() => {
        const answer = findAnswer(q);
        setMessages((prev) => [...prev, { type: "assistant", text: answer }]);
        setTyping(false);
      }, 400);
    },
    [input]
  );

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        open ? handleClose() : handleOpen();
      }
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, handleOpen, handleClose]);

  // Custom event from Timeline
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      setOpen(true);
      setTimeout(() => handleSubmit(e.detail as string), 200);
    };
    document.addEventListener("palette-query", handler as EventListener);
    return () => document.removeEventListener("palette-query", handler as EventListener);
  }, [handleSubmit]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90]"
            style={{ background: "rgba(0,5,0,0.75)", backdropFilter: "blur(4px)" }}
            onClick={handleClose}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "#000500",
                border: "1px solid #003300",
                boxShadow: "0 0 60px rgba(0,255,65,0.08), 0 24px 64px rgba(0,0,0,0.8)",
              }}
            >
              {/* Terminal title bar */}
              <div
                className="flex items-center gap-2 px-4 py-2.5"
                style={{ background: "#020c02", borderBottom: "1px solid #003300" }}
              >
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#003300" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#003300" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#003300" }} />
                </div>
                <span className="text-xs ml-2" style={{ color: "#006600", fontFamily: "var(--font-mono), monospace" }}>
                  binay@portfolio:~$ ask_me_anything
                </span>
                <button
                  onClick={handleClose}
                  className="ml-auto text-[10px] px-2 py-0.5 rounded transition-colors"
                  style={{ color: "#006600", border: "1px solid #003300", fontFamily: "var(--font-mono), monospace" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#00FF41"; e.currentTarget.style.borderColor = "rgba(0,255,65,0.3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#006600"; e.currentTarget.style.borderColor = "#003300"; }}
                >
                  esc
                </button>
              </div>

              {/* Messages */}
              <div
                className="px-5 py-4 overflow-y-auto"
                style={{ maxHeight: "340px", minHeight: messages.length ? "200px" : "0px" }}
              >
                {messages.length === 0 && (
                  <div>
                    <p className="text-xs mb-4" style={{ color: "#006600", fontFamily: "var(--font-mono), monospace" }}>
                      <span style={{ color: "#00FF41" }}>$</span> query --about binay.siddharth
                      <br />
                      <span style={{ color: "#003300" }}>// suggestions:</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTIONS.slice(0, 5).map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSubmit(s)}
                          className="px-3 py-1.5 rounded-full text-[11px] transition-all duration-150"
                          style={{
                            background: "transparent",
                            color: "#008F11",
                            border: "1px solid #003300",
                            fontFamily: "var(--font-mono), monospace",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#00FF41";
                            e.currentTarget.style.borderColor = "rgba(0,255,65,0.35)";
                            e.currentTarget.style.background = "rgba(0,255,65,0.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "#008F11";
                            e.currentTarget.style.borderColor = "#003300";
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          &gt; {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4"
                  >
                    {msg.type === "user" ? (
                      <div className="flex items-start gap-2">
                        <span style={{ color: "#00FF41", fontFamily: "var(--font-mono), monospace", fontSize: 11 }}>$</span>
                        <span className="text-sm leading-relaxed" style={{ color: "#00FF41", fontFamily: "var(--font-mono), monospace" }}>
                          {msg.text}
                        </span>
                      </div>
                    ) : (
                      <div
                        className="rounded-xl px-4 py-3 text-sm leading-relaxed"
                        style={{ background: "#020c02", color: "#008F11", border: "1px solid #003300", fontFamily: "var(--font-inter), sans-serif" }}
                      >
                        {i === messages.length - 1 ? (
                          <TypewriterText text={msg.text} />
                        ) : (
                          msg.text
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}

                {typing && (
                  <div className="flex gap-1.5 px-1 py-2">
                    {[0, 1, 2].map((dot) => (
                      <motion.div
                        key={dot}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#003300" }}
                        animate={{ background: ["#003300", "#00FF41", "#003300"] }}
                        transition={{ duration: 1, delay: dot * 0.2, repeat: Infinity }}
                      />
                    ))}
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderTop: "1px solid #003300" }}
              >
                <span style={{ color: "#00FF41", fontFamily: "var(--font-mono), monospace", fontSize: 13 }}>›</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                  placeholder="query --anything..."
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{
                    color: "#00FF41",
                    fontFamily: "var(--font-mono), monospace",
                    caretColor: "#00FF41",
                  }}
                />
                <button
                  onClick={() => handleSubmit()}
                  disabled={!input.trim()}
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150"
                  style={{ background: input.trim() ? "rgba(0,255,65,0.15)" : "transparent", border: `1px solid ${input.trim() ? "rgba(0,255,65,0.4)" : "#003300"}` }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 11L11 1M11 1H4M11 1V8" stroke={input.trim() ? "#00FF41" : "#003300"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
