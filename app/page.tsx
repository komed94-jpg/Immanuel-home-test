import type { Metadata } from "next";

const title = "임마누엘교회";
const description = "하나님은 우리와 함께하십니다. 임마누엘교회의 신앙 고백, 온라인 성경공부, 성경 해설 영상과 예배·공동체 안내를 만나보세요.";
const shareImage = "https://immanuelway.church/images/immanuel-share-20261101.jpg";

// Static metadata is included in the initial HTML for link-preview crawlers.
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://immanuelway.church/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: title,
    url: "https://immanuelway.church/",
    title,
    description,
    images: [{
      url: shareImage,
      width: 2048,
      height: 1365,
      type: "image/jpeg",
      alt: "임마누엘교회 — 하나님은 사랑이십니다. 하나님은 우리와 함께하십니다.",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [shareImage],
  },
};

export { default } from "@/legacy-pages/index";
