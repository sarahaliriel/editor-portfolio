"use client"

import { useEffect } from "react"
import Menu from "@/components/layout/menu"
import HeroAboutTransition from "@/components/home/hero-about-transition"
import Projects from "@/components/home/projects"
import GalleryContactTransition from "@/components/home/gallery-contact-transition"
import ScrollProgress from "@/components/layout/scroll-progress"
import IntroOverlay from "@/components/effects/intro-overlay"

function scrollToHash(behavior: ScrollBehavior) {
  const id = window.location.hash.replace("#", "")
  if (!id) return false

  if (id === "contact") {
    window.dispatchEvent(new CustomEvent("nav:contact"))
    return true
  }

  const el = document.getElementById(id)
  if (!el) return false

  el.scrollIntoView({ behavior, block: "start" })
  return true
}

export default function Page() {
  useEffect(() => {
    const hash = window.location.hash

    if (hash) {
      const onIntroDone = () => scrollToHash("auto")
      window.addEventListener("intro:done", onIntroDone)

      const frame = requestAnimationFrame(() => {
        if (scrollToHash("auto")) return
        window.setTimeout(() => scrollToHash("auto"), 120)
      })

      const timer = window.setTimeout(() => scrollToHash("auto"), 360)

      return () => {
        window.removeEventListener("intro:done", onIntroDone)
        cancelAnimationFrame(frame)
        window.clearTimeout(timer)
      }
    } else {
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
      <ScrollProgress />

      <div className="relative z-10">
        <Menu />
        <HeroAboutTransition />
        <Projects />
        <GalleryContactTransition />
      </div>
    </main>
  )
}
