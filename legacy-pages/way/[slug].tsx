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
