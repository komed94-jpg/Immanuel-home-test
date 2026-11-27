import Image from "next/image";
import Link from "next/link";
import { BibleVideoLibraryLink } from "@/components/BibleVideoLibraryLink";
import styles from "./HomeFormation.module.css";

const discTypes = [
  { letter: "D", title: "주도", detail: "결단과 추진", className: styles.drive },
  { letter: "I", title: "관계", detail: "소통과 활력", className: styles.influence },
  { letter: "S", title: "안정", detail: "배려와 협력", className: styles.steadiness },
  { letter: "C", title: "신중", detail: "분석과 정확성", className: styles.care },
];

export function HomeFormation() {
  return (
    <div className={styles.formation}>
      <div className={styles.inner}>
        <div className={styles.studyPair}>
          <section className={styles.feature} id="bible-videos" aria-labelledby="bible-video-heading">
            <figure className={styles.image}>
              <Image
                src="/videos/galilee-ministry.jpg"
                alt="갈릴리 호숫가의 배와 어부를 재현한 영상 장면"
                fill
                sizes="(max-width: 700px) 100vw, (max-width: 1400px) 46vw, 600px"
              />
            </figure>
            <div className={styles.featureBody}>
              <BibleVideoLibraryLink />
            </div>
          </section>
          <section className={styles.feature} aria-labelledby="home-study-title">
            <figure className={styles.image}>
              <Image
                src="/images/loving-jesus/study-group.jpg"
                alt="소그룹이 함께 둘러앉아 말씀을 나누는 모습"
                fill
                sizes="(max-width: 700px) 100vw, (max-width: 1400px) 46vw, 600px"
              />
            </figure>
            <div className={styles.featureBody}>
              <p className={styles.kicker} lang="en">Bible Study</p>
              <h2 id="home-study-title">성경공부</h2>
              <p className={styles.description}>말씀을 배우고 삶으로 살아냅니다. 개인 묵상부터 목장 나눔과 제자훈련까지, 함께 말씀을 읽고 질문하며 실천해 보세요.</p>
              <Link className={styles.studyLink} href="/bible-study">성경공부 시작하기 <span aria-hidden="true">→</span></Link>
            </div>
          </section>
        </div>

        <section className={styles.disc} aria-labelledby="home-disc-title">
          <div className={styles.discCopy}>
            <p className={styles.discKicker} lang="en">DISC · Relationship Formation</p>
            <h2 id="home-disc-title">상대를 파악하는 것을 넘어,<br />사랑하는 방식을 배웁니다.</h2>
            <p className={styles.discDescription}>24문항으로 내 행동을 살피고, 타인을 이해하고 존중하며, 사랑으로 섬기는 3과 관계 교육으로 이어집니다.</p>
            <div className={styles.discActions}>
              <Link className={styles.testLink} href="/disc#disc-check">내 행동 알아보기 <span aria-hidden="true">→</span></Link>
              <Link className={styles.courseLink} href="/disc/course">3과 강의 보기 <span aria-hidden="true">→</span></Link>
            </div>
          </div>
          <ul className={styles.types} aria-label="DISC 네 행동 경향">
            {discTypes.map(({ letter, title, detail, className }) => (
              <li className={className} key={letter}>
                <span className={styles.letter} lang="en">{letter}</span>
                <div><strong>{title}</strong><small>{detail}</small></div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
