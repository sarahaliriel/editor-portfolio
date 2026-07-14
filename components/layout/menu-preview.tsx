"use client"

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion"
import Image from "next/image"
import { useEffect, useState, type PointerEvent } from "react"
import { useI18n } from "@/components/providers/i18n"
import type { MenuPreviewType } from "@/data/menu-navigation"

type MenuPreviewProps = {
  type: MenuPreviewType
}

const PREVIEW_TYPES: readonly MenuPreviewType[] = ["home", "about", "design", "motion", "contact"]
const previewClassName = "relative h-full min-h-0 overflow-hidden"

export function MenuPreview({ type }: MenuPreviewProps) {
  const reducedMotion = Boolean(useReducedMotion())
  const [canParallax, setCanParallax] = useState(false)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 90, damping: 24, mass: 0.55 })
  const y = useSpring(rawY, { stiffness: 90, damping: 24, mass: 0.55 })

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)")
    const update = () => setCanParallax(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!canParallax || reducedMotion || event.pointerType !== "mouse") return
    const rect = event.currentTarget.getBoundingClientRect()
    rawX.set(((event.clientX - rect.left) / rect.width - 0.5) * 10)
    rawY.set(((event.clientY - rect.top) / rect.height - 0.5) * 8)
  }

  const reset = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <div
      onPointerMove={move}
      onPointerLeave={reset}
      className="relative h-full min-h-0 overflow-hidden border border-[#e8e7e7]/14 bg-[#1e1e1e]/38"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(232,231,231,0.08),transparent_34%),radial-gradient(circle_at_78%_82%,rgba(24,0,173,0.16),transparent_36%)]" />
      {PREVIEW_TYPES.map((previewType) => {
        const active = previewType === type

        return (
          <motion.div key={previewType} className="pointer-events-none absolute inset-0 will-change-transform" style={{ x, y }}>
            <motion.div
              aria-hidden={!active}
              className="absolute inset-0"
              initial={false}
              animate={
                active
                  ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
                  : {
                      opacity: 0,
                      y: reducedMotion ? 0 : 7,
                      scale: reducedMotion ? 1 : 0.994,
                      filter: reducedMotion ? "blur(0px)" : canParallax ? "blur(3px)" : "blur(1px)",
                    }
              }
              transition={{ duration: reducedMotion ? 0.12 : 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <PreviewComposition type={previewType} />
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}

function PreviewComposition({ type }: { type: MenuPreviewType }) {
  if (type === "home") return <HomePreview />
  if (type === "about") return <AboutPreview />
  if (type === "design") return <DesignPreview />
  if (type === "motion") return <MotionPreview />
  return <ContactPreview />
}

function HomePreview() {
  const { t } = useI18n()

  return (
    <article className={previewClassName} aria-label={`${t("menuHomeLabel")} · ${t("menuPreview")}`}>
      <div className="absolute inset-x-[7%] top-[8%] flex items-center justify-between border-t border-[#e8e7e7]/28 pt-3 text-[9px] uppercase tracking-[0.2em] text-[#e8e7e7]/55">
        <span>{t("menuPreviewSelectedEntry")}</span>
        <span>01 / 05</span>
      </div>
      <p className="absolute left-[5%] top-[22%] font-display text-[clamp(3.4rem,9vw,10rem)] font-black uppercase leading-[0.72] tracking-[-0.08em] text-[#e8e7e7]/92">
        Port<br />folio
      </p>
      <div className="absolute inset-x-[10%] top-[31%] z-10">
        <Image src="/images/profile/signature-sarah-aliriel.png" alt="Assinatura Sarah Aliriel" width={1920} height={1080} priority className="h-auto w-full object-contain opacity-95" />
      </div>
      <div className="absolute bottom-[8%] left-[7%] right-[7%] grid grid-cols-[1fr_auto] items-end border-b border-[#e8e7e7]/28 pb-3 text-[9px] uppercase tracking-[0.16em] text-[#e8e7e7]/62">
        <span>{t("menuPreviewCreativeFields")}</span>
        <span className="h-3 w-3 rounded-full bg-[#1800ad]" aria-hidden="true" />
      </div>
    </article>
  )
}

function AboutPreview() {
  const { t } = useI18n()

  return (
    <article className={previewClassName} aria-label={`${t("menuAboutLabel")} · ${t("menuPreview")}`}>
      <div className="absolute bottom-[7%] left-[8%] top-[7%] w-[57%] overflow-hidden border border-[#e8e7e7]/18">
        <Image src="/images/moreabout/aboutme-photo.png" alt="Sarah Aliriel Dumitrache" fill sizes="(max-width: 767px) 62vw, 32vw" className="object-cover object-[center_32%] grayscale" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(30,30,30,0.54),transparent_48%)]" />
      </div>
      <div className="absolute right-[7%] top-[8%] text-right text-[9px] uppercase tracking-[0.18em] text-[#e8e7e7]/55">
        <p>{t("menuPreviewProfile")} / 2026</p>
        <p className="mt-1 text-[#1800ad]">41.38° N · 8.76° W</p>
      </div>
      <div className="absolute bottom-[10%] left-[46%] right-[5%] z-10 border-t border-[#e8e7e7]/30 pt-3">
        <p className="font-display text-[clamp(2rem,4.8vw,5.5rem)] font-semibold uppercase leading-[0.78] tracking-[-0.065em]">Sarah<br />Aliriel</p>
        <p className="mt-4 text-[9px] uppercase tracking-[0.17em] text-[#e8e7e7]/62">Póvoa de Varzim · Portugal</p>
      </div>
      <span className="absolute right-[8%] top-[29%] font-display text-[clamp(4rem,8vw,9rem)] font-black leading-none text-[#e8e7e7]/8">02</span>
    </article>
  )
}

function DesignPreview() {
  const { t } = useI18n()

  return (
    <article className={previewClassName} aria-label={`${t("menuDesignLabel")} · ${t("menuPreview")}`}>
      <div className="absolute left-[7%] top-[7%] z-20 w-[42%] border border-[#e8e7e7]/20 bg-[#191919] p-1.5 shadow-2xl">
        <Image src="/images/gallery/mockup-heros/mock-frigi.png" alt="Mockup Frigideira AI" width={1080} height={1920} sizes="(max-width: 767px) 42vw, 23vw" className="h-auto w-full" />
      </div>
      <div className="absolute right-[7%] top-[16%] z-10 w-[38%] rotate-2 border border-[#e8e7e7]/20 bg-[#191919] p-1.5">
        <Image src="/images/gallery/mockup-heros/mock-trt.png" alt="Mockup The Real Tocha" width={1080} height={1920} sizes="(max-width: 767px) 38vw, 21vw" className="h-auto w-full" />
      </div>
      <div className="absolute bottom-[5%] left-[35%] z-30 w-[29%] -rotate-2 border border-[#e8e7e7]/20 bg-[#191919] p-1">
        <Image src="/images/gallery/mockup-heros/mock-sdp.png" alt="Mockup SDP" width={1080} height={1920} sizes="(max-width: 767px) 29vw, 16vw" className="h-auto w-full" />
      </div>
      <div className="absolute bottom-[7%] left-[7%] z-40 text-[9px] uppercase tracking-[0.18em] text-[#e8e7e7]/65">
        <p className="text-[#1800ad]">03 — {t("menuPreviewVisualSystems")}</p>
        <p className="mt-1">{t("menuPreviewDesignFields")}</p>
      </div>
      <p className="absolute bottom-[5%] right-[4%] font-display text-[clamp(3rem,7vw,8rem)] font-black uppercase leading-none tracking-[-0.07em] text-[#e8e7e7]/8">Gallery</p>
    </article>
  )
}

function MotionPreview() {
  const { t } = useI18n()

  return (
    <article className={previewClassName} aria-label={`${t("menuMotionLabel")} · ${t("menuPreview")}`}>
      <div className="absolute inset-y-[7%] left-[12%] w-[58%] overflow-hidden border border-[#e8e7e7]/18">
        <Image src="/images/projects/motion-thread.png" alt="Motion Thread project thumbnail" fill sizes="(max-width: 767px) 62vw, 32vw" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(30,30,30,0.66),transparent_48%)]" />
      </div>
      <div className="absolute right-[7%] top-[9%] border-l border-[#e8e7e7]/28 pl-3 text-[9px] uppercase tracking-[0.18em] text-[#e8e7e7]/58">
        <p>Archive 04</p><p className="mt-1">{t("menuPreviewMotionStudy")}</p><p className="mt-1 text-[#1800ad]">2025—26</p>
      </div>
      <div className="absolute bottom-[10%] left-[7%] right-[5%] z-10">
        <p className="font-display text-[clamp(2.7rem,6vw,7rem)] font-black uppercase leading-[0.74] tracking-[-0.075em]">Motion<br /><span className="ml-[21%]">Archive</span></p>
        <div className="mt-5 flex items-center gap-3 text-[9px] uppercase tracking-[0.18em] text-[#e8e7e7]/58"><span className="h-2 w-2 rounded-full bg-[#1800ad]" /><span>{t("menuPreviewMotionFields")}</span></div>
      </div>
      <div className="absolute right-[10%] top-[40%] z-10 grid h-16 w-16 place-items-center rounded-full border border-[#e8e7e7]/55 bg-[#1e1e1e]/55 text-xs">▶</div>
    </article>
  )
}

function ContactPreview() {
  const { t } = useI18n()

  return (
    <article className={previewClassName} aria-label={`${t("menuContactLabel")} · ${t("menuPreview")}`}>
      <div className="absolute inset-x-[7%] top-[8%] flex justify-between border-t border-[#e8e7e7]/28 pt-3 text-[9px] uppercase tracking-[0.18em] text-[#e8e7e7]/55"><span>{t("menuPreviewAvailable")}</span><span>05 / {t("menuContactLabel")}</span></div>
      <p className="absolute left-[5%] top-[25%] z-10 max-w-[90%] font-display text-[clamp(2.8rem,6.8vw,8rem)] font-medium uppercase leading-[0.78] tracking-[-0.075em]">{t("menuPreviewMemorable")}</p>
      <div className="absolute bottom-[12%] right-[12%] grid aspect-square w-[clamp(7rem,17vw,15rem)] place-items-center rounded-full bg-[#1800ad] text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[#e8e7e7] shadow-[0_0_80px_rgba(24,0,173,0.25)]">{t("menuPreviewTalk")} <span aria-hidden="true">↗</span></div>
      <p className="absolute bottom-[9%] left-[7%] max-w-[18ch] text-[9px] uppercase leading-relaxed tracking-[0.16em] text-[#e8e7e7]/55">{t("menuPreviewConversation")}</p>
      <span className="absolute left-[8%] top-[11%] h-px w-[22%] bg-[#1800ad]" aria-hidden="true" />
    </article>
  )
}
