"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import { createPortal } from "react-dom"
import { usePathname, useRouter } from "next/navigation"
import { useI18n, type I18nKey } from "@/components/providers/i18n"
import { MENU_NAVIGATION_ITEMS, type MenuNavigationItem } from "@/data/menu-navigation"

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
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(frame)
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

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
      backgroundElements.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert
        if (ariaHidden === null) element.removeAttribute("aria-hidden")
        else element.setAttribute("aria-hidden", ariaHidden)
      })
    }
  }, [menuOpen])

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
        setHighlightedItemId(null)
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
    setHighlightedItemId(null)
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

  const isActive = (item: MenuNavigationItem) => {
    if (item.navigation === "contact") {
      return pathname === "/" && window.location.hash === "#contact"
    }

    if (item.href === "/") return pathname === "/" && window.location.hash !== "#contact"
    return pathname === item.href || pathname.startsWith(`${item.href}/`)
  }

  const cursorLabelKey = (item: MenuNavigationItem): I18nKey => {
    if (item.id === "home") return "cursorEnter"
    if (item.navigation === "contact") return "cursorTalk"
    return "cursorOpen"
  }

  if (!mounted) return null

  const routeActiveItem = MENU_NAVIGATION_ITEMS.find(isActive)
  const activeItemId = highlightedItemId ?? routeActiveItem?.id ?? null
  const highlightItem = (itemId: string) => setHighlightedItemId(itemId)
  const clearHighlightedItem = (itemId: string) => {
    setHighlightedItemId((current) => current === itemId ? null : current)
  }
  const activateObject = (objectId: MenuObjectId, touch: boolean) => {
    const itemId = MENU_OBJECT_ITEM_IDS[objectId]
    const item = MENU_NAVIGATION_ITEMS.find((candidate) => candidate.id === itemId)
    if (!item) return
    if (touch && highlightedItemId !== item.id) {
      highlightItem(item.id)
      return
    }
    navigate(item)
  }

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
          onClick={(event) => {
            event.stopPropagation()
            if (menuOpen) setHighlightedItemId(null)
            setMenuOpen(!menuOpen)
          }}
          whileHover={reducedMotion ? undefined : { scale: 1.035 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: fastDuration }}
          className="fixed right-5 top-5 z-20010 grid h-16 w-16 place-items-center rounded-full border border-white/35 bg-[#1e1e1e] shadow-[0_18px_70px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8e7e7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1e1e]"
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: fastDuration } }}
              transition={{ duration: enterDuration, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-9999 overflow-y-auto bg-[#1e1e1e] text-[#e8e7e7]"
            >
              <motion.div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 50% 88%, rgba(24,0,173,.12), transparent 34%), repeating-radial-gradient(circle at 50% 50%, rgba(232,231,231,.018) 0, rgba(232,231,231,.018) .5px, transparent .8px, transparent 3px)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: enterDuration }}
              />
              <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(115deg,#1e1e1e00,#17171766)] shadow-[inset_0_0_120px_rgba(0,0,0,.18)]" aria-hidden="true" />
              <MenuObjects
                activeItemId={activeItemId}
                onHighlightItem={highlightItem}
                onClearItem={clearHighlightedItem}
                onActivateObject={activateObject}
              />

              <nav className="relative z-10 mx-auto flex min-h-svh w-full max-w-[62rem] flex-col px-5 pb-6 pt-8 sm:px-8 sm:pb-8 sm:pt-9 md:px-12 md:pb-9 lg:px-16">
                <motion.p
                  data-menu-safe
                  className="mb-3 text-[9px] uppercase tracking-[0.22em] text-[#e8e7e7]/42 md:mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: fastDuration } }}
                  transition={{ duration: fastDuration, delay: entranceDelay(0.25) }}
                >
                  {t("menuNav")}
                </motion.p>

                <motion.ul
                  data-menu-safe
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
                    const active = activeItemId === item.id

                    return (
                      <motion.li
                        key={item.id}
                        className="overflow-hidden"
                        variants={{
                          open: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0.1 : 0.36, ease: [0.22, 1, 0.36, 1] } },
                          closed: { opacity: 0, y: reducedMotion ? 0 : 8, transition: { duration: fastDuration } },
                        }}
                      >
                        <button
                          data-menu-item={item.id}
                          data-cursor="view"
                          data-cursor-label={t(cursorLabelKey(item))}
                          type="button"
                          aria-current={active && item.navigation === "route" ? "page" : undefined}
                          onPointerEnter={(event) => {
                            if (event.pointerType === "mouse") highlightItem(item.id)
                          }}
                          onPointerLeave={(event) => {
                            if (event.pointerType === "mouse") clearHighlightedItem(item.id)
                          }}
                          onFocus={() => highlightItem(item.id)}
                          onBlur={() => clearHighlightedItem(item.id)}
                          onClick={() => navigate(item)}
                          className={`group grid w-full grid-cols-[2.35rem_1fr] gap-x-2.5 py-3 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1800ad] sm:grid-cols-[3rem_1fr] md:grid-cols-[3.75rem_1fr] md:py-[clamp(.65rem,1.5vh,1.15rem)] ${active ? "text-[#e8e7e7]" : "text-[#e8e7e7]/30 hover:text-[#e8e7e7]/64 focus-visible:text-[#e8e7e7]/64"}`}
                        >
                          <span className={`pt-1 text-[9px] tabular-nums tracking-[0.18em] ${active ? "font-semibold text-[#7770ff]" : "text-current"}`}>
                            {item.number}
                          </span>
                          <span>
                            <span className="block font-display text-[clamp(1.75rem,5.2vw,4.75rem)] font-semibold uppercase leading-[0.82] tracking-[-0.055em]">
                              {t(item.labelKey)}
                            </span>
                            {active ? (
                              <span className="mt-1.5 block max-w-lg text-[10px] leading-relaxed text-[#e8e7e7]/64 md:text-[11px]">
                                {t(item.descriptionKey)}
                              </span>
                            ) : null}
                          </span>
                        </button>
                      </motion.li>
                    )
                  })}
                </motion.ul>

                <div className="min-h-20 flex-1 sm:min-h-28 md:min-h-10" aria-hidden="true" />

                <motion.footer
                  className="grid gap-5 border-t border-[#e8e7e7]/18 pt-4 text-[9px] uppercase tracking-[0.16em] text-[#e8e7e7]/48 sm:grid-cols-[1fr_auto] md:grid-cols-[1.4fr_1fr_1fr] md:items-end md:gap-8 md:pt-5"
                  initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reducedMotion ? 0 : 4, transition: { duration: fastDuration } }}
                  transition={{ duration: reducedMotion ? 0.1 : 0.35, delay: entranceDelay(0.65) }}
                >
                  <div data-menu-safe className="flex flex-wrap gap-x-4 gap-y-2 normal-case tracking-normal text-[#e8e7e7]/76 sm:col-span-2 md:col-span-1">
                    {SOCIALS.map((social) => (
                      <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="border-b border-transparent pb-0.5 transition-colors duration-200 hover:border-[#1800ad] hover:text-[#e8e7e7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1800ad]">
                        {social.label}
                      </a>
                    ))}
                  </div>
                  <div data-menu-safe>
                    <p>Póvoa de Varzim</p>
                    <p className="mt-1 text-[#e8e7e7]/78">Portugal</p>
                  </div>
                  <div data-menu-safe className="sm:text-right">
                    <p>{t("moreAboutFooterLocalTime")}</p>
                    <MenuLocalTime />
                  </div>
                </motion.footer>
              </nav>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}

