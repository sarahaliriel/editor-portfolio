"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useI18n } from "@/components/i18n"

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

export default function IntroOverlay() {
  const { t } = useI18n()

  const [ready, setReady] = useState(false)
  const [running, setRunning] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [done, setDone] = useState(false)
  const [i, setI] = useState(0)

  const restoreOverflowRef = useRef<string>("")
  const restoreScrollRef = useRef<History["scrollRestoration"]>("auto")
  const timersRef = useRef<number[]>([])

  const word = useMemo(() => WORDS[Math.min(i, WORDS.length - 1)], [i])

  useEffect(() => {
    restoreOverflowRef.current = document.documentElement.style.overflow || ""
    document.documentElement.style.overflow = "hidden"
    document.documentElement.dataset.intro = "idle"
    setReady(true)

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
      timersRef.current.forEach((tt) => window.clearTimeout(tt))
      timersRef.current = []
      delete document.documentElement.dataset.intro

      if (typeof window !== "undefined") {
        window.history.scrollRestoration = restoreScrollRef.current
      }
    }
  }, [])

  useEffect(() => {
    if (!running) return

    document.documentElement.dataset.intro = "running"

    timersRef.current.forEach((tt) => window.clearTimeout(tt))
    timersRef.current = []

    const step = 170
    const holdFinal = 520
    const exitDuration = 980

    WORDS.forEach((_, idx) => {
      const tt = window.setTimeout(() => setI(idx), idx * step)
      timersRef.current.push(tt)
    })

    const finalAt = (WORDS.length - 1) * step
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
        document.documentElement.dataset.intro = "done"
        window.dispatchEvent(new CustomEvent("intro:done"))
      }, doneAt)
    )
  }, [running])

  const start = () => {
    if (running) return
    setRunning(true)
  }

  useEffect(() => {
    if (!ready) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") start()
    }

    const onPointer = () => start()

    window.addEventListener("keydown", onKey)
    window.addEventListener("pointerdown", onPointer, { once: true })

    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("pointerdown", onPointer as any)
    }
  }, [ready, running])

  if (done) return null

  return (
    <div className="intro-overlay" data-exiting={exiting ? "true" : "false"}>
      <div className="intro-corner">{t("introStarting")}</div>

      <div className="intro-stage" aria-label="Animação de entrada">
        <div className="intro-word">
          <span>{running ? word : "enter"}</span>
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