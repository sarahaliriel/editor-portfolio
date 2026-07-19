import type { Lang } from "@/components/providers/i18n"

type ResumeFile = {
  href: string
  downloadName: string
}

const RESUME_FILES: Record<Lang, ResumeFile> = {
  pt: {
    href: "/documents/sarah-aliriel-cv-pt.pdf",
    downloadName: "sarah-aliriel-curriculo.pdf",
  },
  en: {
    href: "/documents/sarah-aliriel-cv-en.pdf",
    downloadName: "sarah-aliriel-resume.pdf",
  },
  es: {
    href: "/documents/sarah-aliriel-cv-es.pdf",
    downloadName: "sarah-aliriel-curriculum.pdf",
  },
}

const FALLBACK_LANGUAGE: Lang = "en"

export function getResumeFile(language: string): ResumeFile {
  const normalizedLanguage = language.toLowerCase().split("-")[0] as Lang

  return RESUME_FILES[normalizedLanguage] ?? RESUME_FILES[FALLBACK_LANGUAGE]
}
