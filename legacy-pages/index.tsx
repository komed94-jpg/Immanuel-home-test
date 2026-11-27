import Link from "next/link";
import { Layout } from "@/components/Layout";
import { HomeFormation } from "@/components/HomeFormation";
import { HomeHeroVideo } from "@/components/HomeHeroVideo";
import { HomeWayCollection } from "@/components/HomeWayCollection";
import { services } from "@/data/immanuel";
import styles from "./Home.module.css";

// Keep the quick links tied to the directory, including their public labels.
const quickLinks = [
  { href: "/word", icon: "M4 5c3-1 5-.8 8 1 3-1.8 5-2 8-1v14c-3-1-5-.8-8 1-3-1.8-5-2-8-1z M12 6v14" },
  { href: "/bible-study", icon: "M6 4h13v16H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2 M5 17c.5-.7 1.2-1 2-1h12 M9 8h6 M9 11h5" },
  { href: "/services/worship", icon: "M12 2v9 M8 6h8 M4 20v-6l8-5 8 5v6z M10 20v-5h4v5" },
  { href: "/services/prayer", icon: "M3 16l4-3 3-8c.6-1.5 2.4-.8 2 .7L11 15l-5 6 M21 16l-4-3-3-8c-.6-1.5-2.4-.8-2 .7L13 15l5 6" },
  { href: "/services/counseling", icon: "M20 11a7 7 0 0 1-7 7H9l-5 3 1.3-5A7 7 0 0 1 4 11a8 8 0 0 1 16 0z M8 10h8 M8 13h5" },
  { href: "/services/new-family", icon: "M3 11l9-8 9 8 M5 10v10h14V10 M10 20v-6h4v6" },
];

export default function Home() {
  return (
    <Layout>
      <div className={styles.page}>
        <section className={styles.hero} aria-labelledby="home-greeting">
          <div className={styles.media}><HomeHeroVideo /></div>
          <div className={styles.heroInner}>
            <p className={styles.kicker} lang="en">Word · Worship · Growth · Sending</p>
            <h1 id="home-greeting">
              <span>하나님은 사랑이십니다.</span>{" "}
              <span>하나님은 우리와</span>{" "}
              <span>함께하십니다.</span>
            </h1>
            <p className={styles.intro}>말씀 위에 세워지고, 예배로 충만해지며, 성장으로 성숙해지고, 세상으로 파송되는 공동체입니다.</p>
            <div className={styles.heroActions}>
              <Link className={styles.primary} href="/way">임마누엘의 길 <span aria-hidden="true">→</span></Link>
              <Link className={styles.secondary} href="/services/worship">예배 안내 <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <nav className={styles.services} aria-labelledby="home-services-heading">
          <div className={styles.shell}>
            <div className={styles.dockHead}>
              <h2 id="home-services-heading">교회 서비스</h2>
              <Link href="/services">전체 보기 <span aria-hidden="true">→</span></Link>
            </div>
            <ul className={styles.dock}>
              {quickLinks.map(({ href, icon }) => {
                const service = services.find((item) => item.href === href);
                if (!service) return null;
                return (
                  <li key={href}>
                    <Link href={href}>
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon} /></svg>
                      <span>{service.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        <HomeWayCollection />
        <HomeFormation />

        <section className={styles.impact} aria-labelledby="home-impact-title">
          <div className={styles.shell}>
            <h2 id="home-impact-title">세상을 이롭게 하는 사람</h2>
            <p>우리는 자기 삶의 자리에서 가정과 조직과 교회와 사회를 이롭게 하는 제자를 세웁니다.</p>
          </div>
        </section>
        <footer className={styles.footer}>
          <div className={styles.shell}>
            <strong lang="en">Immanuel Church</strong>
            <span lang="en">God is love. God is with us.</span>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
