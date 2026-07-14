"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react"
import { createPortal } from "react-dom"
import { usePathname, useRouter } from "next/navigation"
import { MenuPreview } from "@/components/layout/menu-preview"
import { useI18n, type I18nKey } from "@/components/providers/i18n"
import { MENU_NAVIGATION_ITEMS, type MenuNavigationItem, type MenuPreviewType } from "@/data/menu-navigation"

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null
  mozFullScreenElement?: Element | null
  msFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void> | void
  mozCancelFullScreen?: () => Promise<void> | void
  msExitFullscreen?: () => Promise<void> | void
}

const MENU_ID = "portfolio-menu"
const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/chazinhodociel/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sarah-dumitrache/" },
  { label: "GitHub", href: "https://github.com/sarahaliriel" },
  { label: "Discord", href: "https://discord.com/users/942126894478950530" },
] as const

export default function Menu() {
  const { t } = useI18n()
  const pathname = usePathname()
  const router = useRouter()
  const reducedMotion = Boolean(useReducedMotion())
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const [entranceComplete, setEntranceComplete] = useState(false)
  const [activePreview, setActivePreview] = useState<MenuPreviewType>("home")
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const pointerMedia = window.matchMedia("(hover: none), (pointer: coarse)")
    const compactMedia = window.matchMedia("(max-width: 767px)")
    const update = () => setIsTouch(pointerMedia.matches || compactMedia.matches)
    update()
    pointerMedia.addEventListener("change", update)
    compactMedia.addEventListener("change", update)
    return () => {
      pointerMedia.removeEventListener("change", update)
      compactMedia.removeEventListener("change", update)
    }
  }, [])

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("menu:state", { detail: { open: menuOpen } }))

    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = "hidden"
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`

    const backgroundElements = Array.from(document.body.children)
      .filter((element): element is HTMLElement => element instanceof HTMLElement)
      .filter((element) => !element.contains(triggerRef.current) && !element.contains(dialogRef.current))
      .map((element) => ({
        element,
        inert: element.inert,
        ariaHidden: element.getAttribute("aria-hidden"),
      }))

    backgroundElements.forEach(({ element }) => {
      element.inert = true
      element.setAttribute("aria-hidden", "true")
    })

    dialogRef.current?.querySelector<HTMLButtonElement>("[data-menu-item]")?.focus()
    const entranceTimer = window.setTimeout(() => setEntranceComplete(true), reducedMotion ? 0 : 620)

    return () => {
      window.clearTimeout(entranceTimer)
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
      backgroundElements.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert
        if (ariaHidden === null) element.removeAttribute("aria-hidden")
        else element.setAttribute("aria-hidden", ariaHidden)
      })
    }
  }, [menuOpen, reducedMotion])

  useEffect(() => {
    if (!menuOpen) return

    const documentWithFullscreen = document as FullscreenDocument
    const fullscreenElement =
      documentWithFullscreen.fullscreenElement ||
      documentWithFullscreen.webkitFullscreenElement ||
      documentWithFullscreen.mozFullScreenElement ||
      documentWithFullscreen.msFullscreenElement

    if (!fullscreenElement) return

    const exitFullscreen =
      documentWithFullscreen.exitFullscreen ||
      documentWithFullscreen.webkitExitFullscreen ||
      documentWithFullscreen.mozCancelFullScreen ||
      documentWithFullscreen.msExitFullscreen

    try {
      void exitFullscreen?.call(documentWithFullscreen)
    } catch {
      // Some browsers reject fullscreen exit while their native UI is transitioning.
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        setEntranceComplete(false)
        triggerRef.current?.focus()
        return
      }

      if (event.key !== "Tab") return

      const dialogElements = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]") ?? []
      )
      const focusableElements = [triggerRef.current, ...dialogElements].filter(
        (element): element is HTMLElement => element !== null
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements.at(-1)

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement?.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [menuOpen])

  const closeMenu = (restoreFocus = false) => {
    setMenuOpen(false)
    setEntranceComplete(false)
    if (restoreFocus) triggerRef.current?.focus()
  }

  const setHash = (id: string) => {
    const hash = `#${id}`
    if (window.location.hash !== hash) window.history.replaceState(null, "", hash)
  }

  const navigate = (item: MenuNavigationItem) => {
    closeMenu()

    if (item.navigation === "contact") {
      if (pathname !== "/") {
        router.push(item.href)
        return
      }

      setHash(item.id)
      window.dispatchEvent(new CustomEvent("nav:contact"))
      return
    }

    router.push(item.href)
  }

  const activateItem = (item: MenuNavigationItem, event: MouseEvent<HTMLButtonElement>) => {
    if (isTouch && activePreview !== item.previewType && event.detail !== 0) {
      setActivePreview(item.previewType)
      return
    }

    navigate(item)
  }

  const previewOnPointer = (item: MenuNavigationItem, event: PointerEvent<HTMLButtonElement>) => {
    if (!isTouch && event.pointerType === "mouse") setActivePreview(item.previewType)
  }

  const cursorLabelKey = (item: MenuNavigationItem): I18nKey => {
    if (item.previewType === "home") return "cursorEnter"
    if (item.navigation === "contact") return "cursorTalk"
    return "cursorOpen"
  }

  if (!mounted) return null

  const fastDuration = reducedMotion ? 0.1 : 0.22
  const enterDuration = reducedMotion ? 0.12 : 0.5
  const entranceDelay = (delay: number) => (reducedMotion ? 0 : delay)

  return (
    <>
      {createPortal(
        <motion.button
          ref={triggerRef}
          type="button"
          aria-label={menuOpen ? t("menuClose") : t("menuOpen")}
          aria-controls={MENU_ID}
          aria-expanded={menuOpen}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation()
            if (menuOpen) setEntranceComplete(false)
            setMenuOpen(!menuOpen)
          }}
          whileHover={reducedMotion ? undefined : { scale: 1.035 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: fastDuration }}
          className="fixed right-5 top-5 z-20010 grid h-16 w-16 place-items-center rounded-full border border-white/55 bg-[#1e1e1e]/80 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8e7e7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1e1e]"
        >
          <span aria-hidden="true" className="relative block h-6 w-6">
            <motion.span
              className="absolute left-0 top-1/2 h-px w-6 bg-[#e8e7e7]"
              initial={false}
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 0 : -4 }}
              transition={{ duration: fastDuration, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.span
              className="absolute left-0 top-1/2 h-px w-6 bg-[#e8e7e7]"
              initial={false}
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? 0 : 4 }}
              transition={{ duration: fastDuration, ease: [0.22, 1, 0.36, 1] }}
            />
          </span>
        </motion.button>,
        document.body
      )}

      {createPortal(
        <AnimatePresence initial={false}>
          {menuOpen ? (
            <motion.div
              ref={dialogRef}
              id={MENU_ID}
              role="dialog"
              aria-modal="true"
              aria-label={t("menuNav")}
              onMouseDown={(event) => {
                if (!event.currentTarget.querySelector("nav")?.contains(event.target as Node)) closeMenu(true)
              }}
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: reducedMotion ? "blur(0px)" : isTouch ? "blur(10px)" : "blur(18px)" }}
              exit={{ opacity: 0, backdropFilter: reducedMotion ? "blur(0px)" : "blur(5px)", transition: { duration: fastDuration } }}
              transition={{ duration: enterDuration, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-9999 overflow-y-auto bg-[#1e1e1e]/76 text-[#e8e7e7] md:overflow-hidden"
            >
              <motion.div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 12% 14%, rgba(232,231,231,.08), transparent 28%), radial-gradient(circle at 63% 88%, rgba(24,0,173,.13), transparent 32%), repeating-radial-gradient(circle at 50% 50%, rgba(232,231,231,.035) 0, rgba(232,231,231,.035) .5px, transparent .8px, transparent 3px)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: enterDuration }}
              />
              <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(115deg,rgba(30,30,30,0.12),rgba(30,30,30,0.68))]" aria-hidden="true" />

              <div className="relative grid min-h-svh grid-rows-[38svh_auto] md:h-svh md:grid-cols-[55%_45%] md:grid-rows-1">
                <motion.section
                  className="relative min-h-0 border-b border-[#e8e7e7]/16 px-4 pb-4 pt-22 sm:px-6 sm:pb-6 md:border-b-0 md:border-r md:p-7 lg:p-9"
                  initial={{ opacity: 0, x: reducedMotion ? 0 : -14, scale: reducedMotion ? 1 : 0.992 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: reducedMotion ? 0 : -8, scale: reducedMotion ? 1 : 0.996, transition: { duration: fastDuration } }}
                  transition={{ duration: enterDuration, delay: entranceDelay(0.1), ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    className="mb-3 flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-[#e8e7e7]/48 md:mb-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: fastDuration, delay: entranceDelay(0.2) }}
                  >
                    <span>{t("menuPreview")}</span>
                    <span>{MENU_NAVIGATION_ITEMS.find((item) => item.previewType === activePreview)?.number} / 05</span>
                  </motion.div>
                  <div className="h-[calc(100%-1.5rem)] md:h-[calc(100%-2rem)]">
                    <MenuPreview type={activePreview} />
                  </div>
                </motion.section>

                <nav className="flex min-h-0 flex-col px-5 pb-6 pt-6 sm:px-7 md:h-svh md:overflow-y-auto md:px-[clamp(1.5rem,3vw,3.5rem)] md:pb-7 md:pt-7">
                  <motion.header
                    className="grid grid-cols-3 items-start border-b border-[#e8e7e7]/18 pb-4 pr-18 text-[8px] uppercase tracking-[0.16em] text-[#e8e7e7]/58 sm:text-[9px] sm:tracking-[0.2em] md:pb-5 md:pr-20"
                    initial={{ opacity: 0, y: reducedMotion ? 0 : -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: fastDuration, delay: 0 } }}
                    transition={{ duration: fastDuration, delay: entranceDelay(0.2) }}
                  >
                    <span>Sarah Aliriel</span><span className="text-center">Portfolio</span><span className="text-right">2026</span>
                  </motion.header>

                  <motion.p
                    className="mb-2 mt-5 text-[9px] uppercase tracking-[0.22em] text-[#e8e7e7]/42 md:mt-[clamp(1rem,2.8vh,2rem)]"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: fastDuration, delay: 0 } }}
                    transition={{ duration: fastDuration, delay: entranceDelay(0.25) }}
                  >
                    {t("menuNav")}
                  </motion.p>

                  <motion.ul
                    className="divide-y divide-[#e8e7e7]/16 border-y border-[#e8e7e7]/16"
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={{
                      open: { transition: { delayChildren: entranceDelay(0.28), staggerChildren: reducedMotion ? 0 : 0.055 } },
                      closed: { transition: { staggerChildren: reducedMotion ? 0 : 0.025, staggerDirection: -1 } },
                    }}
                  >
                    {MENU_NAVIGATION_ITEMS.map((item) => {
                      const active = activePreview === item.previewType

                      return (
                        <motion.li
                          key={item.id}
                          className="relative overflow-hidden"
                          variants={{
                            open: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0.1 : 0.36, ease: [0.22, 1, 0.36, 1] } },
                            closed: { opacity: 0, y: reducedMotion ? 0 : 8, transition: { duration: fastDuration } },
                          }}
                        >
                          <motion.button
                            data-menu-item
                            data-cursor="view"
                            data-cursor-label={t(cursorLabelKey(item))}
                            type="button"
                            aria-current={item.navigation === "route" && item.href === pathname ? "page" : undefined}
                            onPointerEnter={(event) => previewOnPointer(item, event)}
                            onFocus={(event) => {
                              if (!isTouch || event.currentTarget.matches(":focus-visible")) {
                                setActivePreview(item.previewType)
                              }
                            }}
                            onClick={(event) => activateItem(item, event)}
                            animate={{ scale: active && !reducedMotion ? 1.012 : 1, y: active && !reducedMotion ? -2 : 0 }}
                            transition={{ duration: fastDuration, ease: [0.22, 1, 0.36, 1] }}
                            className={`group grid w-full origin-left grid-cols-[2.35rem_1fr] gap-x-2.5 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1800ad] md:grid-cols-[2.75rem_1fr] md:py-[clamp(.65rem,1.4vh,1.15rem)] ${active ? "text-[#e8e7e7]" : "text-[#e8e7e7]/42"}`}
                          >
                            <motion.span
                              animate={{ opacity: active ? 1 : 0.42, x: active && !reducedMotion ? 2 : 0 }}
                              transition={{ duration: fastDuration }}
                              className={`pt-1 text-[9px] tabular-nums tracking-[0.18em] ${active ? "font-semibold text-[#1800ad]" : "text-[#e8e7e7]"}`}
                            >
                              {item.number}
                            </motion.span>
                            <span>
                              <span className="block font-display text-[clamp(1.65rem,3.15vw,3.65rem)] font-semibold uppercase leading-[0.8] tracking-[-0.055em]">{t(item.labelKey)}</span>
                              <motion.span
                                initial={false}
                                animate={{ opacity: active ? 0.64 : 0, y: active && !reducedMotion ? 0 : 4 }}
                                transition={{ duration: reducedMotion ? 0.1 : 0.28, delay: active ? entranceDelay(entranceComplete ? 0.02 : 0.58) : 0 }}
                                className="mt-1.5 block min-h-[1.4em] max-w-md text-[10px] leading-relaxed text-[#e8e7e7] md:text-[11px]"
                              >
                                {t(item.descriptionKey)}
                                <span className="ml-2 font-medium text-[#1800ad] md:hidden">{t(cursorLabelKey(item))} ↗</span>
                              </motion.span>
                            </span>
                          </motion.button>
                          <motion.span
                            aria-hidden="true"
                            className="absolute bottom-0 left-0 h-px bg-[#1800ad]"
                            initial={false}
                            animate={{ width: active ? "100%" : "0%", opacity: active ? 0.55 : 0 }}
                            transition={{ duration: reducedMotion ? 0.1 : 0.38, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </motion.li>
                      )
                    })}
                  </motion.ul>

                  <motion.footer
                    className="mt-6 grid gap-5 border-t border-[#e8e7e7]/18 pt-4 text-[9px] uppercase tracking-[0.16em] text-[#e8e7e7]/48 sm:grid-cols-[1fr_auto] md:mt-auto md:grid-cols-[1fr_1fr] md:gap-4 md:pt-5"
                    initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reducedMotion ? 0 : 4, transition: { duration: fastDuration, delay: 0 } }}
                    transition={{ duration: reducedMotion ? 0.1 : 0.35, delay: entranceDelay(0.78) }}
                  >
                    <div><p>Póvoa de Varzim</p><p className="mt-1 text-[#e8e7e7]/78">Portugal</p></div>
                    <div className="sm:text-right"><p>{t("moreAboutFooterLocalTime")}</p><MenuLocalTime /></div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 normal-case tracking-normal text-[#e8e7e7]/76 sm:col-span-2 sm:justify-end md:mt-1">
                      {SOCIALS.map((social) => (
                        <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="border-b border-transparent pb-0.5 transition-colors duration-200 hover:border-[#1800ad] hover:text-[#e8e7e7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1800ad]">{social.label}</a>
                      ))}
                    </div>
                  </motion.footer>
                </nav>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}

function MenuLocalTime() {
  const [time, setTime] = useState("--:--:--")
  const [zone, setZone] = useState("Lisboa")

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("pt-PT", {
      timeZone: "Europe/Lisbon",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "short",
    })
    const update = () => {
      const parts = formatter.formatToParts(new Date())
      setTime(parts.filter((part) => part.type !== "timeZoneName").map((part) => part.value).join("").trim())
      setZone(parts.find((part) => part.type === "timeZoneName")?.value ?? "Lisboa")
    }

    update()
    const interval = window.setInterval(update, 1000)
    return () => window.clearInterval(interval)
  }, [])

  return <time className="mt-1 block tabular-nums text-[#e8e7e7]/78">{time} {zone}</time>
}
