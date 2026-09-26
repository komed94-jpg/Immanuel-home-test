import type { Metadata } from "next";
import { Layout } from "@/components/Layout";
import { BibleReading } from "./BibleReading";

export const metadata: Metadata = {
  title: "성경읽기 | 임마누엘교회",
  description: "하루 3~4장씩 성경 66권을 읽고 365일 진도를 기록합니다.",
};

export default function BibleReadingPage() {
  return <Layout><BibleReading /></Layout>;
}
