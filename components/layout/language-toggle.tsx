"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Lang, useI18n } from "@/components/providers/i18n"

const ORDER: Lang[] = ["pt", "en", "es"]

function shortLabel(l: Lang) {
  if (l === "pt") return "PT"
  if (l === "en") return "EN"
  return "ES"
}

export default function LanguageToggle() {
  const { lang, setLang, t } = useI18n()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  const next = useMemo(() => {
    const idx = ORDER.indexOf(lang)
    return ORDER[(idx + 1) % ORDER.length]
  }, [lang])

  useEffect(() => {
    if (!open) return

    const onDown = (e: PointerEvent) => {
      const el = wrapRef.current
      if (!el) return
      if (!el.contains(e.target as Node)) setOpen(false)
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }

    window.addEventListener("pointerdown", onDown)
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  const pick = (l: Lang) => {
    setLang(l)
    setOpen(false)
  }

  const cycle = () => {
    if (open) return
    setLang(next)
  }

  return (
    <div ref={wrapRef} className="fixed bottom-5 right-5 z-96">
      <div className="relative">
        <button
          type="button"
          aria-label={t("langLabel")}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          onDoubleClick={cycle}
          className={[
            "group relative grid h-14 w-14 place-items-center rounded-full",
            "bg-[#1e1e1e]/72 backdrop-blur-xl",
            "border border-white/40",
            "shadow-[0_18px_70px_rgba(0,0,0,0.35)]",
            "transition-transform duration-300 hover:scale-[1.04] active:scale-[0.97]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
          ].join(" ")}
        >
          <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 ring-1 ring-[#1800ad]/35" />
          <span className="pointer-events-none absolute -inset-1 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(24,0,173,0.35),rgba(24,0,173,0)_60%)] opacity-55 blur-md" />

          <span className="relative grid place-items-center">
            <span className="text-[12px] font-semibold tracking-[0.18em] text-[#e8e7e7]">{shortLabel(lang)}</span>
            <span className="mt-0.5 text-[10px] tracking-[0.18em] text-white/55">{shortLabel(next)}</span>
          </span>
        </button>

        <div
          className={[
            "absolute bottom-[calc(100%+10px)] right-0",
            "origin-bottom-right transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
            open ? "scale-100 opacity-100 translate-y-0 pointer-events-auto" : "scale-95 opacity-0 translate-y-1 pointer-events-none",
          ].join(" ")}
        >
          <div className="min-w-44 overflow-hidden rounded-2xl border border-white/18 bg-[#1e1e1e]/88 backdrop-blur-xl shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
            <div className="px-4 pt-3 pb-2 text-[11px] tracking-[0.22em] uppercase text-white/55">{t("langLabel")}</div>

            <div className="h-px w-full bg-white/10" />

            <div className="p-2">
              {ORDER.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => pick(l)}
                  className={[
                    "group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left",
                    "transition-colors duration-200",
                    l === lang ? "bg-white/8" : "hover:bg-white/6",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={[
                        "inline-flex h-7 w-7 items-center justify-center rounded-full border",
                        l === lang ? "border-[#1800ad]/70 bg-[#1800ad]/12" : "border-white/14 bg-white/4",
                      ].join(" ")}
                    >
                      <span className="text-[11px] font-semibold tracking-[0.18em] text-white/85">{shortLabel(l)}</span>
                    </span>

                    <span className="text-[13px] text-white/85">{t(l)}</span>
                  </span>

                  <span
                    className={[
                      "h-1.5 w-1.5 rounded-full transition-opacity",
                      l === lang ? "bg-[#1800ad] opacity-100" : "bg-white/40 opacity-0 group-hover:opacity-80",
                    ].join(" ")}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
