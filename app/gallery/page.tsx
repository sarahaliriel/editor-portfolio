import DesignGallery from "@/components/gallery/design-gallery"
import Menu from "@/components/layout/menu"

export default function Page() {
  return (
    <main className="relative min-h-svh bg-[#e8e7e7] text-[#1e1e1e]">
      <DesignGallery />
      <div className="relative z-10">
        <Menu />
      </div>
    </main>
  )
}