const objectImageClassName = "h-auto w-full select-none opacity-74 brightness-95 contrast-105 saturate-80 drop-shadow-[0_20px_28px_rgba(0,0,0,0.2)] transition-[scale,filter,opacity] duration-300 ease-out group-hover/object:scale-[1.02] group-hover/object:opacity-82 group-hover/object:drop-shadow-[0_18px_30px_rgba(119,112,255,0.18)]"

type MenuObjectId = "headphones" | "tea" | "macbook" | "tablet"

const MENU_OBJECT_ITEM_IDS: Record<MenuObjectId, string> = {
  macbook: "about",
  tablet: "design-gallery",
  headphones: "motion-archive",
  tea: "contact",
}

type MenuObjectsProps = {
  activeItemId: string | null
  onHighlightItem: (itemId: string) => void
  onClearItem: (itemId: string) => void
  onActivateObject: (objectId: MenuObjectId, touch: boolean) => void
}

type MenuObjectBody = {
  id: MenuObjectId
  node: HTMLDivElement | null
  hitArea: HTMLDivElement | null
  visualNode: HTMLDivElement | null
  mass: number
  deceleration: number
  maxRotation: number
  rotationResponse: number
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  angularVelocity: number
  dragging: boolean
  pointerId: number | null
  lastPointerX: number
  lastPointerY: number
  lastPointerTime: number
  pointerTravel: number
  lastPointerType: string
  lastInteraction: number
  returning: boolean
  minX: number | null
  maxX: number | null
  minY: number | null
  maxY: number | null
}

