"use client"

import { useEffect } from "react"
import Menu from "@/components/menu"
import HeroAboutTransition from "@/components/hero-about-transition"
import Projects from "@/components/projects"
import GalleryContactTransition from "@/components/gallery-contact-transition"
import CustomCursor from "@/components/cursor-custom"
import ScrollProgress from "@/components/scroll-progress"
import IntroOverlay from "@/components/intro-overlay"
import Footer from "@/components/footer"

export default function Page() {
  useEffect(() => {
    const hash = window.location.hash

    if (!hash) {
      const prev = window.history.scrollRestoration
      window.history.scrollRestoration = "manual"
      window.scrollTo({ top: 0, left: 0, behavior: "auto" })
      requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }))
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" })
        window.history.scrollRestoration = prev
      }, 60)
    }
  }, [])

  return (
    <main className="relative min-h-screen bg-base text-ink">
      <IntroOverlay />
      <CustomCursor />
      <ScrollProgress />

      <div className="relative z-10">
        <Menu />
        <HeroAboutTransition />
        <Projects />
        <GalleryContactTransition />
        <Footer />

      </div>
    </main>
  )
}