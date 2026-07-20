import { notFound } from "next/navigation";
import ProblemDetail, { problemPages } from "@/legacy-pages/problems/[slug]";

export function generateStaticParams() {
  return problemPages.map((page) => ({ slug: page.slug }));
}

export default async function ProblemPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = problemPages.find((item) => item.slug === slug);
  if (!page) notFound();
  return <ProblemDetail page={page} />;
}