const MENU_OBJECT_CONFIG: Record<MenuObjectId, Pick<MenuObjectBody, "mass" | "deceleration" | "maxRotation" | "rotationResponse">> = {
  macbook: { mass: 3.4, deceleration: 6.8, maxRotation: 1.8, rotationResponse: 0.002 },
  tablet: { mass: 2.1, deceleration: 5.7, maxRotation: 3, rotationResponse: 0.003 },
  headphones: { mass: 0.72, deceleration: 3.1, maxRotation: 9, rotationResponse: 0.009 },
  tea: { mass: 1.65, deceleration: 5, maxRotation: 4, rotationResponse: 0.004 },
}

const createMenuObjectBody = (id: MenuObjectId): MenuObjectBody => ({
  id,
  ...MENU_OBJECT_CONFIG[id],
  node: null,
  hitArea: null,
  visualNode: null,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  rotation: 0,
  angularVelocity: 0,
  dragging: false,
  pointerId: null,
  lastPointerX: 0,
  lastPointerY: 0,
  lastPointerTime: 0,
  pointerTravel: 0,
  lastPointerType: "mouse",
  lastInteraction: 0,
  returning: false,
  minX: null,
  maxX: null,
  minY: null,
  maxY: null,
})

function MenuObjects({ activeItemId, onHighlightItem, onClearItem, onActivateObject }: MenuObjectsProps) {
  const bodiesRef = useRef<Record<MenuObjectId, MenuObjectBody>>({
    headphones: createMenuObjectBody("headphones"),
    tea: createMenuObjectBody("tea"),
    macbook: createMenuObjectBody("macbook"),
    tablet: createMenuObjectBody("tablet"),
  })
  const frameRef = useRef<number | null>(null)
  const proximityFrameRef = useRef<number | null>(null)
  const pointerPositionRef = useRef({ x: 0, y: 0 })
  const lastFrameRef = useRef(0)
  const reducedMotionRef = useRef(false)

  const applyBodyTransform = (body: MenuObjectBody) => {
    if (!body.node) return
    body.node.style.transform = `translate3d(${body.x}px, ${body.y}px, 0) rotate(${reducedMotionRef.current ? 0 : body.rotation}deg)`
  }

  const keepHitAreaInside = (body: MenuObjectBody) => {
    if (!body.hitArea) return
    const margin = 6
    if (body.minX === null || body.maxX === null || body.minY === null || body.maxY === null) {
      const rect = body.hitArea.getBoundingClientRect()
      body.minX = rect.left < margin ? 0 : margin - rect.left
      body.maxX = rect.right > window.innerWidth - margin ? 0 : window.innerWidth - margin - rect.right
      body.minY = rect.top < margin ? 0 : margin - rect.top
      body.maxY = rect.bottom > window.innerHeight - margin ? 0 : window.innerHeight - margin - rect.bottom
    }
    body.x = Math.max(body.minX, Math.min(body.maxX, body.x))
    body.y = Math.max(body.minY, Math.min(body.maxY, body.y))
  }

  const separateFromProtectedArea = (body: MenuObjectBody, protectedRect: DOMRect) => {
    if (!body.hitArea) return
    const rect = body.hitArea.getBoundingClientRect()
    const padding = 8
    const left = protectedRect.left - padding
    const right = protectedRect.right + padding
    const top = protectedRect.top - padding
    const bottom = protectedRect.bottom + padding
    if (rect.right <= left || rect.left >= right || rect.bottom <= top || rect.top >= bottom) return

    const moves = [
      { axis: "x", amount: left - rect.right },
      { axis: "x", amount: right - rect.left },
      { axis: "y", amount: top - rect.bottom },
      { axis: "y", amount: bottom - rect.top },
    ] as const
    const correction = moves.reduce((smallest, move) => Math.abs(move.amount) < Math.abs(smallest.amount) ? move : smallest)
    if (correction.axis === "x") {
      body.x += correction.amount
      body.vx = 0
    } else {
      body.y += correction.amount
      body.vy = 0
    }
  }

  const resolveObjectCollisions = (bodies: MenuObjectBody[], now: number) => {
    for (let firstIndex = 0; firstIndex < bodies.length; firstIndex += 1) {
      const first = bodies[firstIndex]
      if (!first.hitArea) continue
      const firstRect = first.hitArea.getBoundingClientRect()
      const firstRadius = Math.min(firstRect.width, firstRect.height) * 0.46
      const firstCenter = { x: firstRect.left + firstRect.width / 2, y: firstRect.top + firstRect.height / 2 }

      for (let secondIndex = firstIndex + 1; secondIndex < bodies.length; secondIndex += 1) {
        const second = bodies[secondIndex]
        if (!second.hitArea) continue
        if (first.lastInteraction === 0 && second.lastInteraction === 0) continue
        if ((first.returning || second.returning) && !first.dragging && !second.dragging) continue
        const secondRect = second.hitArea.getBoundingClientRect()
        const secondRadius = Math.min(secondRect.width, secondRect.height) * 0.46
        const secondCenter = { x: secondRect.left + secondRect.width / 2, y: secondRect.top + secondRect.height / 2 }
        const dx = secondCenter.x - firstCenter.x
        const dy = secondCenter.y - firstCenter.y
        const distance = Math.hypot(dx, dy) || 0.001
        const overlap = firstRadius + secondRadius - distance
        if (overlap <= 0) continue
        const combinedSpeed = Math.hypot(first.vx, first.vy) + Math.hypot(second.vx, second.vy)
        if (!first.dragging && !second.dragging && combinedSpeed < 4) continue

        const normalX = dx / distance
        const normalY = dy / distance
        const firstShare = second.mass / (first.mass + second.mass)
        const secondShare = first.mass / (first.mass + second.mass)
        if (!first.dragging) {
          first.x -= normalX * overlap * firstShare
          first.y -= normalY * overlap * firstShare
        }
        if (!second.dragging) {
          second.x += normalX * overlap * secondShare
          second.y += normalY * overlap * secondShare
        }

        const relativeVelocity = (second.vx - first.vx) * normalX + (second.vy - first.vy) * normalY
        if (relativeVelocity < 0) {
          const impulse = (-(1.08) * relativeVelocity) / (1 / first.mass + 1 / second.mass)
          if (!first.dragging) {
            first.vx -= (impulse * normalX) / first.mass
            first.vy -= (impulse * normalY) / first.mass
          }
          if (!second.dragging) {
            second.vx += (impulse * normalX) / second.mass
            second.vy += (impulse * normalY) / second.mass
          }
        }
        if (first.dragging || second.dragging || Math.abs(relativeVelocity) > 6) {
          first.lastInteraction = now
          second.lastInteraction = now
          first.returning = false
          second.returning = false
        }
      }
    }
  }

  const runPhysics = (timestamp: number) => {
    const bodies = Object.values(bodiesRef.current)
    const delta = Math.min((timestamp - (lastFrameRef.current || timestamp)) / 1000, 0.032)
    lastFrameRef.current = timestamp
    const reducedMotion = reducedMotionRef.current
    let shouldContinue = false

    bodies.forEach((body) => {
      if (body.dragging) {
        shouldContinue = true
        return
      }

      if (body.lastInteraction > 0 && timestamp - body.lastInteraction >= 5000) body.returning = true
      if (body.returning) {
        const spring = reducedMotion ? 10 : 18 / body.mass
        const damping = reducedMotion ? 7 : 6.5 / Math.sqrt(body.mass)
        body.vx += (-body.x * spring - body.vx * damping) * delta
        body.vy += (-body.y * spring - body.vy * damping) * delta
        if (!reducedMotion) body.angularVelocity += (-body.rotation * spring - body.angularVelocity * damping) * delta
      } else {
        const decay = Math.exp(-body.deceleration * delta)
        body.vx *= decay
        body.vy *= decay
        body.angularVelocity *= Math.exp(-7 * delta)
      }

      body.x += body.vx * delta
      body.y += body.vy * delta
      if (!reducedMotion) {
        body.angularVelocity += (body.vx * body.rotationResponse - body.rotation) * delta * 4
        body.rotation += body.angularVelocity * delta
        body.rotation = Math.max(-body.maxRotation, Math.min(body.maxRotation, body.rotation))
      } else {
        body.rotation = 0
        body.angularVelocity = 0
      }
      applyBodyTransform(body)
      keepHitAreaInside(body)

      const protectedElements = document.querySelectorAll<HTMLElement>("[data-menu-safe]")
      protectedElements.forEach((element) => separateFromProtectedArea(body, element.getBoundingClientRect()))
      const closeButton = document.querySelector<HTMLElement>(`[aria-controls="${MENU_ID}"]`)
      if (closeButton) separateFromProtectedArea(body, closeButton.getBoundingClientRect())
      applyBodyTransform(body)

      const settled = Math.hypot(body.x, body.y) < 0.35 && Math.hypot(body.vx, body.vy) < 2 && Math.abs(body.rotation) < 0.1
      if (body.returning && settled) {
        body.x = 0
        body.y = 0
        body.vx = 0
        body.vy = 0
        body.rotation = 0
        body.angularVelocity = 0
        body.returning = false
        body.minX = null
        body.maxX = null
        body.minY = null
        body.maxY = null
        body.lastInteraction = 0
        applyBodyTransform(body)
      } else if (body.lastInteraction > 0) {
        shouldContinue = true
      }
    })

    if (!reducedMotion) {
      resolveObjectCollisions(bodies, timestamp)
      bodies.forEach((body) => {
        keepHitAreaInside(body)
        applyBodyTransform(body)
      })
    }

    if (shouldContinue) frameRef.current = requestAnimationFrame(runPhysics)
    else {
      frameRef.current = null
      lastFrameRef.current = 0
    }
  }

  const startEngine = () => {
    if (frameRef.current !== null) return
    lastFrameRef.current = 0
    frameRef.current = requestAnimationFrame(runPhysics)
  }

  const handlePointerDown = (id: MenuObjectId, event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const body = bodiesRef.current[id]
    keepHitAreaInside(body)
    body.dragging = true
    body.pointerId = event.pointerId
    body.lastPointerX = event.clientX
    body.lastPointerY = event.clientY
    body.lastPointerTime = event.timeStamp
    body.pointerTravel = 0
    body.lastPointerType = event.pointerType
    body.vx = 0
    body.vy = 0
    body.returning = false
    body.lastInteraction = event.timeStamp
    event.currentTarget.setPointerCapture(event.pointerId)
    startEngine()
  }

  const handlePointerMove = (id: MenuObjectId, event: ReactPointerEvent<HTMLDivElement>) => {
    const body = bodiesRef.current[id]
    if (!body.dragging || body.pointerId !== event.pointerId) return
    event.preventDefault()
    const now = event.timeStamp
    const elapsed = Math.max(now - body.lastPointerTime, 8)
    let dx = event.clientX - body.lastPointerX
    let dy = event.clientY - body.lastPointerY
    if (reducedMotionRef.current) {
      const nextDistance = Math.hypot(body.x + dx, body.y + dy)
      if (nextDistance > 24) {
        const scale = 24 / nextDistance
        dx = (body.x + dx) * scale - body.x
        dy = (body.y + dy) * scale - body.y
      }
    }
    body.x += dx
    body.y += dy
    body.pointerTravel += Math.hypot(dx, dy)
    body.vx = (dx / elapsed) * 1000
    body.vy = (dy / elapsed) * 1000
    body.angularVelocity = reducedMotionRef.current ? 0 : body.vx * body.rotationResponse * 0.65
    body.lastPointerX = event.clientX
    body.lastPointerY = event.clientY
    body.lastPointerTime = now
    body.lastInteraction = now
    applyBodyTransform(body)
  }

  const handlePointerEnd = (id: MenuObjectId, event: ReactPointerEvent<HTMLDivElement>) => {
    const body = bodiesRef.current[id]
    if (body.pointerId !== event.pointerId) return
    body.dragging = false
    body.pointerId = null
    body.lastInteraction = event.timeStamp
    if (reducedMotionRef.current) {
      body.vx = 0
      body.vy = 0
    } else {
      body.vx /= body.mass
      body.vy /= body.mass
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    startEngine()
  }

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateReducedMotion = () => {
      reducedMotionRef.current = reducedMotion.matches
      if (reducedMotion.matches) {
        Object.values(bodiesRef.current).forEach((body) => {
          if (body.visualNode) body.visualNode.style.transform = "translate3d(0, 0, 0)"
        })
      }
    }
    const resetBodies = () => {
      Object.values(bodiesRef.current).forEach((body) => {
        body.x = 0
        body.y = 0
        body.vx = 0
        body.vy = 0
        body.rotation = 0
        body.angularVelocity = 0
        body.dragging = false
        body.pointerId = null
        body.lastInteraction = 0
        body.returning = false
        body.minX = null
        body.maxX = null
        body.minY = null
        body.maxY = null
        applyBodyTransform(body)
      })
      resetProximity()
    }
    const resetProximity = () => {
      Object.values(bodiesRef.current).forEach((body) => {
        if (body.visualNode) body.visualNode.style.transform = "translate3d(0, 0, 0)"
      })
    }
    const updateProximity = () => {
      proximityFrameRef.current = null
      if (reducedMotionRef.current) {
        resetProximity()
        return
      }
      const pointer = pointerPositionRef.current
      Object.values(bodiesRef.current).forEach((body) => {
        if (!body.visualNode || !body.hitArea || body.dragging) return
        const rect = body.hitArea.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const dx = centerX - pointer.x
        const dy = centerY - pointer.y
        const distance = Math.hypot(dx, dy)
        const radius = 190
        const strength = distance < radius ? (1 - distance / radius) * 4 : 0
        const offsetX = distance > 0 ? (dx / distance) * strength : 0
        const offsetY = distance > 0 ? (dy / distance) * strength : 0
        body.visualNode.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`
      })
    }
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      pointerPositionRef.current = { x: event.clientX, y: event.clientY }
      if (proximityFrameRef.current === null) proximityFrameRef.current = requestAnimationFrame(updateProximity)
    }
    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) resetProximity()
    }

    updateReducedMotion()
    reducedMotion.addEventListener("change", updateReducedMotion)
    window.addEventListener("resize", resetBodies)
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerout", handlePointerOut)
    return () => {
      reducedMotion.removeEventListener("change", updateReducedMotion)
      window.removeEventListener("resize", resetBodies)
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerout", handlePointerOut)
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      if (proximityFrameRef.current !== null) cancelAnimationFrame(proximityFrameRef.current)
    }
  }, [])

  const renderObject = (id: MenuObjectId, src: string, hitAreaClassName: string) => {
    const itemId = MENU_OBJECT_ITEM_IDS[id]
    const active = activeItemId === itemId

    return (
      <div className={`menu-object-enter menu-object-enter--${id} h-full w-full`}>
        <div
          ref={(node) => { bodiesRef.current[id].node = node }}
          className="group/object relative h-full w-full will-change-transform"
        >
          <div
            ref={(node) => { bodiesRef.current[id].visualNode = node }}
            className="h-full w-full transition-transform duration-150 ease-out will-change-transform"
          >
            <Image
              src={src}
              alt=""
              width={1080}
              height={1350}
              draggable={false}
              className={`${objectImageClassName} ${active ? "scale-[1.025] opacity-85 drop-shadow-[0_18px_30px_rgba(119,112,255,0.2)]" : ""}`}
            />
          </div>
          <div
            ref={(node) => { bodiesRef.current[id].hitArea = node }}
            data-cursor="view"
            data-menu-object={id}
            className={`pointer-events-auto absolute cursor-grab touch-none rounded-[35%] active:cursor-grabbing ${hitAreaClassName}`}
            onMouseDown={(event) => event.stopPropagation()}
            onMouseEnter={() => {
              if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) onHighlightItem(itemId)
            }}
            onMouseLeave={() => {
              if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) onClearItem(itemId)
            }}
            onPointerDown={(event) => handlePointerDown(id, event)}
            onPointerMove={(event) => handlePointerMove(id, event)}
            onPointerUp={(event) => handlePointerEnd(id, event)}
            onPointerCancel={(event) => handlePointerEnd(id, event)}
            onClick={(event) => {
              event.stopPropagation()
              const body = bodiesRef.current[id]
              if (body.pointerTravel <= 7) onActivateObject(id, body.lastPointerType === "touch")
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-18 top-[43%] w-64 -rotate-7 sm:-left-28 sm:top-[39%] sm:w-84 lg:-left-60 lg:top-[14%] lg:w-[35rem]">
        {renderObject("headphones", "/images/menu/fones.png", "left-[26%] top-[29%] h-[36%] w-[53%]")}
      </div>
      <div className="absolute -left-14 top-[55%] w-52 rotate-3 sm:left-[3%] sm:top-[52%] sm:w-64 lg:-left-44 lg:top-[57%] lg:w-[30rem]">
        {renderObject("tea", "/images/menu/cha.png", "left-[21%] top-[34%] h-[27%] w-[58%]")}
      </div>
      <div className="absolute -right-16 top-[42%] w-64 rotate-6 sm:-right-16 sm:top-[36%] sm:w-80 lg:-left-52 lg:-top-28 lg:w-[41rem] lg:-rotate-3">
        {renderObject("macbook", "/images/menu/macbook.png", "left-[26%] top-[35%] h-[29%] w-[46%]")}
      </div>
      <div className="absolute -right-18 top-[56%] w-64 -rotate-5 sm:right-[1%] sm:top-[50%] sm:w-80 lg:-right-52 lg:top-[46%] lg:w-[38rem]">
        {renderObject("tablet", "/images/menu/mesa-digitalizadora.png", "left-[23%] top-[26%] h-[43%] w-[60%]")}
      </div>
    </div>
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
