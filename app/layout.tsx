import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, safeJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "임마누엘교회",
  description: "하나님은 사랑이십니다. 하나님은 우리와 함께하십니다.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "임마누엘교회",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/icons/immanuel-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.svg?v=20261101", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png?v=20261101", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
          "@context": "https://schema.org", "@graph": [
            { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, alternateName: "Immanuel Church", url: SITE_URL, description: SITE_DESCRIPTION },
            { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL, inLanguage: "ko-KR", publisher: { "@id": `${SITE_URL}/#organization` } }
          ] }) }} />
        {children}
      </body>
    </html>
  );
}
