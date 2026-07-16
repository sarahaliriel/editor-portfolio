import type { Lang } from "@/components/providers/i18n"

export type CategoryKey = "lab" | "social" | "story"
type LocalizedText = Record<Lang, string>

const VIDEO_CDN_BASE = (
  process.env.NEXT_PUBLIC_VIDEO_CDN_BASE ??
  "https://pub-04fcc3bcef3f485f8e93619eedd7a237.r2.dev"
).replace(/\/$/, "")

type ArchiveProjectSource = {
  id: string
  title: LocalizedText
  category: CategoryKey
  tagsLine: LocalizedText
  year: string
  tools: string
  src: string
}

export type ArchiveProject = Omit<ArchiveProjectSource, "title" | "tagsLine"> & {
  title: string
  tagsLine: string
}

const archiveProjectSources: ArchiveProjectSource[] = [
  {
    id: "01",
    title: { pt: "Tipografia & Motion", en: "Typography & Motion", es: "Tipografía & Movimiento" },
    category: "lab",
    tagsLine: { pt: "tipografia cinética | edição rítmica", en: "kinetic typography | rhythmic edit", es: "tipografía cinética | edición rítmica" },
    year: "2025",
    tools: "Alight Motion",
    src: `${VIDEO_CDN_BASE}/01-tipografia-e-motion.mp4`,
  },
  {
    id: "02",
    title: { pt: "Tipografia & Mograph Edit", en: "Typography & Mograph Edit", es: "Tipografía & Mograph Edit" },
    category: "lab",
    tagsLine: { pt: "tipografia animada | short-form", en: "animated typography | short-form", es: "tipografía animada | short-form" },
    year: "2025",
    tools: "Alight Motion",
    src: `${VIDEO_CDN_BASE}/02-tipografia-edit.mp4`,
  },
  {
    id: "03",
    title: { pt: "Corte Dinâmico Podcast", en: "Dynamic Podcast Cut", es: "Corte Dinámico de Pódcast" },
    category: "social",
    tagsLine: { pt: "corte de podcast | legendas dinâmicas", en: "podcast cut | dynamic captions", es: "corte de pódcast | subtítulos dinámicos" },
    year: "2024",
    tools: "Alight Motion • CapCut",
    src: `${VIDEO_CDN_BASE}/03-corte-podcast.mp4`,
  },
  {
    id: "04",
    title: { pt: "História Stop Motion", en: "Stop Motion Story", es: "Historia en Stop Motion" },
    category: "story",
    tagsLine: { pt: "storytelling | stop motion | 1º lugar", en: "storytelling | stop motion | 1st place", es: "storytelling | stop motion | 1.er lugar" },
    year: "2025",
    tools: "Alight Motion",
    src: `${VIDEO_CDN_BASE}/04-historia-stop-motion.mp4`,
  },
  {
    id: "05",
    title: { pt: "Corte de Podcast", en: "Podcast Cut", es: "Corte de Pódcast" },
    category: "social",
    tagsLine: { pt: "corte de podcast | legendas dinâmicas", en: "podcast cut | dynamic captions", es: "corte de pódcast | subtítulos dinámicos" },
    year: "2025",
    tools: "DaVinci Resolve • CapCut",
    src: `${VIDEO_CDN_BASE}/05-podcast.mp4`,
  },
  {
    id: "06",
    title: { pt: "Jugg Edit", en: "Jugg Edit", es: "Jugg Edit" },
    category: "lab",
    tagsLine: { pt: "jugg edit | efeitos e transições", en: "jugg edit | effects and transitions", es: "jugg edit | efectos y transiciones" },
    year: "2026",
    tools: "Alight Motion",
    src: `${VIDEO_CDN_BASE}/06-jugg-edit.mp4`,
  },
  {
    id: "07",
    title: { pt: "Short Dinâmico", en: "Dynamic Short", es: "Short Dinámico" },
    category: "social",
    tagsLine: { pt: "short-form | transições dinâmicas", en: "short-form | dynamic transitions", es: "short-form | transiciones dinámicas" },
    year: "2026",
    tools: "Alight Motion • CapCut",
    src: `${VIDEO_CDN_BASE}/07-short-dinamico.mp4`,
  },
  {
    id: "08",
    title: { pt: "PNG Aesthetic Edit", en: "Aesthetic PNG Edit", es: "Edit Estético en PNG" },
    category: "lab",
    tagsLine: { pt: "colagem PNG | estética TikTok", en: "PNG collage | TikTok aesthetic", es: "collage PNG | estética TikTok" },
    year: "2024",
    tools: "Alight Motion • Canva",
    src: `${VIDEO_CDN_BASE}/08-png-edit.mp4`,
  },
  {
    id: "09",
    title: { pt: "Short & Motion", en: "Short & Motion", es: "Short & Motion" },
    category: "social",
    tagsLine: { pt: "motion graphics | legendas dinâmicas", en: "motion graphics | dynamic captions", es: "motion graphics | subtítulos dinámicos" },
    year: "2024",
    tools: "CapCut • Alight Motion",
    src: `${VIDEO_CDN_BASE}/09-short-motion.mp4`,
  },
]

export function getArchiveProjects(lang: Lang): ArchiveProject[] {
  return archiveProjectSources.map(({ title, tagsLine, ...project }) => ({ ...project, title: title[lang], tagsLine: tagsLine[lang] }))
}
