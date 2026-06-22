"use client"

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import { useCallback, useEffect, useLayoutEffect, useState } from "react"

const ORB_STOPS = [0, 0.2, 0.45, 0.7, 0.95, 1]
const MAGNET_RADIUS = 160
const CTA_THRESHOLD = 0.95

function sizesForViewport(width: number) {
  if (width < 640) return [16, 20, 28, 40, 112, 112]
  if (width < 1024) return [20, 30, 44, 62, 145, 145]
  return [24, 36, 54, 78, 170, 170]
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function sampleTrack(progress: number, values: number[]) {
  const p = clamp(progress, ORB_STOPS[0], ORB_STOPS[ORB_STOPS.length - 1])
  for (let index = 1; index < ORB_STOPS.length; index += 1) {
    if (p > ORB_STOPS[index]) continue
    const start = ORB_STOPS[index - 1]
    const end = ORB_STOPS[index]
    const local = (p - start) / Math.max(0.0001, end - start)
    return values[index - 1] + (values[index] - values[index - 1]) * local
  }
  return values[values.length - 1]
}

export default function NarrativeOrb() {
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const [isCta, setIsCta] = useState(false)

  const viewportWidth = useMotionValue(1440)
  const viewportHeight = useMotionValue(900)
  const anchorX = useMotionValue(1123)
  const anchorY = useMotionValue(522)
  const reducedMotion = useMotionValue(prefersReducedMotion ? 1 : 0)
  const magneticX = useMotionValue(0)
  const magneticY = useMotionValue(0)
  const proximity = useMotionValue(0)
  const stretchX = useMotionValue(1)
  const stretchY = useMotionValue(1)

  const measure = useCallback(() => {
    const width = window.innerWidth
    const height = window.innerHeight
    const sizes = sizesForViewport(width)
    const finalSize = sizes[sizes.length - 1]
    const anchor = document.querySelector<HTMLElement>('[data-orb-anchor="cta"]')

    let measuredAnchorX = width < 640 ? width - 24 - finalSize / 2 : width * 0.78
    let measuredAnchorY = width < 640 ? height - 28 - finalSize / 2 : height * 0.58

    if (anchor) {
      const rect = anchor.getBoundingClientRect()
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - height)
      measuredAnchorX = rect.left + rect.width / 2
      measuredAnchorY = rect.top + window.scrollY + rect.height / 2 - maxScroll
    }

    const edge = finalSize / 2 + 16
    viewportWidth.set(width)
    viewportHeight.set(height)
    anchorX.set(clamp(measuredAnchorX, edge, width - edge))
    anchorY.set(clamp(measuredAnchorY, edge, height - edge))
  }, [anchorX, anchorY, viewportHeight, viewportWidth])

  useLayoutEffect(() => {
    let frame = requestAnimationFrame(measure)
    const delayed = window.setTimeout(measure, 320)
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    })
    const anchor = document.querySelector<HTMLElement>('[data-orb-anchor="cta"]')

    observer.observe(document.body)
    if (anchor) observer.observe(anchor)
    window.addEventListener("resize", measure)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(delayed)
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [measure])

  useEffect(() => {
    reducedMotion.set(prefersReducedMotion ? 1 : 0)
  }, [prefersReducedMotion, reducedMotion])

  const xTrack = useTransform(() => {
    if (reducedMotion.get()) return anchorX.get()
    const width = viewportWidth.get()
    return sampleTrack(scrollYProgress.get(), [width * 0.62, width * 0.14, width * 0.72, width * 0.48, width * 0.78, anchorX.get()])
  })
  const yTrack = useTransform(() => {
    if (reducedMotion.get()) return anchorY.get()
    const height = viewportHeight.get()
    return sampleTrack(scrollYProgress.get(), [height * 0.58, height * 0.7, height * 0.45, height * 0.72, height * 0.58, anchorY.get()])
  })
  const sizeTrack = useTransform(() => {
    const sizes = sizesForViewport(viewportWidth.get())
    return reducedMotion.get() ? sizes[sizes.length - 1] : sampleTrack(scrollYProgress.get(), sizes)
  })

  const x = useSpring(xTrack, { stiffness: 72, damping: 24, mass: 0.72 })
  const y = useSpring(yTrack, { stiffness: 72, damping: 24, mass: 0.72 })
  const size = useSpring(sizeTrack, { stiffness: 76, damping: 25, mass: 0.7 })
  const magnetX = useSpring(magneticX, { stiffness: 145, damping: 22, mass: 0.55 })
  const magnetY = useSpring(magneticY, { stiffness: 145, damping: 22, mass: 0.55 })
  const scaleX = useSpring(stretchX, { stiffness: 150, damping: 20, mass: 0.52 })
  const scaleY = useSpring(stretchY, { stiffness: 150, damping: 20, mass: 0.52 })
  const proximitySpring = useSpring(proximity, { stiffness: 120, damping: 22, mass: 0.55 })

  const orbX = useTransform(() => x.get() + magnetX.get())
  const orbY = useTransform(() => y.get() + magnetY.get())
  const textOpacity = useTransform(scrollYProgress, [0.88, 0.95], [0, 1])
  const textScale = useTransform(scrollYProgress, [0.88, 0.97], [0.86, 1])
  const arrowOpacity = useTransform(scrollYProgress, [0.91, 0.97], [0, 1])
  const reducedOpacity = useTransform(scrollYProgress, [0.88, 0.94], [0, 1])
  const orbOpacity = useTransform(() => (reducedMotion.get() ? reducedOpacity.get() : 1))
  const glow = useTransform(
    proximitySpring,
    [0, 1],
    ["0 18px 52px rgba(24, 0, 173, 0.28)", "0 22px 72px rgba(24, 0, 173, 0.48)"]
  )
  const rippleOpacity = useTransform(proximitySpring, [0, 1], [0, 0.34])
  const rippleScale = useTransform(proximitySpring, [0, 1], [0.76, 1.12])

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsCta((current) => {
      const next = latest >= CTA_THRESHOLD
      return current === next ? current : next
    })
  })

  useEffect(() => {
    setIsCta(scrollYProgress.get() >= CTA_THRESHOLD)
  }, [scrollYProgress])

  useEffect(() => {
    if (prefersReducedMotion) return
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)")

    const reset = () => {
      magneticX.set(0)
      magneticY.set(0)
      proximity.set(0)
      stretchX.set(1)
      stretchY.set(1)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer.matches) return reset()

      const dx = event.clientX - x.get()
      const dy = event.clientY - y.get()
      const distance = Math.hypot(dx, dy)
      if (distance >= MAGNET_RADIUS || distance === 0) return reset()

      const influence = 1 - distance / MAGNET_RADIUS
      const pull = 14 * influence
      const horizontal = Math.abs(dx) / distance
      const vertical = Math.abs(dy) / distance

      magneticX.set((dx / distance) * pull)
      magneticY.set((dy / distance) * pull)
      proximity.set(influence)
      stretchX.set(1 + horizontal * influence * 0.065 - vertical * influence * 0.022)
      stretchY.set(1 + vertical * influence * 0.065 - horizontal * influence * 0.022)
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    window.addEventListener("blur", reset)
    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("blur", reset)
    }
  }, [magneticX, magneticY, prefersReducedMotion, proximity, stretchX, stretchY, x, y])

  return (
    <motion.a
      href={isCta ? "mailto:dumitrachebusiness@gmail.com" : undefined}
      aria-hidden={!isCta}
      aria-label={isCta ? "Vamos conversar por email" : undefined}
      tabIndex={isCta ? 0 : -1}
      data-narrative-orb
      data-orb-state={isCta ? "cta" : "journey"}
      className="narrative-orb fixed left-0 top-0 z-60 grid place-items-center rounded-full text-[#e8e7e7] outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-4 focus-visible:ring-offset-[#1800ad]"
      style={{
        boxShadow: glow,
        height: size,
        opacity: orbOpacity,
        pointerEvents: isCta ? "auto" : "none",
        scaleX,
        scaleY,
        width: size,
        x: orbX,
        y: orbY,
      }}
    >
      <span className="narrative-orb__surface" aria-hidden="true" />
      <motion.span
        className="narrative-orb__ripple"
        aria-hidden="true"
        style={{ opacity: rippleOpacity, scale: rippleScale }}
      />

      <motion.span
        className="relative z-10 flex flex-col items-center font-display text-[clamp(0.67rem,1.08vw,0.96rem)] font-semibold uppercase leading-[0.94] tracking-[-0.025em]"
        style={{ opacity: textOpacity, scale: textScale }}
      >
        <span>VAMOS</span>
        <span>CONVERSAR</span>
      </motion.span>

      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="absolute right-[19%] top-[17%] z-10 h-[clamp(12px,1.2vw,18px)] w-[clamp(12px,1.2vw,18px)]"
        style={{ opacity: arrowOpacity }}
      >
        <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    </motion.a>
  )
}
