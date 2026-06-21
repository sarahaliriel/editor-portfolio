import type { I18nKey } from "@/components/providers/i18n"

export type ProjectVideo = { kind: "mp4"; src: string } | { kind: "embed"; src: string }

export type FeaturedProject = {
  client: string
  location: string
  services: string
  year: string
  thumb: string
  video?: ProjectVideo
}

type ProjectConfig = {
  clientKey: I18nKey
  locationKey: I18nKey
  servicesKey: I18nKey
  year: string
  thumb: string
  video?: ProjectVideo
}

const featuredProjectConfig: ProjectConfig[] = [
  {
    clientKey: "p1Client",
    locationKey: "p1Location",
    servicesKey: "p1Services",
    year: "2024",
    thumb: "/images/projects/featured-cortes.png",
    video: { kind: "mp4", src: "/videos/social/cortes.mp4" },
  },
  {
    clientKey: "p2Client",
    locationKey: "p2Location",
    servicesKey: "p2Services",
    year: "2024",
    thumb: "/images/projects/featured-cortes-dinamicos.png",
    video: { kind: "mp4", src: "/videos/social/cortes-dinamicos.mp4" },
  },
  {
    clientKey: "p3Client",
    locationKey: "p3Location",
    servicesKey: "p3Services",
    year: "2023",
    thumb: "/images/projects/featured-storytelling.png",
    video: { kind: "mp4", src: "/videos/storytelling/storytelling.mp4" },
  },
  {
    clientKey: "p4Client",
    locationKey: "p4Location",
    servicesKey: "p4Services",
    year: "2023",
    thumb: "/images/projects/featured-ugc.png",
    video: { kind: "mp4", src: "/videos/social/ugc.mp4" },
  },
]

export function getFeaturedProjects(t: (key: I18nKey) => string): FeaturedProject[] {
  return featuredProjectConfig.map((project) => ({
    client: t(project.clientKey),
    location: t(project.locationKey),
    services: t(project.servicesKey),
    year: project.year,
    thumb: project.thumb,
    video: project.video,
  }))
}
