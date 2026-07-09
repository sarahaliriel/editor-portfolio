import type { I18nKey } from "@/components/providers/i18n"

export type SelectedWorkItem = {
  id: string
  type: "design"
  title: string
  year: string
  category: string
  tools: string
  description: string
  image?: string
}

type Translate = (key: I18nKey) => string

export function getSelectedWork(t: Translate): SelectedWorkItem[] {
  return [
    {
      id: "01",
      type: "design",
      title: t("selectedWork01Title"),
      year: "2026",
      category: t("selectedWork01Category"),
      tools: "Canva • Photopea",
      description: t("selectedWork01Description"),
      image: "/images/projects/frigideiraAI.png",
    },
    {
      id: "02",
      type: "design",
      title: t("selectedWork02Title"),
      year: "2025 - 2026",
      category: t("selectedWork02Category"),
      tools: "Canva • Figma",
      description: t("selectedWork02Description"),
      image: "/images/projects/therealtochamock.png",
    },
    {
      id: "03",
      type: "design",
      title: t("selectedWork03Title"),
      year: "2026",
      category: t("selectedWork03Category"),
      tools: "Canva • Adobe Illustrator • Photopea",
      description: t("selectedWork03Description"),
      image: "/images/projects/sdpmock.png",
    },
  ]
}
