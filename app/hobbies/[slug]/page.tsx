import { notFound } from "next/navigation";
import type { Metadata } from "next";
import HobbyPageShell from "@/components/HobbyPageShell";
import { PROJECT_META } from "@/data/hobby-projects";

export function generateStaticParams() {
  return Object.keys(PROJECT_META).map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const p = PROJECT_META[slug];
  if (!p) return {};
  return {
    title: `${p.title} — Binay Siddharth`,
    description: p.thesis,
  };
}

export default async function HobbyProjectPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!PROJECT_META[slug]) notFound();
  return <HobbyPageShell slug={slug} />;
}
