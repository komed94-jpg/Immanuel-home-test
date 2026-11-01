import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "임마누엘교회",
  description: "하나님은 사랑이십니다. 하나님은 우리와 함께하십니다.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "임마누엘교회",
    statusBarStyle: "default",
  },
  other: {
    "codex-preview": "development",
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
      <body>{children}</body>
    </html>
  );
}
