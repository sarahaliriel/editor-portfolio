"use client"

import Image from "next/image"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useI18n } from "@/components/i18n"

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v))
}

export default function HeroAboutTransition() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [progress, setProgress] = useState(0)
  const [introDone, setIntroDone] = useState(false)

  useLayoutEffect(() => {
    const onDone = () => setIntroDone(true)
    window.addEventListener("intro:done", onDone)
    return () => window.removeEventListener("intro:done", onDone)
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    let raf = 0

    const update = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const travel = Math.max(1, rect.height - vh)
      const p = clamp01((-rect.top) / travel)
      setProgress(p)
      raf = requestAnimationFrame(update)
    }

    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [])

  const styles = useMemo(() => {
    const slide = clamp01((progress - 0.08) / 0.75)
    const y = (1 - slide) * 100
    return { y }
  }, [progress])

  return (
    <section ref={sectionRef} className="relative h-[220svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div
          className="absolute inset-0 bg-base transition-[transform,filter,opacity] duration-1100ms ease-[cubic-bezier(.16,1,.22,1)]"
          style={{
            transform: introDone ? "translate3d(0,0,0) scale(1)" : "translate3d(0,10px,0) scale(1.035)",
            filter: introDone ? "blur(0px)" : "blur(2px)",
            opacity: introDone ? 1 : 0.98,
          }}
        >
          <HeroScene introDone={introDone} />
        </div>

        <div
          className="absolute inset-0 z-20"
          style={{
            transform: `translate3d(0, ${styles.y}%, 0)`,
            background: "#1e1e1e",
          }}
        >
          <AboutScene />
        </div>
      </div>

      <div className="h-[60svh]" style={{ background: "#1e1e1e" }} />
    </section>
  )
}

function HeroScene({ introDone }: { introDone: boolean }) {
  const { t } = useI18n()
  const [signaturePhase, setSignaturePhase] = useState<0 | 1 | 2 | 3>(0)

  useEffect(() => {
    if (!introDone) {
      setSignaturePhase(0)
      return
    }

    const t1 = window.setTimeout(() => setSignaturePhase(1), 160)
    const t2 = window.setTimeout(() => setSignaturePhase(2), 260)
    const t3 = window.setTimeout(() => setSignaturePhase(3), 520)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
    }
  }, [introDone])

  const show = signaturePhase >= 1
  const reveal = signaturePhase >= 2

  return (
    <section id="home-hero" className="relative min-h-svh overflow-hidden text-ink">
      <div className="absolute left-4 top-5 z-30 sm:left-8 sm:top-7">
        <div className="text-[14px] backdrop-blur-xl sm:text-[15px]">{t("heroAvailable")}</div>
      </div>

      <div className="container-bleed flex min-h-svh flex-col pb-10 pt-28 sm:pb-12 sm:pt-32 lg:pb-14 lg:pt-36">
        <div className="flex flex-1 items-center justify-center">
          <div className="relative left-1/2 w-screen max-w-none -translate-x-1/2 -translate-y-[10vh]">
            <h1
              className={`font-display font-black select-none text-center text-[clamp(88px,19vw,320px)]! text-ink leading-[0.88] tracking-[-0.055em] max-md:leading-[0.95] max-md:tracking-[-0.045em]
              transition-[transform,opacity,filter] duration-600 ease-[cubic-bezier(.16,1,.3,1)]
              ${introDone ? "scale-100 opacity-100 blur-0" : "scale-[1.06] opacity-0 blur-[2px]"}`}
            >
              portfolio
            </h1>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className={[
                  "relative select-none",
                  "transition-[transform,opacity,filter] duration-520 ease-[cubic-bezier(.16,1,.25,1)]",
                  show ? "opacity-95 translate-y-0 scale-100 blur-0" : "opacity-0 translate-y-2 scale-[1.02] blur-[6px]",
                ].join(" ")}
                style={{
                  clipPath: reveal ? "inset(0 0 0 0 round 0px)" : "inset(0 100% 0 0 round 0px)",
                  transitionProperty: "clip-path, transform, opacity, filter",
                }}
              >
                <Image
                  src="/sarahaliriel.png"
                  alt="Assinatura Sarah Aliriel"
                  width={2600}
                  height={600}
                  priority
                  className="h-auto w-[clamp(240px,46vw,860px)] translate-y-[2%] select-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 text-[15px] opacity-75 sm:grid-cols-3 sm:text-[16px]">
          <div className="sm:text-left">{t("heroRole1")}</div>
          <div className="sm:text-center">{t("heroRole2")}</div>
          <div className="sm:text-right">{t("heroRole3")}</div>
        </div>
      </div>
    </section>
  )
}

function AboutScene() {
  const { t } = useI18n()
  const hello = useMemo(() => t("aboutHello").split("\n"), [t])
  const bio = useMemo(() => t("aboutBio").split("\n"), [t])

  return (
    <section
      id="about"
      className="relative min-h-svh"
      style={{
        background: "#1e1e1e",
        color: "#e8e7e7",
      }}
    >
      <div className="container-bleed flex min-h-svh items-center py-14 sm:py-16">
        <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-[0.95fr_1.25fr] lg:items-center lg:gap-14">
          <div className="flex flex-col">
            <div className="font-display font-extrabold tracking-tight text-[52px] leading-[0.95] sm:text-[64px] lg:text-[92px]">
              +5M VIEWS
            </div>

            <div className="mt-7 font-display font-extrabold tracking-tight text-[30px] leading-[0.98] sm:text-[34px] lg:text-[38px]">
              {hello[0]}
              <br />
              {hello[1]}
              <br />
              {hello[2]}
            </div>

            <p className="mt-8 max-w-[ch] text-[13px] leading-[1.45] tracking-tight opacity-85 text-justify sm:text-[14px]">
              {bio[0]}
              <br />
              {bio[1]}
              <br />
              {bio[2]}
            </p>
          </div>
          <div className="relative">
          </div>
        </div>
      </div>
    </section>
  )
}