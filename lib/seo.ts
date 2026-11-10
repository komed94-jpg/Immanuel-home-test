import type { Metadata } from "next";
export const SITE_URL = "https://immanuelway.church";
export const SITE_NAME = "임마누엘교회";
export const SITE_DESCRIPTION = "임마누엘교회의 신앙 고백과 임마누엘의 길, 온라인 성경공부, 성경 해설 영상, 예배와 공동체 안내를 만나보세요.";
export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = new URL(path, SITE_URL).toString();
  return { title, description, alternates: { canonical: url },
    openGraph: { type: "website", locale: "ko_KR", siteName: SITE_NAME, title, description, url,
      images: [{ url: `${SITE_URL}/images/immanuel-share-20261101.jpg`, width: 2048, height: 1365, alt: SITE_NAME }] },
    twitter: { card: "summary_large_image", title, description, images: [`${SITE_URL}/images/immanuel-share-20261101.jpg`] } };
}
export function safeJsonLd(value: unknown) { return JSON.stringify(value).replace(/</g, "\\u003c"); }
