import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BibleStudyVideo from "@/components/BibleStudyVideo";
import { bibleVideos } from "@/data/bible-videos";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return bibleVideos.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const video = bibleVideos.find((item) => item.slug === slug);
  return video ? { title: `${video.title} | 임마누엘교회 성경공부`, description: video.description } : {};
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const video = bibleVideos.find((item) => item.slug === slug);
  if (!video) notFound();
  return <BibleStudyVideo video={video} />;
}
