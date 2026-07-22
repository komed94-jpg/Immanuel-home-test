import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { WayArticle, wayArticles } from "@/data/immanuel";

type ArticlePageProps = {
  article: WayArticle;
};

const slugAliasMap: Record<string, string> = {
  belief: "what-we-believe",
  worship: "why-we-worship",
  prayer: "how-we-pray",
  spirit: "life-by-the-spirit",
  growth: "how-we-grow",
  community: "life-together",
  discernment: "wisdom-of-discernment",
  leadership: "leadership-we-build",
  giving: "what-we-give",
  sending: "why-we-go",
  dream: "church-we-dream",
  "what-we-believe": "belief",
  "why-we-worship": "worship",
  "how-we-pray": "prayer",
  "life-by-the-spirit": "spirit",
  "how-we-grow": "growth",
  "life-together": "community",
  "wisdom-of-discernment": "discernment",
  "leadership-we-build": "leadership",
  "what-we-give": "giving",
  "why-we-go": "sending",
  "church-we-dream": "dream"
};

export default function ArticlePage({ article }: ArticlePageProps) {
  const lessonNumber = wayArticles.findIndex((item) => item.slug === article.slug) + 1;
  const lessonLabel = String(lessonNumber).padStart(2, "0");

  return (
    <Layout>
      <article className="way-detail-page way-article-page">
        <section
          className="article-hero"
          style={{ backgroundImage: `url(${article.image.url})` }}
        >
          <div className="article-hero-overlay" />
          <div className="article-hero-content">
            <Link href="/way" className="back-link">
              임마누엘의 길
            </Link>
            <h1>{article.title}</h1>
            <p>{article.quote}</p>
            <span>{article.keywords.join(" · ")}</span>
          </div>
        </section>

        <section className="article-body" aria-label={`${article.title} 원문`}>
          {article.content.map((paragraph, index) => (
            <p key={`${article.slug}-${index}`}>{paragraph}</p>
          ))}
        </section>
        <section className="way-lesson-bridge" aria-label={`${article.title} ${lessonNumber}과 성경공부 연결`}>
          <div>
            <p className="section-kicker">IMMANUEL WAY · LESSON {lessonLabel}</p>
            <h2>{lessonNumber}과 성경공부로 이어갑니다.</h2>
            <p>핵심 본문과 참조 말씀을 읽고, 이 내용을 성경을 기준으로 확인하고 적용합니다.</p>
          </div>
          <Link href={`/bible-study/immanuel-way?lesson=${article.slug}`} className="primary-link">
            {lessonLabel}과 성경공부 시작
          </Link>
        </section>
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [
    ...wayArticles.map((article) => ({
      params: { slug: article.slug }
    })),
    ...Object.keys(slugAliasMap).map((slug) => ({
      params: { slug }
    }))
  ],
  fallback: false
});

export const getStaticProps: GetStaticProps<ArticlePageProps> = async ({ params }) => {
  const requestedSlug = String(params?.slug ?? "");
  const aliasedSlug = slugAliasMap[requestedSlug];
  const article = wayArticles.find((item) => item.slug === requestedSlug)
    ?? wayArticles.find((item) => item.slug === aliasedSlug);

  if (!article) {
    return { notFound: true };
  }

  return {
    props: {
      article
    }
  };
};
