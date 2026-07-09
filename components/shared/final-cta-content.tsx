"use client"

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion"
import type { MotionStyle, Variants } from "framer-motion"
import Link from "next/link"
import type { PointerEvent, Ref } from "react"
import { useEffect, useState } from "react"
import { useI18n } from "@/components/providers/i18n"

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/chazinhodociel/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sarah-dumitrache/" },
  { label: "GitHub", href: "https://github.com/sarahaliriel" },
  { label: "Discord", href: "https://discord.com/users/942126894478950530" },
] as const

const RESUME_HREF = "/cv/Sarah-Design.CV.pdf"

const reveal: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
}

function LocalTime({ label }: { label: string }) {
  const [localTime, setLocalTime] = useState("--:--:--")
  const [localZone, setLocalZone] = useState("Lisboa")

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("pt-PT", {
      timeZone: "Europe/Lisbon",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "short",
    })
    const updateTime = () => {
      const parts = formatter.formatToParts(new Date())
      setLocalTime(parts.filter((part) => part.type !== "timeZoneName").map((part) => part.value).join("").trim())
      setLocalZone(parts.find((part) => part.type === "timeZoneName")?.value ?? "Lisboa")
    }

    updateTime()
    const interval = window.setInterval(updateTime, 1000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="text-center">
      <span className="block text-[#1e1e1e]/48">{label}</span>
      <time className="mt-1.5 block font-medium tabular-nums tracking-[0.08em] text-[#1e1e1e]/82 sm:mt-2">
        {localTime} {localZone}
      </time>
    </div>
  )
}

type FinalCtaContentProps = {
  titleLines: string[]
  button: string
  id?: string
  style?: MotionStyle
  buttonStyle?: MotionStyle
  buttonAnchorRef?: Ref<HTMLDivElement>
  interactive?: boolean
  animateReveal?: boolean
  externalButton?: boolean
}

