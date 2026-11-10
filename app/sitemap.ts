import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { wayArticles } from "@/data/immanuel";
import { bibleVideos } from "@/data/bible-videos";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/about", "/why-immanuel", "/way", "/bible-study", "/bible-study/immanuel-basic", "/bible-study/immanuel-basic-2", "/bible-study/immanuel-way", "/bible-study/loving-jesus", "/bible-study/discernment-to-love", "/bible-reading", "/bible-world", "/disc", "/disc/course", "/services", "/services/worship", "/content", "/sermons", "/word",
    ...wayArticles.map(({slug}) => `/way/${slug}`), ...bibleVideos.map(({slug}) => `/content/bible-study/${slug}`)];
  return [...new Set(paths)].map(path => ({ url: `${SITE_URL}${path || "/"}` }));
}
