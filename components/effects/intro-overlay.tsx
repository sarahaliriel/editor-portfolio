"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { type I18nKey, useI18n } from "@/components/providers/i18n"

const WORDS = [
  "olá",
  "hello",
  "hola",
  "bonjour",
  "ciao",
  "hallo",
  "你好",
  "hej",
  "salut",
  "sveiki",
  "안녕하세요",
  "namaste",
  "こんにちは",
  "привет",
  "مرحبًا",
  "welcome <3",
]

const HOME_INTRO_SEEN_KEY = "portfolio:intro-seen-home"
const LAST_PATH_KEY = "portfolio:last-path"

type IntroMode = "home" | "route"

type IntroConfig = {
  mode: IntroMode
  labelKey: I18nKey
}

const ROUTE_INTRO_KEYS = {
  "/allprojects": "introRouteAllProjects",
  "/gallery": "introRouteGallery",
  "/more-about": "introRouteMoreAbout",
} as const

function dispatchIntroDone() {
  document.documentElement.dataset.intro = "done"
  window.dispatchEvent(new CustomEvent("intro:done"))
}

export default function IntroOverlay() {
  const pathname = usePathname()
  const { t } = useI18n()

  const [ready, setReady] = useState(false)
  const [running, setRunning] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [done, setDone] = useState(false)
  const [i, setI] = useState(0)
  const [config, setConfig] = useState<IntroConfig | null>(null)

  const restoreOverflowRef = useRef<string>("")
  const restoreScrollRef = useRef<History["scrollRestoration"]>("auto")
  const timersRef = useRef<number[]>([])

  const word = useMemo(() => {
    if (config?.mode === "route") return t(config.labelKey)
    return WORDS[Math.min(i, WORDS.length - 1)]
  }, [config, i, t])

  useEffect(() => {
    timersRef.current.forEach((tt) => window.clearTimeout(tt))
    timersRef.current = []

    const path = pathname || "/"
    const previousPath = window.sessionStorage.getItem(LAST_PATH_KEY)
    const homeIntroSeen = window.sessionStorage.getItem(HOME_INTRO_SEEN_KEY) === "true"
    const routeIntroKey = ROUTE_INTRO_KEYS[path as keyof typeof ROUTE_INTRO_KEYS]
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const nextConfig: IntroConfig | null =
      path === "/" && !homeIntroSeen
        ? { mode: "home", labelKey: "introRouteHome" }
        : path === "/" && previousPath && previousPath !== "/"
          ? { mode: "route", labelKey: "introRouteHome" }
          : routeIntroKey
            ? { mode: "route", labelKey: routeIntroKey }
            : null

    window.sessionStorage.setItem(LAST_PATH_KEY, path)

    if (!nextConfig || prefersReducedMotion) {
      document.documentElement.style.overflow = restoreOverflowRef.current
      dispatchIntroDone()
      const settleFrame = window.requestAnimationFrame(() => {
        setDone(true)
        setConfig(null)
      })
      return () => window.cancelAnimationFrame(settleFrame)
    }

    restoreOverflowRef.current = document.documentElement.style.overflow || ""
    document.documentElement.style.overflow = "hidden"
    document.documentElement.dataset.intro = "idle"
    let readyFrame = 0
    const setupFrame = window.requestAnimationFrame(() => {
      setConfig(nextConfig)
      setReady(false)
      setRunning(nextConfig.mode === "route")
      setExiting(false)
      setDone(false)
      setI(0)
      readyFrame = window.requestAnimationFrame(() => setReady(true))
    })

    if (typeof window !== "undefined") {
      restoreScrollRef.current = window.history.scrollRestoration
      window.history.scrollRestoration = "manual"

      const hash = window.location.hash
      if (!hash) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" })
        requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }))
      }
    }

    return () => {
      document.documentElement.style.overflow = restoreOverflowRef.current
      window.cancelAnimationFrame(setupFrame)
      window.cancelAnimationFrame(readyFrame)
      timersRef.current.forEach((tt) => window.clearTimeout(tt))
      timersRef.current = []

      if (typeof window !== "undefined") {
        window.history.scrollRestoration = restoreScrollRef.current
      }
    }
  }, [pathname])

  useEffect(() => {
    if (!running || !config) return

    document.documentElement.dataset.intro = "running"

    timersRef.current.forEach((tt) => window.clearTimeout(tt))
    timersRef.current = []

    const isRouteIntro = config.mode === "route"
    const step = isRouteIntro ? 0 : 170
    const holdFinal = isRouteIntro ? 820 : 520
    const exitDuration = isRouteIntro ? 1140 : 980

    if (!isRouteIntro) {
      WORDS.forEach((_, idx) => {
        const tt = window.setTimeout(() => setI(idx), idx * step)
        timersRef.current.push(tt)
      })
    }

    const finalAt = isRouteIntro ? 0 : (WORDS.length - 1) * step
    const exitAt = finalAt + holdFinal

    timersRef.current.push(
      window.setTimeout(() => {
        setExiting(true)
        document.documentElement.dataset.intro = "exiting"
      }, exitAt)
    )

    const doneAt = exitAt + exitDuration + 40
    timersRef.current.push(
      window.setTimeout(() => {
        setDone(true)
        document.documentElement.style.overflow = restoreOverflowRef.current
        if (config.mode === "home") {
          window.sessionStorage.setItem(HOME_INTRO_SEEN_KEY, "true")
        }
        dispatchIntroDone()
      }, doneAt)
    )
  }, [config, running])

  const start = useCallback(() => {
    if (running) return
    setRunning(true)
  }, [running])

  useEffect(() => {
    if (!ready || config?.mode !== "home") return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") start()
    }

    const onPointer = () => start()

    window.addEventListener("keydown", onKey)
    window.addEventListener("pointerdown", onPointer, { once: true })

    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("pointerdown", onPointer)
    }
  }, [config, ready, start])

  if (done || !config) return null

  return (
    <div
      className="intro-overlay"
      data-exiting={exiting ? "true" : "false"}
      data-mode={config.mode}
      aria-live="polite"
    >
      <div className="intro-corner">{t("introStarting")}</div>

      <div className="intro-stage" aria-label="Animação de entrada">
        <div className={config.mode === "route" ? "intro-word intro-word--route" : "intro-word"}>
          <span>{running ? word : t("introEnter")}</span>
          <span className="intro-dot" />
        </div>
      </div>

      <div className="intro-hint">
        <span className="intro-bar" />
        <span>{running ? t("introLoading") : t("introHint")}</span>
      </div>

      <div className="intro-shine" aria-hidden="true" />
      <div className="intro-curtain" />
    </div>
  )
}
