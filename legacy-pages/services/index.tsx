import { Layout } from "@/components/Layout";
import { services } from "@/data/immanuel";

const serviceDetails: Record<string, { label: string; body: string }> = {
  word: {
    label: "말씀",
    body: "하루를 말씀으로 시작하고, 오늘의 마음과 선택을 하나님 앞에서 다시 정렬합니다."
  },
  worship: {
    label: "예배",
    body: "예배 시간과 장소를 확인하고, 공동체가 함께 하나님께 나아가는 흐름을 안내합니다."
  },
  prayer: {
    label: "정직한 기도",
    body: "혼자 짊어지지 않고, 공동체와 함께 숨김없이 하나님께 나아가도록 돕습니다."
  },
  counseling: {
    label: "상담",
    body: "삶과 신앙의 어려움을 혼자 짊어지지 않고 목회적 돌봄 안에서 함께 나눕니다."
  },
  spirit: {
    label: "성령",
    body: "성령의 임재와 회복을 사모하며 함께 예배하고 기도하는 자리로 연결합니다."
  },
  "spirit-ministry": {
    label: "성령",
    body: "성령의 임재와 회복을 사모하며 함께 예배하고 기도하는 자리로 연결합니다."
  },
  "bible-conference": {
    label: "말씀",
    body: "말씀 앞에 함께 서기 위한 사경회 요청을 접수하고 일정을 협의합니다."
  },
  discipleship: {
    label: "성장",
    body: "말씀과 성령 안에서 성품과 역량이 함께 자라는 훈련의 길을 안내합니다."
  },
  growth: {
    label: "성장",
    body: "말씀과 성령 안에서 성품과 역량이 함께 자라는 훈련의 길을 안내합니다."
  },
  community: {
    label: "공동체",
    body: "사랑받은 사람들이 서로의 삶을 품고 돌보는 작은 공동체로 연결합니다."
  },
  giving: {
    label: "드림",
    body: "헌금은 결제가 아니라 예배입니다. 받은 은혜에 감사와 신뢰로 응답합니다."
  },
  sermons: {
    label: "기록",
    body: "지나간 말씀을 다시 붙들고 삶의 자리에서 들을 수 있도록 정리합니다."
  },
  events: {
    label: "일정",
    body: "예배와 모임, 훈련과 사역의 시간을 한눈에 확인하도록 돕습니다."
  },
  archive: {
    label: "기록",
    body: "지나간 말씀을 다시 붙들고 삶의 자리에서 들을 수 있도록 정리합니다."
  },
  calendar: {
    label: "일정",
    body: "예배와 모임, 훈련과 사역의 시간을 한눈에 확인하도록 돕습니다."
  },
  "new-family": {
    label: "새가족",
    body: "처음 오신 분들이 임마누엘 공동체 안으로 자연스럽게 들어오도록 안내합니다."
  }
};

const icons = [
  <svg key="word" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H20v17H8.5A3.5 3.5 0 0 0 5 22V5.5Z" />
    <path d="M5 5.5A3.5 3.5 0 0 0 1.5 2H1v17h.5A3.5 3.5 0 0 1 5 22V5.5Z" />
  </svg>,
  <svg key="worship" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2v20" />
    <path d="M7 7h10" />
    <path d="M5 22h14" />
    <path d="M8 22c0-4 1.5-7 4-7s4 3 4 7" />
  </svg>,
  <svg key="prayer" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.5 3.5 12 11l3.5-7.5" />
    <path d="M12 11v10" />
    <path d="M7 21h10" />
    <path d="M4 12c2.5 0 5 1.8 8 9" />
    <path d="M20 12c-2.5 0-5 1.8-8 9" />
  </svg>,
  <svg key="counseling" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
    <path d="M16 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path d="M2 21c.8-4 3-6 6-6s5.2 2 6 6" />
    <path d="M13 20c.6-2.7 2.1-4 4-4 2.2 0 3.7 1.4 4.3 4" />
  </svg>,
  <svg key="spirit" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 3c4 3 6 6 6 10a6 6 0 0 1-12 0c0-4 2-7 6-10Z" />
    <path d="M9 14c1.6 1.6 4.4 1.6 6 0" />
  </svg>,
  <svg key="bible-conference" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H20v17H8.5A3.5 3.5 0 0 0 5 22V5.5Z" />
    <path d="M5 5.5A3.5 3.5 0 0 0 1.5 2H1v17h.5A3.5 3.5 0 0 1 5 22V5.5Z" />
  </svg>,
  <svg key="growth" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 19c6-1 10-5 12-13" />
    <path d="M8 18c0-4 2-7 6-9" />
    <path d="M15 6h5v5" />
  </svg>,
  <svg key="community" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
    <path d="M16 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path d="M2 21c.8-4 3-6 6-6s5.2 2 6 6" />
    <path d="M13 20c.6-2.7 2.1-4 4-4 2.2 0 3.7 1.4 4.3 4" />
  </svg>,
  <svg key="giving" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 21s8-4.7 8-11a4.5 4.5 0 0 0-8-2.8A4.5 4.5 0 0 0 4 10c0 6.3 8 11 8 11Z" />
  </svg>,
  <svg key="archive" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 7h16" />
    <path d="M6 7v13h12V7" />
    <path d="M8 4h8l2 3H6l2-3Z" />
    <path d="M10 12h4" />
  </svg>,
  <svg key="calendar" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 5h14v15H5z" />
    <path d="M8 3v4" />
    <path d="M16 3v4" />
    <path d="M5 10h14" />
  </svg>,
  <svg key="new-family" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 3v18" />
    <path d="M3 12h18" />
    <path d="M6 6c4 1 8 1 12 0" />
    <path d="M6 18c4-1 8-1 12 0" />
  </svg>
];

function getSlug(href: string) {
  return href.includes("#")
    ? href.split("#")[1] ?? ""
    : href.split("/").filter(Boolean).at(-1) ?? "";
}

export default function ServicesPage() {
  return (
    <Layout>
      <section className="services-editorial">
        <div className="services-hero-inner">
          <p className="eyebrow">LIFE INTERFACE</p>
          <h1>
            <span>임마누엘 삶의</span>
            <span>인터페이스</span>
          </h1>
          <p>기능 메뉴가 아니라, 함께하시는 하나님을 삶으로 만나는 자리입니다.</p>
        </div>
      </section>

      <section className="services-section">
        <div className="services-grid">
          {services.map((service, index) => {
            const slug = getSlug(service.href);
            const detail = serviceDetails[slug];

            return (
              <a
                className="service-tile"
                href={service.href}
                id={slug}
                key={service.title}
              >
                <span className="service-icon">{icons[index]}</span>
                <small>{String(index + 1).padStart(2, "0")} · {detail?.label}</small>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
                <em>{detail?.body}</em>
              </a>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}
