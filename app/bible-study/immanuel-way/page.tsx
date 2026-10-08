import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { wayArticles } from "@/data/immanuel";
import { immanuelWayCourse } from "@/lib/bible-study";

export const metadata: Metadata = {
  title: "임마누엘의 길 11과 웹 성경공부 | 임마누엘교회",
  description: "성경으로 배우고 삶으로 걷는 임마누엘의 길 11과 핵심과정",
  robots: { index: false, follow: false }
};

export default async function ImmanuelWayStudyPage({
  searchParams
}: {
  searchParams: Promise<{ lesson?: string; page?: string }>;
}) {
  const { lesson, page } = await searchParams;
  const requestedPage = page && immanuelWayCourse.pages.find((item) => item.key === page);
  const article = requestedPage
    ? wayArticles[(requestedPage.unit ?? 0) - 1]
    : wayArticles.find((item) => item.slug === lesson);

  if (!article) redirect("/way");

  if (requestedPage) {
    redirect(`/way/${article.slug}?page=${encodeURIComponent(requestedPage.key)}#study-content`);
  }

  redirect(`/way/${article.slug}`);
}
