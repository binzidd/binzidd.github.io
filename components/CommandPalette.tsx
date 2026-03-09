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
  return "I don't have a specific answer for that, but feel free to reach out to Binay directly at binay.siddharth@gmail.com or connect on LinkedIn. You can also explore the timeline and projects sections above for more detail.";
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
    }, 12);
    return () => clearInterval(interval);
  }, [text, onDone]);

  return (
    <span>
      {displayed}
      {!done && (
        <span
          className="cursor-blink inline-block w-[2px] h-3.5 ml-0.5 align-middle"
          style={{ background: "#8B7355" }}
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
      setTimeout(() => {
        handleSubmit(e.detail as string);
      }, 200);
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
            style={{ background: "rgba(28,25,23,0.45)", backdropFilter: "blur(4px)" }}
            onClick={handleClose}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "#F8F5F0",
                border: "1px solid #E0D8CF",
                boxShadow: "0 24px 64px rgba(28,25,23,0.18)",
              }}
            >
              {/* Terminal header bar */}
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{ background: "#1C1917", borderBottom: "1px solid #2C2927" }}
              >
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#CC5533" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#C4A882" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#2E6B43" }} />
                </div>
                <span
                  className="text-xs ml-2"
                  style={{ color: "#A8A29E", fontFamily: "monospace" }}
                >
                  binay@portfolio ~ Ask Me Anything
                </span>
                <button
                  onClick={handleClose}
                  className="ml-auto text-xs px-2 py-0.5 rounded"
                  style={{ color: "#78716C", fontFamily: "monospace" }}
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
                    <p
                      className="text-sm mb-4"
                      style={{ color: "#A8A29E", fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      Ask about Binay&apos;s experience, projects, or skills. Try:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTIONS.slice(0, 5).map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSubmit(s)}
                          className="px-3 py-1.5 rounded-full text-xs transition-colors duration-150"
                          style={{
                            background: "#EFEBE4",
                            color: "#5C4B35",
                            border: "1px solid #E0D8CF",
                            fontFamily: "var(--font-inter), sans-serif",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#E8E2D9")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "#EFEBE4")}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-4 flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className="max-w-[90%] rounded-xl px-4 py-2.5 text-sm leading-relaxed"
                      style={
                        msg.type === "user"
                          ? {
                              background: "#1C1917",
                              color: "#F8F5F0",
                              fontFamily: "var(--font-inter), sans-serif",
                            }
                          : {
                              background: "#EFEBE4",
                              color: "#1C1917",
                              fontFamily: "var(--font-inter), sans-serif",
                            }
                      }
                    >
                      {msg.type === "assistant" && i === messages.length - 1 ? (
                        <TypewriterText text={msg.text} />
                      ) : (
                        msg.text
                      )}
                    </div>
                  </motion.div>
                ))}

                {typing && (
                  <div className="flex gap-1.5 px-4 py-3">
                    {[0, 1, 2].map((dot) => (
                      <motion.div
                        key={dot}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#C4A882" }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
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
                style={{ borderTop: "1px solid #E0D8CF" }}
              >
                <span
                  className="text-sm"
                  style={{ color: "#C4A882", fontFamily: "monospace" }}
                >
                  ›
                </span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit();
                  }}
                  placeholder="Ask anything about Binay's experience..."
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-[#A8A29E]"
                  style={{
                    color: "#1C1917",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                />
                <button
                  onClick={() => handleSubmit()}
                  disabled={!input.trim()}
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150"
                  style={{
                    background: input.trim() ? "#8B7355" : "#E8E2D9",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M1 11L11 1M11 1H4M11 1V8"
                      stroke={input.trim() ? "#F8F5F0" : "#A8A29E"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
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
