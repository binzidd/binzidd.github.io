"use client";

/**
 * SkillStack
 * ----------
 * The default, no-interaction-required view of skill depth.
 *
 * The physics sim (JellyfishTank) is fun but fails the job this section exists to
 * do: a recruiter scanning for 4 seconds needs pattern recognition, not a puzzle.
 * Circles piled by gravity give three problems a hiring manager actually hits:
 *   - no stable reading order (today's pile isn't tomorrow's pile)
 *   - area is a bad channel for comparison (Cleveland & McGill rank it below
 *     position/length — two circles 15% apart in "value" look almost identical)
 *   - occlusion: smaller/lower-priority skills get buried under bigger ones
 *
 * This view fixes that with the two best-ranked perceptual channels — aligned
 * position and length — grouped by category (Gestalt proximity + colour), in a
 * fixed, designer-set order. No manufactured percentage is shown; length still
 * encodes only *relative* depth, and the qualitative tier label is the thing a
 * reader actually takes away, not a fake decimal.
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { skillCategories, type SkillCategory } from "@/data/resume";

const CATEGORY_COLOURS: Record<string, string> = {
  "Generative AI": "#00FF41",
  "Data & BI": "#29B5E8",
  "Cloud & Infrastructure": "#FF9900",
  Leadership: "#E97627",
};

// level (0-100, never shown) -> bar fill (18%-100%) so the lightest tier is
// still clearly a bar, not a rounding error.
const MIN_LEVEL = 65;
const MAX_LEVEL = 100;
function fillPct(level: number) {
  const t = Math.max(0, Math.min(1, (level - MIN_LEVEL) / (MAX_LEVEL - MIN_LEVEL)));
  return 18 + t * 82;
}

function tierFor(level: number): { label: string; order: number } {
  if (level >= 90) return { label: "Core", order: 0 };
  if (level >= 80) return { label: "Advanced", order: 1 };
  return { label: "Working", order: 2 };
}

function SkillRow({
  name, level, colour, delay,
}: { name: string; level: number; colour: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const tier = tierFor(level);

  return (
    <div ref={ref} className="flex items-center gap-3">
      <span
        className="text-xs flex-shrink-0 w-[172px] truncate"
        style={{ color: "#C9D4DE", fontFamily: "var(--font-inter), sans-serif" }}
      >
        {name}
      </span>
      <div className="flex-1 h-[7px] rounded-full overflow-hidden" style={{ background: "#001a00" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: colour }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${fillPct(level)}%` } : { width: 0 }}
          transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <span
        className="text-[9px] flex-shrink-0 w-16 text-right uppercase tracking-wider"
        style={{ color: colour, fontFamily: "var(--font-mono), monospace", opacity: 0.85 }}
      >
        {tier.label}
      </span>
    </div>
  );
}

function CategoryStack({ category, index }: { category: SkillCategory; index: number }) {
  const colour = CATEGORY_COLOURS[category.name] ?? "#00FF41";
  // Fixed, designer-set order: deepest first. Not physics-dependent, not
  // reader-dependent — the same order every time, which is the point.
  const sorted = [...category.skills].sort((a, b) => b.level - a.level);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="rounded-2xl p-6"
      style={{ background: "#020c02", border: "1px solid #003300" }}
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: colour }} />
        <p
          className="text-[10px] font-semibold tracking-[0.15em] uppercase"
          style={{ color: colour, fontFamily: "var(--font-mono), monospace" }}
        >
          {category.name}
        </p>
      </div>
      <div className="space-y-3">
        {sorted.map((skill, si) => (
          <SkillRow
            key={skill.name}
            name={skill.name}
            level={skill.level}
            colour={colour}
            delay={si * 0.05}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function SkillStack() {
  return (
    <div>
      {/* Legend — stated once, not repeated per row */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mb-6 text-[10px]"
        style={{ color: "#5A6570", fontFamily: "var(--font-mono), monospace" }}>
        <span><span style={{ color: "#8B949E" }}>Core</span> — daily depth, load-bearing</span>
        <span><span style={{ color: "#8B949E" }}>Advanced</span> — strong working fluency</span>
        <span><span style={{ color: "#8B949E" }}>Working</span> — functional, reached for as needed</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillCategories.map((category, i) => (
          <CategoryStack key={category.name} category={category} index={i} />
        ))}
      </div>
    </div>
  );
}
