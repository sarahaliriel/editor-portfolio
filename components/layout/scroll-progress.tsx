"use client"

import { useEffect, useState } from "react"

type ScrollProgressProps = {
  progress?: number
}

type ScrollTheme = "light" | "dark"

export default function ScrollProgress({ progress }: ScrollProgressProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<ScrollTheme>("light")

  useEffect(() => {
    if (progress !== undefined) return

    const onScroll = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const next = max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max))
      setScrollProgress(next)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [progress])

  useEffect(() => {
    const onMenu = (event: Event) => {
      const customEvent = event as CustomEvent<{ open: boolean }>
      setMenuOpen(Boolean(customEvent.detail?.open))
    }

    window.addEventListener("menu:state", onMenu)
    return () => window.removeEventListener("menu:state", onMenu)
  }, [])

  useEffect(() => {
    const updateTheme = () => {
      const indicatorY = window.innerHeight / 2
      const themedSections = document.querySelectorAll<HTMLElement>("[data-scroll-theme]")
      let nextTheme: ScrollTheme = "light"

      themedSections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= indicatorY && rect.bottom >= indicatorY) {
          nextTheme = section.dataset.scrollTheme === "dark" ? "dark" : "light"
        }
      })

      setTheme(nextTheme)
    }

    updateTheme()
    window.addEventListener("scroll", updateTheme, { passive: true })
    window.addEventListener("resize", updateTheme)

    return () => {
      window.removeEventListener("scroll", updateTheme)
      window.removeEventListener("resize", updateTheme)
    }
  }, [])

  const p = progress === undefined
    ? scrollProgress
    : Math.min(1, Math.max(0, progress))

  const pct = Math.round(p * 100)

  if (menuOpen) return null

  const foreground = theme === "dark" ? "text-[#e8e7e7]" : "text-[var(--accent)]"
  const progressColor = theme === "dark" ? "bg-[#e8e7e7]" : "bg-[var(--accent)]"
  const trackColor = theme === "dark" ? "bg-[#e8e7e7]/25" : "bg-ink/20"

  return (
    <div className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 sm:block">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end gap-1">
          <div className={`text-[11px] font-semibold uppercase tracking-[0.16em] opacity-70 transition-colors duration-300 ${foreground}`}>
            Scroll
          </div>
          <div className={`text-[12px] font-medium tabular-nums opacity-70 transition-colors duration-300 ${foreground}`}>
            {pct}%
          </div>
        </div>

        <div className={`relative h-40 w-0.5 overflow-hidden rounded-full transition-colors duration-300 ${trackColor}`}>
          <div
            className={`absolute bottom-0 left-0 w-full rounded-full transition-[height,background-color] duration-300 ${progressColor}`}
            style={{ height: `${p * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