export default function FinalCtaContent({
  titleLines,
  button,
  id = "final-cta",
  style,
  buttonStyle,
  buttonAnchorRef,
  interactive = true,
  animateReveal = true,
  externalButton = false,
}: FinalCtaContentProps) {
  const { t } = useI18n()
  const reducedMotion = Boolean(useReducedMotion())
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 70, damping: 18, mass: 0.8 })
  const y = useSpring(rawY, { stiffness: 70, damping: 18, mass: 0.8 })
  const buttonLines = (() => {
    const words = button.trim().split(/\s+/)
    if (words.length < 2) return [button]
    const splitAt = Math.ceil(words.length / 2)
    return [words.slice(0, splitAt).join(" "), words.slice(splitAt).join(" ")]
  })()
  const revealProps = animateReveal && !reducedMotion
    ? { variants: reveal, initial: "hidden" as const, whileInView: "show" as const, viewport: { once: true, amount: 0.18 } }
    : {}
  const pillClassName =
    "group relative inline-flex h-13 w-full max-w-sm items-center justify-center overflow-hidden rounded-full border border-[#1e1e1e]/30 px-5 text-center text-[11px] font-medium text-[#1e1e1e]/86 transition-[border-color,color,transform] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-0.5 hover:border-[#1e1e1e]/70 hover:text-[#e8e7e7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1e1e1e] sm:h-16 sm:w-72 sm:px-7 sm:text-[13px] lg:h-18"

  const move = (event: PointerEvent<HTMLElement>) => {
    if (reducedMotion || !interactive || event.pointerType === "touch") return
    const rect = event.currentTarget.getBoundingClientRect()
    rawX.set(((event.clientX - rect.left) / rect.width - 0.5) * 24)
    rawY.set(((event.clientY - rect.top) / rect.height - 0.5) * 24)
  }

  const reset = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <motion.section
      id={id}
      aria-labelledby={`${id}-title`}
      aria-hidden={!interactive}
      inert={!interactive}
      style={style}
      onPointerMove={move}
      onPointerLeave={reset}
      className="relative flex min-h-svh w-full overflow-hidden bg-[#e8e7e7] px-4 pb-7 pt-10 text-[#1e1e1e] sm:px-8 sm:pb-9 sm:pt-16 lg:px-12 lg:pb-10 lg:pt-20"
    >
      <div className="relative mx-auto flex w-full max-w-370 flex-1 flex-col justify-between gap-8 sm:gap-10">
        <div className="flex flex-1 flex-col items-center justify-center text-center sm:items-stretch sm:pb-10 sm:text-left lg:pb-14">
          <motion.h2
            id={`${id}-title`}
            className="relative z-10 font-display text-[clamp(1.75rem,8.2vw,6rem)] font-medium uppercase leading-[.83] tracking-[-.07em]"
            {...revealProps}
          >
            {titleLines.map((line) => (
              <span key={line} className="block sm:whitespace-nowrap">{line}</span>
            ))}
          </motion.h2>

          <div className="relative z-20 mt-14 w-full border-t border-[#1e1e1e]/28 sm:mt-[clamp(2.5rem,6vh,5.5rem)]">
            <div
              ref={buttonAnchorRef}
              className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 sm:left-auto sm:right-[clamp(1rem,8vw,8rem)] sm:translate-x-0"
            >
              {externalButton ? (
                <div aria-hidden="true" data-orb-anchor="cta" className="aspect-square w-[clamp(112px,13vw,202px)]" />
              ) : (
                <motion.div style={{ x, y, ...buttonStyle }}>
                  <Link
                    href="mailto:dumitrachebusiness@gmail.com"
                    aria-label={button}
                    tabIndex={interactive ? undefined : -1}
                    className="group relative grid aspect-square w-[clamp(112px,13vw,202px)] place-items-center overflow-hidden rounded-full bg-[#1800ad] p-5 text-center font-display text-[clamp(.68rem,.9vw,.88rem)] font-semibold uppercase leading-[1.05] text-[#e8e7e7] transition-[transform,box-shadow,color] duration-700 hover:scale-[1.07] hover:text-[#1800ad] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1e1e1e]"
                  >
                    <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 rounded-full bg-[#e8e7e7] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100" />
                    <span className="relative z-10 grid place-items-center">
                      {buttonLines.map((line) => <span key={line} className="block">{line}</span>)}
                    </span>
                    <span aria-hidden="true" className="absolute right-[18%] top-1/2 z-10 -translate-y-1/2 text-base transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-[calc(50%+0.25rem)]">↗</span>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>

          <motion.div
            className="mt-20 flex w-full max-w-sm flex-col items-center gap-2.5 sm:mt-9 sm:max-w-152 sm:flex-row sm:items-stretch sm:gap-4 lg:mt-11"
            {...revealProps}
          >
            <a href="mailto:dumitrachebusiness@gmail.com" tabIndex={interactive ? undefined : -1} className={pillClassName}>
              <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 rounded-full bg-[#1e1e1e] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100" />
              <span className="relative z-10">dumitrachebusiness@gmail.com</span>
            </a>
            <a href={RESUME_HREF} download tabIndex={interactive ? undefined : -1} className={pillClassName} aria-label={t("moreAboutCtaResume")}>
              <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 rounded-full bg-[#1e1e1e] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100" />
              <span className="relative z-10 uppercase">{t("moreAboutCtaResume")}</span>
            </a>
          </motion.div>
        </div>

        <footer className="grid gap-4 border-t border-[#1e1e1e]/16 pt-4 text-center text-[9px] uppercase tracking-[0.12em] sm:grid-cols-[1fr_1fr_1fr] sm:items-end sm:gap-6 sm:border-0 sm:pt-0 sm:text-left sm:text-[11px] lg:text-xs">
          <div className="sm:text-left">
            <span className="block text-[#1e1e1e]/48">{t("moreAboutFooterEdition")}</span>
            <span className="mt-1.5 block tracking-normal text-[#1e1e1e]/82 sm:mt-2">2026 © Sarah Aliriel</span>
          </div>
          <LocalTime label={t("moreAboutFooterLocalTime")} />
          <nav aria-label={t("moreAboutFooterSocials")}>
            <span className="block text-[#1e1e1e]/48 sm:text-right">{t("moreAboutFooterSocials")}</span>
            <div className="mt-1.5 flex flex-wrap justify-center gap-x-4 gap-y-1.5 tracking-normal sm:mt-2 sm:justify-end sm:gap-x-5 sm:gap-y-2">
              {SOCIALS.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noreferrer" tabIndex={interactive ? undefined : -1} className="link-underline-invert normal-case text-[#1e1e1e]/82">
                  {social.label}
                </a>
              ))}
            </div>
          </nav>
        </footer>
      </div>
    </motion.section>
  )
}
