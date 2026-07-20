import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import Nav from "../../Nav";

export const problemPages = [
  {
    slug: "overcome",
    title: "극복할 문제",
    quote: "믿음으로 통과해야 할 삶의 자리",
    keywords: "믿음 · 통과 · 성숙",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2200&q=88",
    content: [
      "삶에는 극복해야 할 문제가 있습니다.",
      "질병과 경제의 어려움, 관계의 상처와 삶의 무게처럼 믿음으로 견디고 통과해야 할 문제들이 있습니다.",
      "이런 문제들은 우리를 무너뜨리기 위해서만 오는 것이 아니라, 때로는 우리를 더 깊게 빚고 성숙하게 하시는 하나님의 과정이 되기도 합니다.",
      "그러므로 우리는 극복할 문제 앞에서 쉽게 포기하지 않고, 하나님을 신뢰하며 믿음으로 통과하기를 선택합니다."
    ]
  },
  {
    slug: "temptation",
    title: "피할 유혹",
    quote: "분별하여 멀리해야 할 영적 위험",
    keywords: "분별 · 지혜 · 거룩",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2200&q=88",
    content: [
      "삶에는 피해야 할 유혹이 있습니다.",
      "정욕과 탐욕, 교만과 자기중심성, 무분별한 성공욕과 권력욕처럼 우리의 영혼을 무너뜨리는 유혹들이 있습니다.",
      "유혹은 이겨내야 할 문제가 아니라 분별하고 멀리해야 할 위험입니다.",
      "우리는 붙들어야 할 것은 끝까지 붙들고, 내려놓아야 할 것은 미련 없이 내려놓는 영적 분별을 배웁니다."
    ]
  }
];

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: problemPages.map((page) => ({ params: { slug: page.slug } })),
  fallback: false
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const page = problemPages.find((item) => item.slug === params?.slug);

  if (!page) {
    return { notFound: true };
  }

  return { props: { page } };
};

// The original page data is retained verbatim; this explicit shape only supports App Router validation.
export default function ProblemDetail({ page }: { page: (typeof problemPages)[number] }) {
  return (
    <main>
      <Nav />
      <section className="way-detail-hero" style={{ backgroundImage: `url(${page.image})` }}>
        <div className="way-detail-hero-inner">
          <Link href="/problems" className="way-back-link">
            삶의 두 갈래
          </Link>
          <h1>{page.title}</h1>
          <p>{page.quote}</p>
          <span>{page.keywords}</span>
        </div>
      </section>
      <section className="way-article">
        <article className="way-article-card">
          {page.content.map((paragraph: string, index: number) => (
            <p key={index}>{paragraph}</p>
          ))}
        </article>
      </section>
    </main>
  );
}
