import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import ArticlePage from "@/legacy-pages/way/[slug]";
import { wayArticles } from "@/data/immanuel";
import { immanuelWayCourse } from "@/lib/bible-study";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = wayArticles.find((item) => item.slug === slug);
  return article ? pageMetadata(`${article.title} | 임마누엘의 길`, article.quote.replace(/\n/g, " "), `/way/${article.slug}`) : {};
}

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
