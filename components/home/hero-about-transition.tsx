"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { Variants } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import type { MouseEvent } from "react"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useI18n } from "@/components/providers/i18n"
import { clamp01 } from "@/lib/utils"

function smoothStep(value: number) {
  const clamped = clamp01(value)
  return clamped * clamped * (3 - 2 * clamped)
}

const manifestWrap: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.08,
    },
  },
}

const manifestWord: Variants = {
  hidden: {
    opacity: 0,
    x: -22,
    y: 8,
    filter: "blur(10px)",
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.92,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export default function HeroAboutTransition() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [progress, setProgress] = useState(0)
  const [introDone, setIntroDone] = useState(() => {
    if (typeof document === "undefined") return false
    return document.documentElement.dataset.intro === "done"
  })

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
    return { y, aboutProgress: slide, aboutReady: slide > 0.1 }
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
          <AboutScene progress={styles.aboutProgress} reveal={styles.aboutReady} />
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
      const reset = window.setTimeout(() => setSignaturePhase(0), 0)
      return () => window.clearTimeout(reset)
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
                  src="/images/profile/signature-sarah-aliriel.png"
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

function AboutScene({ progress, reveal }: { progress: number; reveal: boolean }) {
  const prefersReducedMotion = useReducedMotion()
  const circleProgress = prefersReducedMotion ? 1 : smoothStep((progress - 0.05) / 0.95)

  return (
    <section
      id="about"
      className="relative h-svh max-h-svh overflow-hidden"
      style={{
        background: "#1e1e1e",
        color: "#e8e7e7",
        height: "100svh",
        maxHeight: "100svh",
        overflow: "hidden",
      }}
    >
      <div className="flex h-svh max-h-svh items-center justify-center overflow-hidden py-8 sm:py-10 lg:py-12">
        <AboutManifest circleProgress={circleProgress} reveal={reveal || Boolean(prefersReducedMotion)} />
      </div>
    </section>
  )
}

function AboutManifest({ circleProgress, reveal }: { circleProgress: number; reveal: boolean }) {
  const { t } = useI18n()
  const [buttonShift, setButtonShift] = useState({ x: 0, y: 0 })

  const lines = useMemo(
    () =>
      [
        {
          text: `${t("aboutManifestLine1")} ${t("aboutManifestLine2")} ${t("aboutManifestLine3")}`,
          align: "right",
          tone: "primary",
          className: "w-full self-end",
        },
        {
          text: `${t("aboutManifestLine4")} ${t("aboutManifestLine5")}`,
          align: "right",
          tone: "secondary",
          className: "w-full self-end sm:mr-[3%]",
        },
        {
          text: `${t("aboutManifestLine6")} ${t("aboutManifestLine7")} ${t("aboutManifestLine8")}`,
          align: "right",
          tone: "primary",
          className: "w-full self-end sm:mr-[11%]",
        },
        {
          text: `${t("aboutManifestLine9")} ${t("aboutManifestLine10")}`,
          align: "right",
          tone: "secondary",
          className: "w-full self-end sm:mr-[5%]",
        },
        {
          text: `${t("aboutManifestLine11")} ${t("aboutManifestLine12")} ${t("aboutManifestLine13")}`,
          align: "right",
          tone: "primary",
          className: "w-full self-end sm:mr-[16%]",
        },
        {
          text: t("aboutManifestLine14"),
          align: "right",
          tone: "secondary",
          className: "w-full self-end sm:mr-[2%]",
        },
      ] as const,
    [t]
  )

  const onButtonMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 7
    setButtonShift({ x, y })
  }

  return (
    <div className="relative mx-auto flex min-w-0 flex-col items-center sm:translate-x-[12vw]" style={{ width: "min(1280px, calc(100% - 72px))" }}>
      <motion.div
        key={lines.map((line) => line.text).join("|")}
        className="relative z-10 mx-auto flex w-full max-w-full flex-col items-center gap-[clamp(0.24rem,0.9svh,0.6rem)] overflow-visible font-display text-[clamp(1.18rem,4.8vw,2rem)] font-normal leading-[1.08] tracking-[0] sm:items-end sm:text-[clamp(1.4rem,2.35vw,2.45rem)]"
        variants={manifestWrap}
        initial="hidden"
        animate={reveal ? "show" : "hidden"}
      >
        {lines.map((line, lineIndex) => {
          const words = line.text.split(" ")
          const alignClass =
            line.align === "right" ? "sm:justify-end sm:text-right" : line.align === "center" ? "sm:justify-center sm:text-center" : "sm:justify-start sm:text-left"
          const toneClass = line.tone === "secondary" ? "text-[rgba(232,231,231,.72)]" : "text-[#e8e7e7]"

          return (
            <motion.span
              key={`${line.text}-${lineIndex}`}
              className={[
                "flex min-w-0 max-w-full flex-wrap justify-center gap-x-[0.16em] gap-y-[0.04em] text-center max-sm:mr-0! sm:flex-nowrap sm:whitespace-nowrap",
                alignClass,
                toneClass,
                line.className,
              ].join(" ")}
              variants={manifestWrap}
            >
              {words.map((word, wordIndex) => (
                <motion.span
                  key={`${word}-${lineIndex}-${wordIndex}`}
                  className="inline-block max-w-full wrap-break-word will-change-[transform,filter,opacity]"
                  variants={manifestWord}
                >
                  {word}
                </motion.span>
              ))}
            </motion.span>
          )
        })}
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-full z-30 mt-[clamp(1rem,2.6svh,1.8rem)] -translate-x-1/2 [--about-start-scale:2.35] sm:left-[calc(-12vw-190px)] sm:translate-x-0 sm:[--about-start-scale:4.6] lg:[--about-start-scale:5.2] xl:[--about-start-scale:5.7]"
        style={{
          opacity: reveal ? 1 : 0,
          transform: "translate3d(var(--tw-translate-x), 0, 0)",
          transition: "opacity 520ms cubic-bezier(.16,1,.3,1)",
          willChange: "opacity",
        }}
      >
        <Link
          href="/more-about"
          onMouseMove={onButtonMove}
          onMouseLeave={() => setButtonShift({ x: 0, y: 0 })}
          className="group relative inline-flex aspect-square w-[clamp(104px,30vw,128px)] items-center justify-center rounded-full border border-transparent p-4 text-center font-display text-[clamp(0.62rem,2.4vw,0.76rem)] font-semibold uppercase leading-tight tracking-[0] text-[#1e1e1e] transition-[color,border-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:border-[rgba(232,231,231,.35)] hover:text-[#e8e7e7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8e7e7] sm:w-[clamp(136px,11.5vw,176px)] sm:p-5 sm:text-[clamp(0.72rem,0.78vw,0.9rem)]"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-transparent bg-[#e8e7e7] shadow-[0_20px_60px_rgba(0,0,0,.28)] transition-[background-color,box-shadow,border-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:border-[rgba(232,231,231,.35)] group-hover:bg-[#1e1e1e] group-hover:shadow-[0_20px_58px_rgba(0,0,0,.3)]"
            style={{
              transform: `scale(calc(1 + (var(--about-start-scale) - 1) * ${1 - circleProgress}))`,
              transformOrigin: "center",
              willChange: "transform",
            }}
          />
          <motion.span
            animate={buttonShift}
            transition={{ type: "spring", stiffness: 150, damping: 28, mass: 0.5 }}
            className="relative z-10 block min-w-[6.8em]"
          >
            <span className="block transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-1 group-hover:opacity-0">
              {t("aboutManifestCta")}
            </span>
            <span className="absolute inset-0 flex items-center justify-center translate-y-1 opacity-0 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
              {t("aboutManifestCtaHover")}
            </span>
          </motion.span>
        </Link>
      </motion.div>
    </div>
  )
}
