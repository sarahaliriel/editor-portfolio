import type { MetadataRoute } from "next"
import { galleryProjects } from "@/data/gallery"
import { absoluteUrl } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "/", priority: 1, changeFrequency: "monthly" as const },
    { path: "/gallery", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/allprojects", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/more-about", priority: 0.7, changeFrequency: "yearly" as const },
  ]

  return [
    ...staticRoutes.map(({ path, ...route }) => ({ url: absoluteUrl(path), ...route })),
    ...galleryProjects.map((project) => ({
      url: absoluteUrl(`/gallery/${project.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ]
}

