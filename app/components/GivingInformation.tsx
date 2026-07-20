"use client";

import { useEffect, useState } from "react";

type GivingInfo = { bank: string; accountNumber: string; accountHolder: string; note: string | null };

export function GivingInformation() {
  const [information, setInformation] = useState<GivingInfo | null | undefined>(undefined);
  useEffect(() => { fetch("/api/giving").then((response) => response.json()).then((value) => { const data = value as { information?: GivingInfo | null }; setInformation(data.information ?? null); }).catch(() => setInformation(null)); }, []);
  if (information === undefined) return <section className="giving-account resource-empty"><p>헌금 안내를 불러오는 중입니다…</p></section>;
  if (!information) return <section className="giving-account resource-empty"><p>온라인 헌금 계좌 정보가 아직 등록되지 않았습니다.</p></section>;
  return <section className="giving-account" aria-label="온라인 헌금 계좌">
    <p className="section-kicker">ONLINE GIVING</p><h2>온라인 헌금 계좌</h2>
    <dl><div><dt>은행</dt><dd>{information.bank}</dd></div><div><dt>계좌번호</dt><dd>{information.accountNumber}</dd></div><div><dt>예금주</dt><dd>{information.accountHolder}</dd></div></dl>
    {information.note && <p>{information.note}</p>}
  </section>;
}
