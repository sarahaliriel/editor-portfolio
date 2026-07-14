"use client"

import { useEffect, useState } from "react"

export default function ScrollProgress() {
  const [p, setP] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const next = max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max))
      setP(next)
    }

    const onMenu = (e: Event) => {
      const ce = e as CustomEvent<{ open: boolean }>
      setMenuOpen(Boolean(ce.detail?.open))
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    window.addEventListener("menu:state", onMenu)

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      window.removeEventListener("menu:state", onMenu)
    }
  }, [])

  const pct = Math.round(p * 100)

  if (menuOpen) return null

  return (
    <div className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 sm:block">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end gap-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)] opacity-70">
            Scroll
          </div>
          <div className="text-[12px] font-medium tabular-nums text-[var(--accent)] opacity-70">
            {pct}%
          </div>
        </div>

        <div className="relative h-40 w-0.5 overflow-hidden rounded-full bg-ink/20">
          <div
            className="absolute bottom-0 left-0 w-full rounded-full bg-[var(--accent)]"
            style={{ height: `${p * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
