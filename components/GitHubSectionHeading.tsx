"use client";

export default function GitHubSectionHeading() {
  return (
    <div className="mb-16">
      <p
        className="text-[10px] tracking-[0.28em] uppercase mb-4"
        style={{ color: "#C96A36", fontFamily: "var(--font-mono), monospace" }}
      >
        Open Source
      </p>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <h2
          className="text-5xl md:text-6xl font-light leading-tight"
          style={{ color: "#0D0D0D", fontFamily: "var(--font-cormorant), serif" }}
        >
          GitHub Repos
        </h2>
        <a
          href="https://github.com/binzidd"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
          style={{
            background: "#0D0D0D",
            color: "#F6F3EE",
            fontFamily: "var(--font-inter), sans-serif",
            textDecoration: "none",
            borderRadius: "3px",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#C96A36"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#0D0D0D"; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          View all ↗
        </a>
      </div>
      <p className="text-sm max-w-lg mt-4" style={{ color: "#5A5A5A", fontFamily: "var(--font-inter), sans-serif" }}>
        Live data from{" "}
        <span style={{ color: "#C96A36", fontFamily: "var(--font-mono), monospace" }}>
          github.com/binzidd
        </span>{" "}
        — fetched at build time.
      </p>
    </div>
  );
}
