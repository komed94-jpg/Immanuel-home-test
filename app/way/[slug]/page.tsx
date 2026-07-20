import { notFound } from "next/navigation";
import ArticlePage from "@/legacy-pages/way/[slug]";
import { wayArticles } from "@/data/immanuel";

export function generateStaticParams() {
  return wayArticles.map((article) => ({ slug: article.slug }));
}

export default async function WayArticlePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = wayArticles.find((item) => item.slug === slug);
  if (!article) notFound();
  return <ArticlePage article={article} />;
}
