export type CategoryKey = "lab" | "social" | "story"

export type ArchiveProject = {
  id: string
  title: string
  category: CategoryKey
  tagsLine: string
  year: string
  tools: string
  cover: string
  poster: string
  src: string
}

export const archiveProjects: ArchiveProject[] = [
  {
    id: "01",
    title: "Signal Cut",
    category: "lab",
    tagsLine: "anime edit | jugg | alight motion",
    year: "2026",
    tools: "Alight Motion",
    cover: "/images/projects/signal-cut.png",
    poster: "/images/projects/signal-cut.png",
    src: "https://drive.google.com/file/d/1bwZoucbHUOZ6wa25rGqYbcJvGtvkuHIz/view?usp=sharing",
  },
  {
    id: "02",
    title: "Type Pulse",
    category: "lab",
    tagsLine: "typography | mograph | rhythm",
    year: "2026",
    tools: "Alight Motion",
    cover: "/images/projects/type-pulse.png",
    poster: "/images/projects/type-pulse.png",
    src: "https://drive.google.com/file/d/1O9yd7LiMqSQG3blYC3UbwfvHCno3QGDj/view?usp=drive_link",
  },
  {
    id: "03",
    title: "Glitch Bloom",
    category: "lab",
    tagsLine: "transition | glitch | aesthetic",
    year: "2025",
    tools: "Alight Motion",
    cover: "/images/projects/glitch-bloom.png",
    poster: "/images/projects/glitch-bloom.png",
    src: "https://drive.google.com/file/d/YOUR_FILE_ID_03/view?usp=sharing",
  },
  {
    id: "04",
    title: "Retention Edit",
    category: "social",
    tagsLine: "shorts | captions | cap cut",
    year: "2025",
    tools: "CapCut",
    cover: "/images/projects/retention-edit.png",
    poster: "/images/projects/retention-edit.png",
    src: "https://drive.google.com/file/d/YOUR_FILE_ID_04/view?usp=sharing",
  },
  {
    id: "05",
    title: "Caption System",
    category: "social",
    tagsLine: "shorts | captions | davinci",
    year: "2025",
    tools: "DaVinci Resolve",
    cover: "/images/projects/caption-system.png",
    poster: "/images/projects/caption-system.png",
    src: "https://drive.google.com/file/d/1mAOPPyicmeXQjsP0HCd5tD6nAy7Wh5pV/view?usp=sharing",
  },
  {
    id: "06",
    title: "Motion Thread",
    category: "lab",
    tagsLine: "typography | transitions | alight motion",
    year: "2025",
    tools: "Alight Motion",
    cover: "/images/projects/motion-thread.png",
    poster: "/images/projects/motion-thread.png",
    src: "https://drive.google.com/file/d/YOUR_FILE_ID_06/view?usp=sharing",
  },
  {
    id: "07",
    title: "Social Loop",
    category: "social",
    tagsLine: "shorts | captions | cap cut",
    year: "2025",
    tools: "CapCut",
    cover: "/images/projects/social-loop.png",
    poster: "/images/projects/social-loop.png",
    src: "https://drive.google.com/file/d/YOUR_FILE_ID_07/view?usp=sharing",
  },
  {
    id: "08",
    title: "PNG Texture",
    category: "lab",
    tagsLine: "png style | aesthetic | alight motion",
    year: "2024",
    tools: "Alight Motion",
    cover: "/images/projects/png-texture.png",
    poster: "/images/projects/png-texture.png",
    src: "https://drive.google.com/file/d/YOUR_FILE_ID_08/view?usp=sharing",
  },
  {
    id: "09",
    title: "Story Fold",
    category: "story",
    tagsLine: "stop motion | narrative | pacing",
    year: "2024",
    tools: "Alight Motion",
    cover: "/images/projects/story-fold.png",
    poster: "/images/projects/story-fold.png",
    src: "https://drive.google.com/file/d/YOUR_FILE_ID_09/view?usp=sharing",
  },
]
