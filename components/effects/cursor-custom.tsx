"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useI18n } from "@/components/providers/i18n"

type CursorMode = "default" | "view"

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null
  mozFullScreenElement?: Element | null
  msFullscreenElement?: Element | null
}

export default function CustomCursor() {
  const { t } = useI18n()

  const cursorRef = useRef<HTMLDivElement>(null)
  const raf = useRef<number | null>(null)

  const [enabled, setEnabled] = useState(false)
  const [mode, setMode] = useState<CursorMode>("default")
  const [customLabel, setCustomLabel] = useState("")
  const [showLabel, setShowLabel] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [fsHost, setFsHost] = useState<HTMLElement | null>(null)

  const openTimer = useRef<NodeJS.Timeout | null>(null)
  const closeTimer = useRef<NodeJS.Timeout | null>(null)

  const target = useRef({ x: 0, y: 0 })

  const isView = mode === "view"

  const label = mode === "view" ? customLabel || t("cursorView") : ""

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)")
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")

    const update = () => {
      const shouldEnable = finePointer.matches && !reduced.matches
      setEnabled(shouldEnable)

      if (shouldEnable) {
        document.documentElement.classList.add("cursor-hidden")
        document.body.style.cursor = "none"
      } else {
        document.documentElement.classList.remove("cursor-hidden")
        document.body.style.cursor = "auto"
        setMode("default")
        setCustomLabel("")
        setShowLabel(false)
        setHidden(false)
      }
    }

    update()
    finePointer.addEventListener("change", update)
    reduced.addEventListener("change", update)

    return () => {
      finePointer.removeEventListener("change", update)
      reduced.removeEventListener("change", update)
      document.documentElement.classList.remove("cursor-hidden")
      document.body.style.cursor = "auto"
    }
  }, [])

  useEffect(() => {
    const onFs = () => {
      const d = document as FullscreenDocument
      const el =
        (d.fullscreenElement as HTMLElement | null) ||
        (d.webkitFullscreenElement as HTMLElement | null) ||
        (d.mozFullScreenElement as HTMLElement | null) ||
        (d.msFullscreenElement as HTMLElement | null)
      setFsHost(el ?? null)
    }

    onFs()
    document.addEventListener("fullscreenchange", onFs)
    document.addEventListener("webkitfullscreenchange", onFs)
    document.addEventListener("mozfullscreenchange", onFs)
    document.addEventListener("MSFullscreenChange", onFs)

    return () => {
      document.removeEventListener("fullscreenchange", onFs)
      document.removeEventListener("webkitfullscreenchange", onFs)
      document.removeEventListener("mozfullscreenchange", onFs)
      document.removeEventListener("MSFullscreenChange", onFs)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    const tick = () => {
      raf.current = null
      const el = cursorRef.current
      if (!el) return

      el.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0) translate(-50%, -50%)`
    }

    const move = (e: PointerEvent) => {
      target.current.x = e.clientX
      target.current.y = e.clientY
      if (raf.current == null) raf.current = requestAnimationFrame(tick)
    }

    const setViewOn = (element: Element) => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
      setCustomLabel((element as HTMLElement).dataset.cursorLabel ?? "")
      setMode("view")

      if (openTimer.current) clearTimeout(openTimer.current)
      openTimer.current = setTimeout(() => {
        setShowLabel(true)
      }, 90)
    }

    const setViewOff = () => {
      if (openTimer.current) clearTimeout(openTimer.current)
      setShowLabel(false)

      if (closeTimer.current) clearTimeout(closeTimer.current)
      closeTimer.current = setTimeout(() => {
        setMode("default")
        setCustomLabel("")
      }, 120)
    }

    const onPointerOver = (e: PointerEvent) => {
      const targetEl = e.target as HTMLElement | null
      if (!targetEl) return

      if (targetEl.closest('[data-cursor="hidden"]')) {
        setHidden(true)
        return
      }

      const viewTarget = targetEl.closest('[data-cursor="view"]')
      if (viewTarget) setViewOn(viewTarget)
    }

    const onPointerOut = (e: PointerEvent) => {
      const hiddenFrom = (e.target as HTMLElement | null)?.closest('[data-cursor="hidden"]')
      const hiddenTo = (e.relatedTarget as HTMLElement | null)?.closest('[data-cursor="hidden"]')
      if (hiddenFrom && !hiddenTo) setHidden(false)

      const from = (e.target as HTMLElement | null)?.closest('[data-cursor="view"]')
      const to = (e.relatedTarget as HTMLElement | null)?.closest('[data-cursor="view"]')
      if (from && !to) setViewOff()
    }

    window.addEventListener("pointermove", move, { passive: true })
    document.addEventListener("pointerover", onPointerOver, true)
    document.addEventListener("pointerout", onPointerOut, true)

    return () => {
      window.removeEventListener("pointermove", move)
      document.removeEventListener("pointerover", onPointerOver, true)
      document.removeEventListener("pointerout", onPointerOut, true)

      if (openTimer.current) clearTimeout(openTimer.current)
      if (closeTimer.current) clearTimeout(closeTimer.current)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [enabled])

  if (!enabled) return null

  const cursorNode = (
    <div ref={cursorRef} className={`fixed left-0 top-0 z-30000 pointer-events-none transition-opacity duration-150 ${hidden ? "opacity-0" : "opacity-100"}`}>
      <div
        className={[
          "relative grid place-items-center",
          "transition-[width,height,transform,filter,background-color,border-color] duration-300 ease-out",
          isView ? "w-23 h-11" : "w-3.5 h-3.5",
        ].join(" ")}
      >
        <div
          className={[
            "absolute inset-0 rounded-full",
            "transition-[transform,opacity,border-color] duration-300 ease-out",
            isView ? "opacity-100 border border-base/20" : "opacity-0 border border-ink/30",
          ].join(" ")}
          style={{
            background: isView ? "rgba(16, 28, 61, 0.35)" : "transparent",
            backdropFilter: isView ? "blur(10px)" : "none",
          }}
        />

        <div
          className={[
            "absolute rounded-full",
            "transition-[width,height,transform,opacity,background-color] duration-300 ease-out",
            isView ? "w-4.5 h-4.5 opacity-0" : "w-2.5 h-2.5 opacity-100",
          ].join(" ")}
          style={{ backgroundColor: "#1800ad" }}
        />

        <div
          className={[
            "absolute rounded-full",
            "transition-[opacity,transform] duration-300 ease-out",
            isView ? "opacity-100 scale-100" : "opacity-0 scale-90",
          ].join(" ")}
          style={{
            width: 10,
            height: 10,
            backgroundColor: "#1800ad",
            boxShadow: "0 0 0 0 rgba(16,28,61,0.0)",
            animation: isView ? "cursorPulse 900ms ease-in-out infinite" : "none",
          }}
        />

        <span
          className={[
            "relative z-10 text-[13px] font-semibold tracking-[0.06em] uppercase",
            "transition-all duration-200 ease-out",
            showLabel ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
          ].join(" ")}
          style={{ color: "#e8e7e7" }}
        >
          {label}
        </span>
      </div>
    </div>
  )

  if (fsHost) return createPortal(cursorNode, fsHost)
  return cursorNode
}
