"use client";

import { useState } from "react";

type BibleAppEmbedProps = { appName: string; appUrl?: string; description: string };

export function BibleAppEmbed({ appName, appUrl, description }: BibleAppEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  if (!appUrl) return <section className="bible-app-pending" aria-live="polite"><p className="section-kicker">APP CONNECTION</p><h2>{appName} 연결 준비 중</h2><p>{description} 앱 주소를 연결하면 이 페이지에서 바로 사용할 수 있습니다.</p></section>;
  return <section className="bible-app-frame-wrap" aria-label={`${appName} 앱`}>
    {!loaded && <div className="bible-app-loading">{appName}을 불러오고 있습니다…</div>}
    <iframe className="bible-app-frame" src={appUrl} title={appName} onLoad={() => setLoaded(true)} allow="clipboard-read; clipboard-write" />
  </section>;
}
