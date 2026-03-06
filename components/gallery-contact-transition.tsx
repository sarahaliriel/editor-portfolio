"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Gallery from "@/components/gallery"
import Contact from "@/components/contact"

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v))
}

export default function GalleryContactTransition() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    let raf = 0

    const update = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const travel = Math.max(1, rect.height - vh)
      const p = clamp01((-rect.top) / travel)
      setProgress(p)
      raf = requestAnimationFrame(update)
    }

    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [])

  const styles = useMemo(() => {
    const slide = clamp01((progress - 0.08) / 0.78)
    const y = (1 - slide) * 100
    return { y }
  }, [progress])

  const scrollToContactOpen = (behavior: ScrollBehavior) => {
    const el = sectionRef.current
    if (!el) return

    const vh = window.innerHeight || 1
    const rect = el.getBoundingClientRect()
    const top = window.scrollY + rect.top
    const travel = Math.max(1, el.offsetHeight - vh)

    window.scrollTo({
      top: top + travel + 2,
      behavior,
    })
  }

  useEffect(() => {
    const onNav = () => scrollToContactOpen("smooth")
    window.addEventListener("nav:contact", onNav)

    const hash = typeof window !== "undefined" ? window.location.hash : ""
    if (hash === "#contact") scrollToContactOpen("auto")

    return () => window.removeEventListener("nav:contact", onNav)
  }, [])

  return (
    <section ref={sectionRef} className="relative h-[220svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-0">
          <Gallery />
        </div>

        <div
          className="absolute inset-0 z-20"
          style={{
            transform: `translate3d(0, ${styles.y}%, 0)`,
            background: "#1e1e1e",
          }}
        >
          <Contact />
        </div>
      </div>

      <div className="h-[60svh]" style={{ background: "#1e1e1e" }} />
    </section>
  )
}