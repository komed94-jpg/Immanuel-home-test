import { notFound } from "next/navigation";
import ArticlePage from "@/legacy-pages/way/[slug]";
import { wayArticles } from "@/data/immanuel";
import { immanuelWayCourse } from "@/lib/bible-study";

export function generateStaticParams() {
  return wayArticles.map((article) => ({ slug: article.slug }));
}

export default async function WayArticlePage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ slug }, { page }] = await Promise.all([params, searchParams]);
  const articleIndex = wayArticles.findIndex((item) => item.slug === slug);
  const article = wayArticles[articleIndex];
  if (!article) notFound();
  const startPageKey = page && immanuelWayCourse.pages.some((item) => item.key === page && item.unit === articleIndex + 1)
    ? page
    : undefined;
  return <ArticlePage article={article} startPageKey={startPageKey} />;
}
