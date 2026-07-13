import { notFound } from "next/navigation"
import ProjectGalleryDetail from "@/components/gallery/project-gallery-detail"
import Menu from "@/components/layout/menu"
import { galleryProjects, getGalleryProjectConfigBySlug } from "@/data/gallery"
import type { CSSProperties } from "react"

export function generateStaticParams() {
  return galleryProjects.map((project) => ({ slug: project.slug }))
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getGalleryProjectConfigBySlug(slug)

  if (!project) notFound()

  const themeStyles = {
    "--project-accent": project.theme.accent,
    "--project-accent-dark": project.theme.accentDark,
    "--project-accent-soft": project.theme.accentSoft,
    "--project-glow": project.theme.glow,
    "--accent": project.theme.accent,
  } as CSSProperties

  return (
    <main style={themeStyles} data-project-theme={project.slug} className="relative min-h-svh bg-[#e8e7e7] text-[#1e1e1e]">
      <ProjectGalleryDetail project={project} />
      <div className="relative z-10">
        <Menu />
      </div>
    </main>
  )
}
