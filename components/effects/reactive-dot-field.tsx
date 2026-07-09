"use client"

import { useEffect, useRef } from "react"

type ReactiveDotFieldProps = {
  className?: string
  fill?: boolean
}

type Point = {
  x: number
  y: number
  tone: number
}

const COLORS = ["24, 0, 173", "167, 139, 250", "232, 231, 231"] as const

export function ReactiveDotField({ className = "", fill = false }: ReactiveDotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d", { alpha: true })
    if (!context) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const mobile = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches
    const interactive = !reducedMotion && !mobile
    const cursor = { x: -1000, y: -1000 }
    let points: Point[] = []
    let frame = 0
    let visible = true
    let width = 0
    let height = 0

    const draw = () => {
      frame = 0
      context.clearRect(0, 0, width, height)

      if (interactive && cursor.x > -500) {
        const glow = context.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, 210)
        glow.addColorStop(0, "rgba(24, 0, 173, 0.14)")
        glow.addColorStop(0.45, "rgba(112, 78, 216, 0.055)")
        glow.addColorStop(1, "rgba(24, 0, 173, 0)")
        context.fillStyle = glow
        context.fillRect(cursor.x - 210, cursor.y - 210, 420, 420)
      }

      for (const point of points) {
        const deltaX = point.x - cursor.x
        const deltaY = point.y - cursor.y
        const distance = Math.hypot(deltaX, deltaY)
        const influence = interactive ? Math.max(0, 1 - distance / 190) : 0
        const directionX = distance > 0 ? deltaX / distance : 0
        const directionY = distance > 0 ? deltaY / distance : 0
        const displacement = influence * influence * 15
        const x = point.x + directionX * displacement
        const y = point.y + directionY * displacement
        const radius = (mobile ? 0.85 : 1.05) + influence * 1.45
        const baseOpacity = point.tone === 0 ? 0.2 : point.tone === 1 ? 0.14 : 0.11
        const opacity = Math.min(0.5, baseOpacity + influence * 0.3)

        context.beginPath()
        context.arc(x, y, radius, 0, Math.PI * 2)
        context.fillStyle = `rgba(${COLORS[point.tone]}, ${opacity})`
        context.fill()
      }
    }

    const scheduleDraw = () => {
      if (!visible || frame) return
      frame = window.requestAnimationFrame(draw)
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const density = Math.min(window.devicePixelRatio || 1, 1.5)
      width = Math.max(1, Math.round(rect.width))
      height = Math.max(1, Math.round(rect.height))
      canvas.width = Math.round(width * density)
      canvas.height = Math.round(height * density)
      context.setTransform(density, 0, 0, density, 0, 0)

      const spacing = mobile ? 58 : 46
      const offsetX = (width % spacing) / 2
      const offsetY = (height % spacing) / 2
      const nextPoints: Point[] = []

      for (let y = offsetY; y <= height; y += spacing) {
        for (let x = offsetX; x <= width; x += spacing) {
          const column = Math.round((x - offsetX) / spacing)
          const row = Math.round((y - offsetY) / spacing)
          nextPoints.push({ x, y, tone: (column * 3 + row * 5) % COLORS.length })
        }
      }

      points = nextPoints
      scheduleDraw()
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!visible) return
      const rect = canvas.getBoundingClientRect()
      cursor.x = event.clientX - rect.left
      cursor.y = event.clientY - rect.top
      scheduleDraw()
    }

    const handlePointerLeave = () => {
      cursor.x = -1000
      cursor.y = -1000
      scheduleDraw()
    }

    const resizeObserver = new ResizeObserver(resize)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) scheduleDraw()
    })

    resizeObserver.observe(canvas)
    intersectionObserver.observe(canvas)
    resize()

    if (interactive) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true })
      document.documentElement.addEventListener("pointerleave", handlePointerLeave)
    }

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener("pointermove", handlePointerMove)
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute w-full ${fill ? "inset-0 h-full" : "inset-x-0 top-0 h-[min(1500px,180svh)]"} ${className}`}
      aria-hidden="true"
    />
  )
}
