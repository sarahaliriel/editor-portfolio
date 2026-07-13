"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Menu from "@/components/layout/menu"
import Hero from "@/components/home/hero"
import WhatMoves from "@/components/home/what-moves"
import SelectedWork from "@/components/home/selected-work"
import MotionSelected from "@/components/home/motion-selected"
import ProjectToCtaTransition from "@/components/home/project-to-cta-transition"
import ScrollProgress from "@/components/layout/scroll-progress"
import NarrativeOrb from "@/components/effects/narrative-orb"
import { ReactiveDotField } from "@/components/effects/reactive-dot-field"

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
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash

    if (hash === "#about") {
      router.replace("/more-about")
      return
    }

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
    }
  }, [router])

  return (
    <main className="relative min-h-screen bg-base text-ink">
      <ScrollProgress />
      <NarrativeOrb />

      <div className="relative z-10">
        <Menu />
        <Hero />
        <div className="relative isolate overflow-x-clip bg-[#1e1e1e] text-[#e8e7e7]">
          <ReactiveDotField fill className="[mask-image:linear-gradient(to_bottom,transparent_0%,black_6%,black_92%,transparent_100%)]" />
          <WhatMoves />
          <SelectedWork />
          <MotionSelected />
          <ProjectToCtaTransition />
        </div>
      </div>
    </main>
  )
}
