import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
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
  return video ? pageMetadata(`${video.title} | 임마누엘교회 성경공부`, video.description, `/content/bible-study/${video.slug}`) : {};
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const video = bibleVideos.find((item) => item.slug === slug);
  if (!video) notFound();
  return <BibleStudyVideo video={video} />;
}
