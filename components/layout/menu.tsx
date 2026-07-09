"use client"

import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { usePathname, useRouter } from "next/navigation"
import { useI18n } from "@/components/providers/i18n"

type LinkItem = { label: string; id: string; href?: string }
type SocialItem = { label: string; href: string }
type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null
  mozFullScreenElement?: Element | null
  msFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void> | void
  mozCancelFullScreen?: () => Promise<void> | void
  msExitFullscreen?: () => Promise<void> | void
}

export default function Menu() {
  const { t } = useI18n()
  const pathname = usePathname()
  const router = useRouter()

  const links = useMemo<LinkItem[]>(
    () => [
      { label: t("linkAbout"), id: "more-about", href: "/more-about" },
      { label: t("linkWork"), id: "work" },
      { label: t("linkContact"), id: "contact" },
    ],
    [t]
  )

  const socials = useMemo<SocialItem[]>(
    () => [
      { label: "Instagram", href: "https://www.instagram.com/chazinhodociel/" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/sarah-dumitrache/" },
      { label: "TikTok", href: "https://www.tiktok.com/@cielstea" },
      { label: "Discord", href: "https://discord.com/users/942126894478950530" },
    ],
    []
  )

  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("menu:state", { detail: { open: menuOpen } }))
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return

    const d = document as FullscreenDocument
    const fsEl = d.fullscreenElement || d.webkitFullscreenElement || d.mozFullScreenElement || d.msFullscreenElement
    if (!fsEl) return

    const exit =
      d.exitFullscreen ||
      d.webkitExitFullscreen ||
      d.mozCancelFullScreen ||
      d.msExitFullscreen

    if (exit) {
      try {
        exit.call(d)
      } catch {}
    }
  }, [menuOpen])

  const setHash = (id: string) => {
    const next = `#${id}`
    if (window.location.hash === next) return
    window.history.replaceState(null, "", next)
  }

  const goToHomeSection = (id: string) => {
    setMenuOpen(false)

    if (pathname !== "/") {
      router.push(`/#${id}`)
      return
    }

    return false
  }

  const goTo = ({ id, href }: LinkItem) => {
    if (href) {
      setMenuOpen(false)
      router.push(href)
      return
    }

    if (goToHomeSection(id) !== false) return

    if (id === "contact") {
      setMenuOpen(false)
      setHash("contact")
      window.dispatchEvent(new CustomEvent("nav:contact"))
      return
    }

    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
    setMenuOpen(false)
    setHash(id)
  }

  const buttonNode = (
    <button
      type="button"
      aria-label={menuOpen ? t("menuClose") : t("menuOpen")}
      onClick={() => setMenuOpen((v) => !v)}
      className={[
        "fixed right-5 top-5 z-20010 grid h-16 w-16 place-items-center rounded-full",
        "bg-[#1e1e1e]/58 backdrop-blur-xl",
        "border border-white/55",
        "shadow-[0_18px_70px_rgba(0,0,0,0.35)]",
        "transition-transform duration-300 hover:scale-[1.04] active:scale-[0.97]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        menuOpen ? "shadow-[0_18px_70px_rgb(36,15,174),0_0_0_1px_rgb(36,15,174),0_0_30px_rgb(36,15,174)]" : "",
      ].join(" ")}
    >
      <span className="relative block h-6 w-7">
        <span
          className={[
            "absolute left-1/2 top-2.25 h-px w-5.5 -translate-x-1/2 bg-white/90",
            "transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
            menuOpen ? "top-1/2 -translate-y-1/2 rotate-45 w-6" : "",
          ].join(" ")}
        />
        <span
          className={[
            "absolute left-1/2 top-4.25 h-px w-5.5 -translate-x-1/2 bg-white/90",
            "transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
            menuOpen ? "top-1/2 -translate-y-1/2 -rotate-45 w-6" : "",
          ].join(" ")}
        />
      </span>
    </button>
  )

  const overlayNode = (
    <div
      className={[
        "fixed inset-0 z-9999 transition-opacity duration-300",
        menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      ].join(" ")}
      aria-hidden={!menuOpen}
    >
      <div className="absolute inset-0 bg-black/70" onClick={() => setMenuOpen(false)} />

      <aside
        className={[
          "absolute right-0 top-0 h-full w-full md:w-[44vw] md:max-w-155",
          "bg-[#1e1e1e] text-[#e8e7e7]",
          "transition-transform duration-500",
          menuOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,28,61,0.55),rgba(16,28,61,0.00)_60%)]" />

        <div className="relative flex h-full flex-col px-7 py-7 sm:px-10 sm:py-10">
          <div>
            <div className="text-[12px] tracking-[0.22em] opacity-65">{t("menuNav")}</div>
            <div className="mt-4 h-px w-60 bg-white/12" />
          </div>

          <nav className="mt-12 sm:mt-16">
            <ul className="space-y-6 sm:space-y-8">
              {links.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => goTo(l)}
                    className={[
                      "group flex w-full items-start gap-5 text-left",
                      "text-[54px] leading-[0.95] tracking-tight sm:text-[76px]",
                      "opacity-80 hover:opacity-100 transition-opacity",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-4 focus-visible:ring-offset-[#1e1e1e] rounded-2xl",
                    ].join(" ")}
                  >
                    <span className="mt-4.5 h-2.5 w-2.5 rounded-full bg-white/65 transition-transform duration-300 group-hover:scale-110 group-hover:bg-white" />
                    <span className="select-none">{l.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto pt-12">
            <div className="text-[12px] tracking-[0.22em] opacity-65">{t("menuSocial")}</div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-[14px] opacity-85">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:opacity-100 transition-opacity"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  )

  if (!mounted) {
    return null
  }

  return (
    <>
      {createPortal(buttonNode, document.body)}
      {createPortal(overlayNode, document.body)}
    </>
  )
}
