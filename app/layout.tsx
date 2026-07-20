import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "임마누엘교회",
  description: "하나님은 사랑이십니다. 하나님은 우리와 함께하십니다.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
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
