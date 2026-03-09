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
      style={{
        background: "#F8F5F0",
        border: "1px solid #E0D8CF",
        textDecoration: "none",
      }}
      whileHover={{
        y: -5,
        boxShadow: "0 12px 32px rgba(139,115,85,0.10)",
        borderColor: "#C4A882",
      }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3
          className="text-sm font-semibold leading-snug"
          style={{ color: "#1C1917", fontFamily: "var(--font-inter), sans-serif" }}
        >
          {repo.name}
        </h3>
        <motion.div
          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 13L13 1M13 1H5M13 1V9" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>

      <p
        className="text-xs leading-relaxed mb-5"
        style={{
          color: "#78716C",
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
            <span
              className="text-[11px]"
              style={{ color: "#A8A29E", fontFamily: "var(--font-inter), sans-serif" }}
            >
              {repo.language}
            </span>
          </div>
        )}
        {repo.stargazers_count > 0 && (
          <div className="flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M5.5 1L6.9 4.1H10.3L7.6 6.2L8.6 9.4L5.5 7.4L2.4 9.4L3.4 6.2L0.7 4.1H4.1L5.5 1Z" fill="#C4A882" />
            </svg>
            <span
              className="text-[11px]"
              style={{ color: "#A8A29E", fontFamily: "var(--font-inter), sans-serif" }}
            >
              {repo.stargazers_count}
            </span>
          </div>
        )}
        <span
          className="text-[11px] ml-auto"
          style={{ color: "#A8A29E", fontFamily: "var(--font-inter), sans-serif" }}
        >
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
