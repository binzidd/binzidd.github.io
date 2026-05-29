"use client";

import { motion } from "framer-motion";
import { getLanguageColor, type GitHubRepo } from "@/lib/github";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

function RepoCard({ repo }: { repo: GitHubRepo }) {
  const langColor = getLanguageColor(repo.language);
  const updatedDate = new Date(repo.updated_at).toLocaleDateString("en-AU", {
    month: "short",
    year: "numeric",
  });

  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      variants={cardVariants}
      className="group block rounded-2xl p-6"
      style={{ background: "#020c02", border: "1px solid #003300", textDecoration: "none" }}
      whileHover={{ y: -5, boxShadow: "0 12px 32px rgba(0,255,65,0.06), 0 0 0 1px rgba(0,255,65,0.15)", borderColor: "rgba(0,255,65,0.2)" }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold leading-snug" style={{ color: "#E6EDF3", fontFamily: "var(--font-inter), sans-serif" }}>
          {repo.name}
        </h3>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 13L13 1M13 1H5M13 1V9" stroke="#00FF41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <p
        className="text-xs leading-relaxed mb-5"
        style={{
          color: "#8B949E",
          fontFamily: "var(--font-inter), sans-serif",
          minHeight: "2.5rem",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {repo.description ?? "No description available."}
      </p>

      <div className="flex items-center gap-4">
        {repo.language && (
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: langColor }} />
            <span className="text-[11px]" style={{ color: "#006600", fontFamily: "var(--font-mono), monospace" }}>
              {repo.language}
            </span>
          </div>
        )}
        {repo.stargazers_count > 0 && (
          <div className="flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M5.5 1L6.9 4.1H10.3L7.6 6.2L8.6 9.4L5.5 7.4L2.4 9.4L3.4 6.2L0.7 4.1H4.1L5.5 1Z" fill="#F0A742" />
            </svg>
            <span className="text-[11px]" style={{ color: "#006600", fontFamily: "var(--font-mono), monospace" }}>
              {repo.stargazers_count}
            </span>
          </div>
        )}
        <span className="text-[11px] ml-auto" style={{ color: "#006600", fontFamily: "var(--font-mono), monospace" }}>
          {updatedDate}
        </span>
      </div>
    </motion.a>
  );
}

export default function GitHubRepoGrid({ repos }: { repos: GitHubRepo[] }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </motion.div>
  );
}
