import Image from "next/image";
import Link from "next/link";
import { wayArticles } from "@/data/immanuel";
import styles from "./HomeWayCollection.module.css";

const photographs: Record<string, string> = {
  belief: "/images/loving-jesus/open-bible.jpg",
  worship: "/images/sunday/2.jpg",
  prayer: "/images/sunday/3.jpg",
};

export function HomeWayCollection() {
  const featured = wayArticles.slice(0, 3);
  const remaining = wayArticles.slice(featured.length);

  return (
    <section className={styles.section} aria-labelledby="home-way-title">
      <div className={styles.inner}>
        <div className={styles.heading}>
          <h2 id="home-way-title">임마누엘의 길</h2>
          <p>
            {wayArticles.length}개의 길은 단순한 메뉴가 아니라, 임마누엘교회가 믿고 예배하고
            기도하고 성장하며 세상으로 나아가는 신앙의 고백입니다.
          </p>
        </div>

        <ol className={styles.features}>
          {featured.map((article, index) => (
            <li key={article.slug}>
              <Link
                href={`/way/${article.slug}`}
                className={styles.feature}
                aria-labelledby={`home-way-${article.slug}`}
              >
                <div className={styles.photograph}>
                  <Image
                    src={photographs[article.slug] ?? article.image.url}
                    alt=""
                    fill
                    sizes={index === 0 ? "(max-width: 760px) 90vw, 50vw" : "(max-width: 480px) 25vw, 160px"}
                    unoptimized
                  />
                </div>
                <div className={styles.featureCopy}>
                  <span className={styles.featureMeta}>
                    <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                    {article.keywords.join(" · ")}
                  </span>
                  <h3 id={`home-way-${article.slug}`}>{article.title}</h3>
                  <p>{article.quote}</p>
                  <span className={styles.arrow} aria-hidden="true">↗</span>
                </div>
              </Link>
            </li>
          ))}
        </ol>

        {remaining.length > 0 && (
          <details className={styles.directory}>
            <summary>
              <span className={styles.whenClosed}>나머지 {remaining.length}개의 길 펼치기</span>
              <span className={styles.whenOpen}>나머지 {remaining.length}개의 길 접기</span>
              <span className={styles.chevron} aria-hidden="true" />
            </summary>
            <ol className={styles.list} start={featured.length + 1}>
              {remaining.map((article, index) => (
                <li key={article.slug}>
                  <Link href={`/way/${article.slug}`} aria-labelledby={`home-way-${article.slug}`}>
                    <span className={styles.number}>{String(featured.length + index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 id={`home-way-${article.slug}`}>{article.title}</h3>
                      <p>{article.quote}</p>
                      <span className={styles.keywords}>{article.keywords.join(" · ")}</span>
                    </div>
                    <span className={styles.listArrow} aria-hidden="true">↗</span>
                  </Link>
                </li>
              ))}
            </ol>
          </details>
        )}
      </div>
    </section>
  );
}
