import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { WayArticle, wayArticles } from "@/data/immanuel";
import { immanuelWayCourse } from "@/lib/bible-study";
import { StudyWorkbook } from "@/app/bible-study/immanuel-basic/StudyWorkbook";

type ArticlePageProps = {
  article: WayArticle;
  startPageKey?: string;
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

export default function ArticlePage({ article, startPageKey }: ArticlePageProps) {
  const articleIndex = wayArticles.findIndex((item) => item.slug === article.slug);
  const lessonNumber = articleIndex + 1;
  const lessonLabel = String(lessonNumber).padStart(2, "0");
  const lessonPages = immanuelWayCourse.pages.filter((item) => item.unit === lessonNumber);
  const lessonCourse = {
    ...immanuelWayCourse,
    title: `${lessonLabel}과 · ${article.title}`,
    subtitle: "개론을 읽고 성경으로 확인하며 삶에 적용합니다.",
    overview: "말씀 읽기·관찰, 해설·묵상·분별, 실천·기도의 세 단계로 이어집니다.",
    totalLessons: undefined,
    pages: lessonPages
  };
  const previousArticle = articleIndex > 0 ? wayArticles[articleIndex - 1] : null;
  const nextArticle = articleIndex < wayArticles.length - 1 ? wayArticles[articleIndex + 1] : null;

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
            <Link href="#study-content" className="article-study-jump">
              {lessonLabel}과 성경공부로 이동
            </Link>
          </div>
        </section>

        <section className="article-body" aria-label={`${article.title} 원문`}>
          {article.content.map((paragraph, index) => (
            <p key={`${article.slug}-${index}`}>{paragraph}</p>
          ))}
        </section>
        <section className="way-lesson-study-area" aria-label={`${article.title} ${lessonNumber}과 성경공부`}>
          <header className="way-lesson-study-heading">
            <p className="section-kicker">IMMANUEL WAY · LESSON {lessonLabel}</p>
            <h2>개론을 성경으로 이어서 살펴봅니다.</h2>
            <p>핵심 본문을 먼저 읽고, 해설과 분별을 거쳐 실천과 기도로 응답합니다.</p>
          </header>
          <StudyWorkbook
            key={startPageKey ?? `${article.slug}-scripture`}
            course={lessonCourse}
            startPageKey={startPageKey ?? `${article.slug}-scripture`}
            returnPath={`/way/${article.slug}`}
            hiddenSectionLabels={["임마누엘의 길 원문"]}
          />
          <nav className="way-topic-navigation" aria-label="이전·다음 임마누엘의 길">
            {previousArticle ? <Link href={`/way/${previousArticle.slug}`}><small>이전 주제</small><strong>{previousArticle.title}</strong></Link> : <span />}
            <Link href="/way" className="way-topic-list-link">11개 주제 전체 보기</Link>
            {nextArticle ? <Link href={`/way/${nextArticle.slug}`}><small>다음 주제</small><strong>{nextArticle.title}</strong></Link> : <span />}
          </nav>
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
